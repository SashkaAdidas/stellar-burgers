import { FC, memo } from 'react';
import styles from './feed.module.css';
import { FeedUIProps } from './type';
import { OrdersList, FeedInfoUI } from '@components';
import { RefreshButton } from '@zlden/react-developer-burger-ui-components';
import { groupOrdersByStatus } from '../../../../utils/feed-utils';

export const FeedUI: FC<FeedUIProps> = memo(
  ({ orders, total, totalToday, handleGetFeeds }) => {
    // Группируем заказы по статусам с помощью утилиты
    console.log('Все заказы из пропсов:', orders);
    const { readyOrders, pendingOrders } = groupOrdersByStatus(orders);

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
