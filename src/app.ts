import express from 'express';
import chefRoutes from './routes/chefRoutes'
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Register routes
app.use('/api/chef', chefRoutes);

export default app;
