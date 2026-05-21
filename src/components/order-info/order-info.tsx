import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { RootState } from '../../services/store';
import { fetchOrderDetails } from '../../slices/order-details.slice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const dispatch = useDispatch();

  // Получаем данные из стора
  const { order, loading, error } = useSelector(
    (state: RootState) => state.orderDetails
  );
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.items
  );

  // Получаем номер заказа
  const pathname = window.location.pathname;
  const numberMatch = pathname.match(
    /\/feed\/([0-9]+)|\/profile\/orders\/([0-9]+)|\/ingredients\/([0-9]+)$/
  );
  const number = numberMatch
    ? Number(numberMatch[1] || numberMatch[2] || numberMatch[3])
    : null;

  // Загружаем заказ по номеру
  useEffect(() => {
    if (number) {
      dispatch(fetchOrderDetails(Number(number)));
    }
  }, [number, dispatch]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!order || !ingredients.length) return null;

    const date = new Date(order.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      date,
      total,
    };
  }, [order, ingredients]);

  if (loading) {
    return <Preloader />;
  }

  if (error || !orderInfo) {
    return (
      <p className="text text_type_main-medium">{error || 'Заказ не найден'}</p>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
