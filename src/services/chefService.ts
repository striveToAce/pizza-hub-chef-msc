import { OrderStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all orders that are currently in 'PENDING' or 'IN_PROGRESS' with pizzaCount > 0.
 */
export const getInProgressOrPendingOrders = async () => {
  return await prisma.order.findMany({
    where: {
      status: {
        in: ['PENDING', 'IN_PROGRESS'],
      },
      pizzaCount: {
        gt: 0, // Only fetch orders where there are pizzas left to be prepared
      },
    },
    orderBy: {
      createdAt: 'asc', // Process older orders first
    },
  });
};

/**
 * Complete one pizza from an order, reduce the remaining pizza count,
 * and update the estimated completion time.
 */
export const completeSinglePizzaService = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error(`Order with ID ${orderId} not found.`);
  }

  // Check if there are pizzas to be processed
  if (order.pizzaCount === 0) {
    throw new Error(`No pizzas left to process for order ${orderId}.`);
  }

  // Reduce pizza count by 1
  const updatedPizzaCount = order.pizzaCount - 1;

  // Determine the new status
  let updatedStatus = 'IN_PROGRESS' as OrderStatus; // Default to 'IN_PROGRESS' after starting preparation
  if (updatedPizzaCount === 0) {
    updatedStatus = 'COMPLETED' as OrderStatus; // If no more pizzas left, mark the order as 'COMPLETED'
  } else if (order.status === 'PENDING') {
    updatedStatus = 'IN_PROGRESS' as OrderStatus; // If the order was 'PENDING', it should move to 'IN_PROGRESS'
  }

  // Calculate the new estimated completion time (5 minutes per remaining pizza)
  const newEstimatedCompletionTime = updatedPizzaCount * 5;

  // Update the order in the database
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      pizzaCount: updatedPizzaCount,
      status: updatedStatus,
      estimatedCompletionTime: newEstimatedCompletionTime,
    },
  });

  return updatedOrder;
};

/**
 * Process one pizza every 5 minutes. This function is called by the cron job.
 */
export const processPizza = async () => {
  try {
    // Get all orders that are either 'PENDING' or 'IN_PROGRESS' and have pizzas left to be prepared
    const orders = await getInProgressOrPendingOrders();

    if (orders.length === 0) {
      console.log('No pending or in-progress orders at the moment.');
      return;
    }

    // Process the first order in the list
    const order = orders[0];

    // Complete one pizza from the order
    const updatedOrder = await completeSinglePizzaService(order.id);

    console.log(`Completed one pizza from order ${order.id}. Remaining pizzas: ${updatedOrder.pizzaCount}`);

    // Check if all pizzas are done or if the order is still in progress
    if (updatedOrder.pizzaCount === 0) {
      console.log(`Order ${order.id} is now fully completed.`);
    } else {
      console.log(`Order ${order.id} is still in progress. Estimated completion time updated to ${updatedOrder.estimatedCompletionTime}.`);
    }
  } catch (error) {
    console.error('Error processing pizza:', error);
  }
};


export const calculateOrderEstimationService = async (): Promise<number> => {
  // Fetch all PENDING and IN_PROGRESS orders
  const pendingOrInProgressOrders = await prisma.order.findMany({
    where: {
      status: {
        in: ['PENDING', 'IN_PROGRESS'],
      },
    },
  });

  // Calculate the total number of pizzas across all pending or in-progress orders
  const totalPizzasInAllOrders = pendingOrInProgressOrders.reduce((total, order) => {
    return total + order.pizzaCount;
  }, 0);

  // Calculate the estimated time for the current order
  // Assuming each pizza takes 5 minutes to prepare
  const estimatedTime = (totalPizzasInAllOrders) * 5;

  return estimatedTime; // Total estimated time in minutes
};