import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import yamljs from 'yamljs';
import path from 'path';

import authRoutes from './routes/auth';
import projectsRoutes from './routes/projects';
import submissionsRoutes from './routes/submissions';
import profileRoutes from './routes/profile';
import adminRoutes from './routes/admin';

dotenv.config();

export const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
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

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`API documentation available at http://localhost:${port}/api-docs`);
  });
}
