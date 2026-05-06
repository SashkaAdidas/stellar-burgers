import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { RootState } from '../../services/store';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();

  /** TODO: взять переменную из стора */
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.items
  );

  const orderInfo = useMemo(() => {
    if (!order.ingredients || !ingredients.length) return null;

    //  Собираем ингредиенты по ID
    const ingredientsInfo = order.ingredients
      .map((id) => ingredients.find((ing) => ing._id === id))
      .filter((ing): ing is TIngredient => Boolean(ing)); // убираем undefined

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);
    const remains = Math.max(0, ingredientsInfo.length - maxIngredients);
    const date = new Date(order.createdAt);
    return {
      _id: order._id,
      status: order.status,
      name: order.name,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      number: order.number,
      date,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      ingredients: order.ingredients,
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
