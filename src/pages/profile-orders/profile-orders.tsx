import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getOrdersApi } from '../../utils/burger-api';
import { setOrders } from '../../slices/feed.slice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.feed.orders);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrdersApi();
        dispatch(
          setOrders({
            orders: data,
            total: 0,
            totalToday: 0,
          })
        );
      } catch (error) {}
    };

    fetchOrders();
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
