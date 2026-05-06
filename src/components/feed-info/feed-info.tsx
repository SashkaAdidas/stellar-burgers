import { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { TOrder, TOrdersData } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { RootState } from '../../services/store';

export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  const feed = useSelector((state: RootState) => ({
    orders: state.feed.orders || [],
    total: state.feed.total,
    totalToday: state.feed.totalToday,
  }));

  // Фильтрация и сортировка заказов по статусам
  const getOrdersByStatus = (status: 'done' | 'pending'): number[] =>
    feed.orders
      .filter((order) => order.status === status)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .map((order) => order.number);

  const readyOrders = useMemo(() => getOrdersByStatus('done'), [feed.orders]);
  const pendingOrders = useMemo(
    () => getOrdersByStatus('pending'),
    [feed.orders]
  );

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
