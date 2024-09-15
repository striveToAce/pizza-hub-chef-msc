import { Request, Response } from 'express';
import { calculateOrderEstimationService } from '../services/chefService';

/**
 * Calculate the estimated time for an order.
 * @param req - Express request object
 * @param res - Express response object
 * @returns The estimated time in minutes.
 */
export const calculateOrderEstimationTime = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Call the service function to calculate the estimation time
    const estimatedTime = await calculateOrderEstimationService(id);

    // Return the estimated time in the response
    return res.status(200).json({
      message: `The estimated time for order ${id} is ${estimatedTime} minutes.`,
      estimatedTime,
    });
  } catch (error) {
    // Return an error message if anything goes wrong
    console.error(`Error calculating estimation time for order ${id}:`, error);
    return res.status(500).json({ error: `Error calculating estimation time for order ${id}.` });
  }
};
