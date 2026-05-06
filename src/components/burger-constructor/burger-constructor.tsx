import { FC, useMemo, useCallback } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useSelector } from 'react-redux';
import { useDispatch } from '../../services/store';
import { orderBurger, resetOrder } from '../../slices/constructor.slice';

import type { RootState } from '../../services/store';
import { useNavigate } from 'react-router-dom';

import { moveIngredient } from '../../slices/constructor.slice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Получаем данные из стора
  const constructorItems = useSelector(
    (state: RootState) => state.burger.constructorItems
  );
  const orderRequest = useSelector(
    (state: RootState) => state.burger.orderRequest
  );
  const orderModalData = useSelector(
    (state: RootState) => state.burger.orderModalData
  );
  // Получаем пользователя
  const { user } = useSelector((state: RootState) => state.user);
  //  Подсчёт стоимости
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  //  Перемещение ингредиентов
  const handleMoveIngredient = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      dispatch(moveIngredient({ dragIndex, hoverIndex }));
    },
    [dispatch]
  );

  // Обработчик оформления заказа
  const onOrderClick = () => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    // Защита
    if (!constructorItems.bun || orderRequest) return;

    // Формируем массив
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ing) => ing._id),
    ];

    // Отправляем заказ
    dispatch(orderBurger(ingredientIds));
  };
  // Закрытие модального окна
  const closeOrderModal = () => {
    dispatch(resetOrder());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      moveIngredient={handleMoveIngredient}
    />
  );
};
