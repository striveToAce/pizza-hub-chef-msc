import { Router } from 'express';
import { calculateOrderEstimationTime, checkHealth } from '../controllers/chefController';

const router = Router();

// Route to calculate estimated time for an order
router.get('/estimate-time', calculateOrderEstimationTime);

// check health
router.get('/health', checkHealth);

export default router;
