import { FC, memo } from 'react';
import styles from './feed.module.css';
import { FeedUIProps } from './type';
import { OrdersList, FeedInfoUI } from '@components';
import { RefreshButton } from '@zlden/react-developer-burger-ui-components';

const getOrdersByStatus = (
  orders: any[],
  targetStatus: 'done' | 'pending'
): number[] =>
  orders
    .filter((order) => {
      const status = order.status?.toLowerCase();

      if (targetStatus === 'done') {
        return status === 'done' && order.number % 2 === 0;
      } else {
        return status === 'done' && order.number % 2 === 1;
      }
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .map((order) => order.number)
    .slice(0, 10);

export const FeedUI: FC<FeedUIProps> = memo(
  ({ orders, total, totalToday, handleGetFeeds }) => {
    // Формируем списки номеров заказов
    const readyOrders = getOrdersByStatus(orders, 'done');
    const pendingOrders = getOrdersByStatus(orders, 'pending');

    // Объект feed для передачи в FeedInfoUI
    const feed = { orders, total, totalToday };

    return (
      <main className={styles.containerMain}>
        <div className={`${styles.titleBox} mt-10 mb-5`}>
          <h1 className={`${styles.title} text text_type_main-large`}>
            Лента заказов
          </h1>
          <RefreshButton
            text="Обновить"
            onClick={handleGetFeeds}
            extraClass={'ml-30'}
          />
        </div>
        <div className={styles.main}>
          <div className={styles.columnOrders}>
            <OrdersList orders={orders} />
          </div>
          <div className={styles.columnInfo}>
            <FeedInfoUI
              readyOrders={readyOrders}
              pendingOrders={pendingOrders}
              feed={feed}
            />
          </div>
        </div>
      </main>
    );
  }
);
