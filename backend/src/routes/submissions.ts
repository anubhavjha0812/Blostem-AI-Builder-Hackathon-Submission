import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// --- Scoring Logic ---
function calculateScore(architecture: string, plan: string, mvpLink: string) {
  let score = 0;
  let feedbackText = '';

  const lengthScore = Math.min((architecture.length + plan.length) / 50, 40); // Max 40 points for effort
  score += lengthScore;
  if (lengthScore < 20) {
    feedbackText += 'Your description and plan are a bit brief. Adding more detail can demonstrate deeper understanding. ';
  }

  if (mvpLink.includes('http') || mvpLink.includes('github')) {
    score += 20; // 20 points for providing a link
  } else {
    feedbackText += 'Could not verify a valid MVP link. ';
  }

  const keywords = ['react', 'next', 'node', 'db', 'sql', 'prisma', 'api', 'auth', 'jwt', 'tailwind', 'vercel', 'render'];
  const text = (architecture + ' ' + plan).toLowerCase();
  
  let matchCount = 0;
  keywords.forEach(kw => {
    if (text.includes(kw)) matchCount++;
  });
  
  const keywordScore = Math.min(matchCount * 5, 40); // Max 40 points
  score += keywordScore;

  if (keywordScore < 15) {
    feedbackText += 'Your architecture seems to be lacking standard modern tech keywords. Ensure your stack is clearly defined. ';
  }

  if (score >= 80) {
    feedbackText += 'Excellent submission. Well detailed and clear architecture.';
  }

  return { 
    score: Math.round(score), 
    feedback: feedbackText || 'Good effort.' 
  };
}

const submitSchema = z.object({
  projectId: z.string(),
  stage: z.number().int().min(1).max(2),
  mvpLink: z.string().min(1),
  architecture: z.string().min(10),
  plan: z.string().min(10),
});

// Submit a proposal
router.post('/', authenticate, authorize(['FREELANCER']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = submitSchema.parse(req.body);
    const userId = req.user!.id;

    // Verify project exists and is OPEN or STAGE_2_OPEN
    const project = await prisma.project.findUnique({ where: { id: data.projectId } });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    if (data.stage === 1 && project.status !== 'OPEN') {
      res.status(400).json({ error: 'Project is not accepting Stage 1 submissions.' });
      return;
    }

    if (data.stage === 2 && project.status !== 'STAGE_2_OPEN') {
      res.status(400).json({ error: 'Project is not accepting Stage 2 submissions.' });
      return;
    }

    // Check if user already submitted for this stage
    const existing = await prisma.submission.findFirst({
      where: { projectId: project.id, userId, stage: data.stage }
    });

    if (existing) {
      res.status(400).json({ error: 'You have already submitted for this stage.' });
      return;
    }

    // Verify if stage 2 that user was shortlisted in stage 1
    if (data.stage === 2) {
      const stage1 = await prisma.submission.findFirst({
        where: { projectId: project.id, userId, stage: 1, status: 'SHORTLISTED' }
      });
      if (!stage1) {
        res.status(403).json({ error: 'You must be shortlisted in Stage 1 to submit for Stage 2.' });
        return;
      }
    }

    const { score, feedback } = calculateScore(data.architecture, data.plan, data.mvpLink);

    const submission = await prisma.submission.create({
      data: {
        projectId: project.id,
        userId,
        stage: data.stage,
        mvpLink: data.mvpLink,
        architecture: data.architecture,
        plan: data.plan,
        score,
        status: 'PENDING',
      }
    });

    // Provide initial rule-based feedback
    await prisma.feedback.create({
      data: {
        submissionId: submission.id,
        text: feedback
      }
    });

    await prisma.profileHistory.create({
      data: {
        userId,
        projectId: project.id,
        stageReached: data.stage
      }
    });

    res.status(201).json({ message: 'Submission successful', submission, score, feedback });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get submissions for a project (Client only)
router.get('/', authenticate, authorize(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projectIdRaw = Array.isArray(req.query.projectId)
      ? req.query.projectId[0]
      : req.query.projectId;
    const projectId = projectIdRaw as string;

    const stageRaw = Array.isArray(req.query.stage)
      ? req.query.stage[0]
      : req.query.stage;
    const stage = parseInt(stageRaw as string, 10);

    if (!projectId || !stage) {
      res.status(400).json({ error: 'Missing projectId or stage query parameters' });
      return;
    }

    const submissions = await prisma.submission.findMany({
      where: { projectId, stage },
      include: {
        user: { select: { id: true, name: true, kyc_verified: true } },
        feedback: true
      },
      orderBy: { score: 'desc' }
    });

    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const shortlistSchema = z.object({
  projectId: z.string(),
  selectedSubmissionIds: z.array(z.string())
});

// Shortlist users and transition to stage 2
router.post('/shortlist', authenticate, authorize(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = shortlistSchema.parse(req.body);
    const userId = req.user!.id;

    // Verify ownership
    const project = await prisma.project.findUnique({ where: { id: data.projectId } });
    if (!project || (project.clientId !== userId && req.user!.role !== 'ADMIN')) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    if (project.status !== 'OPEN') {
      res.status(400).json({ error: 'Project must be in OPEN status to shortlist candidates.' });
      return;
    }

    // Mark selected as SHORTLISTED
    await prisma.submission.updateMany({
      where: { projectId: project.id, stage: 1, id: { in: data.selectedSubmissionIds } },
      data: { status: 'SHORTLISTED' }
    });

    // Mark non-selected as REJECTED
    await prisma.submission.updateMany({
      where: { projectId: project.id, stage: 1, id: { notIn: data.selectedSubmissionIds } },
      data: { status: 'REJECTED' }
    });

    await prisma.project.update({
      where: { id: project.id },
      data: { status: 'STAGE_2_OPEN' }
    });

    res.json({ message: 'Shortlisting complete. Project is now open for Stage 2.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const selectWinnerSchema = z.object({
  projectId: z.string(),
  winnerSubmissionId: z.string()
});

// Select Winner and release escrow
router.post('/select-winner', authenticate, authorize(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = selectWinnerSchema.parse(req.body);
    const userId = req.user!.id;

    const project = await prisma.project.findUnique({ where: { id: data.projectId } });
    if (!project || (project.clientId !== userId && req.user!.role !== 'ADMIN')) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const submission = await prisma.submission.findUnique({ where: { id: data.winnerSubmissionId }});
    if (!submission || submission.projectId !== project.id) {
       res.status(400).json({ error: 'Invalid submission ID' });
       return;
    }

    // Mark winner
    await prisma.submission.update({
      where: { id: submission.id },
      data: { status: 'WINNER' }
    });
    
    // Mark others as REJECTED in stage 2
    await prisma.submission.updateMany({
      where: { 
        projectId: project.id, 
        stage: submission.stage, 
        id: { not: submission.id } 
      },
      data: { status: 'REJECTED' }
    });

    await prisma.project.update({
      where: { id: project.id },
      data: { status: 'COMPLETED' }
    });

    // Blostem Simulation: Escrow Release
    const winnerUser = await prisma.user.findUnique({ where: { id: submission.userId }});
    await prisma.user.update({
      where: { id: submission.userId },
      data: { account_balance: (winnerUser?.account_balance || 0) + project.budget }
    });

    // Update ProfileHistory to 3 (Winner)
    await prisma.profileHistory.create({
      data: {
        userId: submission.userId,
        projectId: project.id,
        stageReached: 3
      }
    });

    res.json({ message: 'Winner selected! Payment Released Successfully via Blostem Escrow.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
