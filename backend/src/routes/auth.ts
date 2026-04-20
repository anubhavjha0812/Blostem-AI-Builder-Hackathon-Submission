import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['FREELANCER', 'CLIENT', 'ADMIN']),
  adminToken: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Blostem Simulation
    let kyc_verified = false;
    let account_balance = 0;
    let payment_capacity_score = 50;

    if (data.role === 'CLIENT') {
      kyc_verified = Math.random() > 0.2; // 80% chance verified
      account_balance = Math.floor(Math.random() * 50000) + 10000; // Random balance 10k - 60k
      payment_capacity_score = Math.floor(Math.random() * 50) + 50; // Random score 50 - 100
    } else if (data.role === 'ADMIN') {
      const serverAdminToken = process.env.ADMIN_TOKEN || 'buildx-hackathon-2024';
      if (data.adminToken !== serverAdminToken) {
        res.status(401).json({ error: 'Invalid admin registration token' });
        return;
      }
      kyc_verified = true;
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        kyc_verified,
        account_balance,
        payment_capacity_score,
      },
    });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'super-secret-jwt-key',
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
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
