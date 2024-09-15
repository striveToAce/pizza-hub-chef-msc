import { Router } from 'express';
import { calculateOrderEstimationTime } from '../controllers/chefController';

const router = Router();

// Route to calculate estimated time for an order
router.get('/estimate-time/:id', calculateOrderEstimationTime);

export default router;
