import { Request, Response } from 'express';
import { startOrderPreparationService, completeOrderService } from '../services/chefService';

/**
 * Start preparing an order (move from PENDING to IN_PROGRESS)
 * @param req - Express request object
 * @param res - Express response object
 * @returns The updated order
 */
export const startPreparingOrder = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Start preparing the order
    const updatedOrder = await startOrderPreparationService(id);
    return res.status(200).json(updatedOrder);
  } catch (error) {
    // Return an error message if starting the order fails
    return res.status(500).json({ error: "Error in starting order" });
  }
};

/**
 * Complete an order (move from IN_PROGRESS to COMPLETED)
 * @param req - Express request object
 * @param res - Express response object
 * @returns The updated order
 */
export const completeOrder = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Update the order status to COMPLETED
    const updatedOrder = await completeOrderService(id);

    // Return the updated order
    return res.status(200).json(updatedOrder);
  } catch (error) {
    // Return an error message if completing the order fails
    return res.status(500).json({ error: "Error in completing order" });
  }
};
