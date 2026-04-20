import request from 'supertest';
import { app } from '../src/index';

jest.mock('../src/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const { prisma } = require('../src/lib/prisma');

describe('Auth Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should successfully register a Freelancer', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'test-id-123',
        name: 'Test Freelancer',
        email: 'freelance@test.com',
        password: 'hashedpassword',
        role: 'FREELANCER',
        kyc_verified: false,
        account_balance: 0,
        payment_capacity_score: 50,
      });

      const res = await request(app).post('/auth/register').send({
        name: 'Test Freelancer',
        email: 'freelance@test.com',
        password: 'password123',
        role: 'FREELANCER',
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
    });

    it('should reject registration if email already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'existing-id',
        name: 'Existing User',
        email: 'existing@test.com',
      });

      const res = await request(app).post('/auth/register').send({
        name: 'New User',
        email: 'existing@test.com',
        password: 'password123',
        role: 'CLIENT',
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Email already exists');
    });

    it('should reject registration with invalid email', async () => {
      const res = await request(app).post('/auth/register').send({
        name: 'Test',
        email: 'not-an-email',
        password: 'password123',
        role: 'FREELANCER',
      });

      expect(res.statusCode).toEqual(400);
    });

    it('should reject registration with short password', async () => {
      const res = await request(app).post('/auth/register').send({
        name: 'Test User',
        email: 'test@test.com',
        password: '123',
        role: 'FREELANCER',
      });

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should fail on invalid credentials (user not found)', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app).post('/auth/login').send({
        email: 'nobody@test.com',
        password: 'password',
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should reject login with missing fields', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'test@test.com',
      });

      expect(res.statusCode).toEqual(400);
    });
  });
});
