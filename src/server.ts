import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import cron from 'node-cron';
import { processPizza } from './services/chefService';
import chefRoutes from './routes/chefRoutes'

dotenv.config();
const app = express();
app.use(cors())
app.use(express.json());

app.use('/api/pizza-fusion/chef', chefRoutes);

// Schedule a cron job to process one pizza every 5 minutes
cron.schedule('*/5 * * * *', () => {
  console.log('Running the cron job to process one pizza...');
  processPizza();
});

// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
