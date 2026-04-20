import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import yamljs from 'yamljs';
import path from 'path';

import authRoutes from './routes/auth';
import projectsRoutes from './routes/projects';
import submissionsRoutes from './routes/submissions';
import profileRoutes from './routes/profile';
import adminRoutes from './routes/admin';

export const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://blostem-ai-builder-hackathon-submission-rhgq5v2os.vercel.app",
    "https://blostem-ai-builder-hackathon-submission.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Swagger Docs (Make sure swagger.yaml exists)
try {
  const swaggerDocument = yamljs.load(path.join(__dirname, '../swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
  console.log('Swagger definition not found or invalid, skipping /api-docs');
}

// Routes
app.use('/auth', authRoutes);
app.use('/projects', projectsRoutes);
app.use('/submissions', submissionsRoutes);
app.use('/profile', profileRoutes);
app.use('/admin', adminRoutes);

import { Request, Response } from 'express';

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (require.main === module) {
  app.listen(port, () => {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://blostem-ai-builder-hackathon-submission.onrender.com'
      : `http://localhost:${port}`;
    console.log(`Server is running on port ${port}`);
    console.log(`API documentation available at ${baseUrl}/api-docs`);
  });
}
