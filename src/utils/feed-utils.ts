import { TOrder } from './types';

type TGroupedOrders = {
  readyOrders: number[];
  pendingOrders: number[];
};

export const groupOrdersByStatus = (orders: TOrder[]): TGroupedOrders => {
  const readyOrders: number[] = [];
  const pendingOrders: number[] = [];

  [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 20)
    .forEach((order) => {
      const status = order.status?.toLowerCase();

      if (status === 'done') {
        readyOrders.push(order.number);
      } else if (status === 'pending' || status === 'created') {
        pendingOrders.push(order.number);
      }
    });

  return {
    readyOrders: readyOrders.slice(0, 10),
    pendingOrders: pendingOrders.slice(0, 10),
  };
};
