import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all projects with any status (Admin only)
router.get('/projects', authenticate, authorize(['ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const statusFilter = req.query.status as string | undefined;

    const where = statusFilter ? { status: statusFilter as any } : {};

    const projects = await prisma.project.findMany({
      where,
      include: {
        client: {
          select: { id: true, name: true, email: true, kyc_verified: true },
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

// Admin: manage a user (get all users)
router.get('/users', authenticate, authorize(['ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        kyc_verified: true,
        account_balance: true,
        payment_capacity_score: true,
      },
      orderBy: { role: 'asc' },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: force-complete a project by selecting a winner
router.post('/override-winner', authenticate, authorize(['ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { projectId, winnerSubmissionId } = req.body;

    if (!projectId || !winnerSubmissionId) {
      res.status(400).json({ error: 'projectId and winnerSubmissionId required' });
      return;
    }

    const submission = await prisma.submission.findUnique({ where: { id: winnerSubmissionId } });
    if (!submission || submission.projectId !== projectId) {
      res.status(400).json({ error: 'Invalid submission ID' });
      return;
    }

    await prisma.submission.update({ where: { id: submission.id }, data: { status: 'WINNER' } });
    await prisma.submission.updateMany({
      where: { projectId, id: { not: submission.id } },
      data: { status: 'REJECTED' },
    });
    await prisma.project.update({ where: { id: projectId }, data: { status: 'COMPLETED' } });

    const winnerUser = await prisma.user.findUnique({ where: { id: submission.userId } });
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    await prisma.user.update({
      where: { id: submission.userId },
      data: { account_balance: (winnerUser?.account_balance || 0) + (project?.budget || 0) },
    });

    res.json({ message: 'Admin override: Winner selected and escrow released.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
