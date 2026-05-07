import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { startFeedConnection, wsClose } from '../../slices/feed.slice';
import { getFeedsApi } from '../../utils/burger-api';
import { setOrders } from '../../slices/feed.slice';

import { getCookie } from '../../utils/cookie';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, total, totalToday } = useSelector((state) => state.feed);

  const accessTokenFromCookie = getCookie('accessToken');
  const accessTokenFromStorage = localStorage.getItem('accessToken');

  const rawToken = accessTokenFromCookie || accessTokenFromStorage || '';

  useEffect(() => {
    dispatch(startFeedConnection(''));

    return () => {
      dispatch(wsClose());
    };
  }, [dispatch]);

  // Пока нет данных — прелоадер
  if (!orders.length && total === 0 && totalToday === 0) {
    return <Preloader />;
  }

  // Функция обновления
  const handleGetFeeds = async () => {
    dispatch(wsClose());

    setTimeout(async () => {
      try {
        // Передаём токен в API
        const data = await getFeedsApi();
        dispatch(setOrders(data));
      } catch (err) {
        console.error('Ошибка при загрузке заказов:', err);
      }

      if (rawToken) {
        dispatch(startFeedConnection(rawToken));
      }
    }, 100);
  };

  return (
    <FeedUI
      orders={orders}
      total={total}
      totalToday={totalToday}
      handleGetFeeds={handleGetFeeds}
    />
  );
};
