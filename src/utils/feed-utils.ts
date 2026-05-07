import { TOrder } from '@utils-types';

export const getOrdersByStatus = (
  orders: TOrder[],
  status: 'done' | 'pending' | 'created'
): number[] => {
  return orders
    .filter((order) => order.status === status)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .map((order) => order.number);
};
