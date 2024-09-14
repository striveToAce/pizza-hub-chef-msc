import { PrismaClient } from '@prisma/client';
import { addMinutes } from 'date-fns'; // A utility function to add minutes to a date.
import { OrderStatus } from '../types/chef';

const prisma = new PrismaClient();

const PIZZA_PREPARATION_TIME_MINUTES = 5;

// Start preparing the order
export const startOrderPreparationService = async (id: string) => {
  // Find the order by ID
  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.status !== OrderStatus.PENDING) {
    throw new Error('Order is already in progress or completed');
  }

  // Calculate total preparation time based on the number of pizzas
  const totalPreparationTime = order.pizzaCount * PIZZA_PREPARATION_TIME_MINUTES;

  // Calculate the estimated completion time
  const estimatedCompletionTime = addMinutes(new Date(), totalPreparationTime);

  // Update the order status and estimated completion time
  const updatedOrder = await prisma.order.update({
    where: { id },
    data: {
      status: OrderStatus.IN_PROGRESS,
      estimatedCompletionTime,
    },
  });

  return updatedOrder;
};

// Mark the order as completed
export const completeOrderService = async (id: string) => {
  const order = await prisma.order.update({
    where: { id },
    data: {
      status: OrderStatus.COMPLETED,
    },
  });

  return order;
};
