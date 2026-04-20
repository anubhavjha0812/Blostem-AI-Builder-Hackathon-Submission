import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

const createProjectSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  budget: z.number().positive(),
});

// Create a new project (Client only)
router.post('/', authenticate, authorize(['CLIENT']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = createProjectSchema.parse(req.body);
    const userId = req.user!.id;

    // Blostem Simulation: Escrow check
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.account_balance < data.budget) {
      res.status(400).json({ error: 'Insufficient funds for fake escrow lock.' });
      return;
    }

    // Deduct budget (Simulating Escrow Lock)
    await prisma.user.update({
      where: { id: userId },
      data: { account_balance: user.account_balance - data.budget },
    });

    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        budget: data.budget,
        clientId: userId,
        status: 'PENDING_APPROVAL',
      },
    });

    res.status(201).json({
      message: 'Project created. Escrow locked securely (simulated). Pending admin approval.',
      project,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin approves a project
router.post('/:id/approve', authenticate, authorize(['ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.params.id;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    if (project.status !== 'PENDING_APPROVAL') {
      res.status(400).json({ error: 'Project is not in PENDING_APPROVAL state' });
      return;
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { status: 'OPEN' },
    });

    res.json({ message: 'Project approved successfully', project: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List projects
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Basic implementation: returning all OPEN projects
    const projects = await prisma.project.findMany({
      where: {
        status: { in: ['OPEN', 'STAGE_1_EVALUATION', 'STAGE_2_OPEN', 'STAGE_2_EVALUATION', 'COMPLETED'] },
      },
      include: {
        client: {
          select: { id: true, name: true, kyc_verified: true, payment_capacity_score: true },
        },
        _count: {
          select: { submissions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single project
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        client: {
          select: { id: true, name: true, kyc_verified: true, payment_capacity_score: true },
        },
      },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
