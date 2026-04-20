import request from 'supertest';
import { app } from '../src/index';
import jwt from 'jsonwebtoken';

jest.mock('../src/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    project: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    submission: {
      findMany: jest.fn(),
    },
  },
}));

const { prisma } = require('../src/lib/prisma');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key';

const clientToken = jwt.sign({ id: 'client-id', role: 'CLIENT' }, JWT_SECRET);
const freelancerToken = jwt.sign({ id: 'freelancer-id', role: 'FREELANCER' }, JWT_SECRET);
const adminToken = jwt.sign({ id: 'admin-id', role: 'ADMIN' }, JWT_SECRET);

describe('Project Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /projects (Escrow Simulation)', () => {
    it('should reject project creation if insufficient simulated balance', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'client-id',
        role: 'CLIENT',
        account_balance: 200, // too low
        kyc_verified: true,
      });

      const res = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          title: 'A full stack app',
          description: 'An awesome modern full stack web application for the hackathon',
          budget: 1000,
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toContain('Insufficient funds');
    });

    it('should create project with sufficient balance and lock escrow', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'client-id',
        role: 'CLIENT',
        account_balance: 50000,
        kyc_verified: true,
      });
      prisma.user.update.mockResolvedValue({});
      prisma.project.create.mockResolvedValue({
        id: 'new-proj-id',
        title: 'A full stack app',
        description: 'An awesome modern full stack web application for the hackathon',
        budget: 1000,
        clientId: 'client-id',
        status: 'PENDING_APPROVAL',
        createdAt: new Date(),
      });

      const res = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          title: 'A full stack app',
          description: 'An awesome modern full stack web application for the hackathon',
          budget: 1000,
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toContain('Escrow locked securely');
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { account_balance: 49000 },
        })
      );
    });

    it('should forbid Freelancer from creating project (RBAC)', async () => {
      const res = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${freelancerToken}`)
        .send({
          title: 'A full stack app',
          description: 'An awesome modern full stack web application for the hackathon',
          budget: 1000,
        });

      expect(res.statusCode).toEqual(403);
      expect(res.body.error).toContain('Forbidden');
    });

    it('should reject unauthenticated project creation', async () => {
      const res = await request(app)
        .post('/projects')
        .send({
          title: 'A full stack app',
          description: 'Some description text here',
          budget: 1000,
        });

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /projects', () => {
    it('should list open projects publicly', async () => {
      prisma.project.findMany.mockResolvedValue([
        {
          id: 'proj-1', title: 'Project Alpha', budget: 5000,
          status: 'OPEN', client: { name: 'Acme Inc', kyc_verified: true },
          _count: { submissions: 3 },
        },
      ]);

      const res = await request(app).get('/projects');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /projects/:id/approve (Admin only)', () => {
    it('should allow Admin to approve a pending project', async () => {
      prisma.project.findUnique.mockResolvedValue({
        id: 'proj-pending',
        status: 'PENDING_APPROVAL',
      });
      prisma.project.update.mockResolvedValue({
        id: 'proj-pending',
        status: 'OPEN',
      });

      const res = await request(app)
        .post('/projects/proj-pending/approve')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toContain('approved');
    });

    it('should deny a Client from approving a project', async () => {
      const res = await request(app)
        .post('/projects/some-id/approve')
        .set('Authorization', `Bearer ${clientToken}`);

      expect(res.statusCode).toEqual(403);
    });
  });
});
