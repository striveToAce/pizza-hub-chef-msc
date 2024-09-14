import { Router } from 'express';
import { startPreparingOrder, completeOrder } from '../controllers/chefController';

const router = Router();

// Start preparing an order
router.post('/start/:id', startPreparingOrder);

// Complete an order
router.post('/complete/:id', completeOrder);

export default router;
