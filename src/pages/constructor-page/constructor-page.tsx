import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';

export const ConstructorPage: FC = () => {
  // Получаем ингредиенты из состояния
  const {
    items: ingredients,
    loading,
    error,
  } = useSelector((state: RootState) => state.ingredients);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <p className="text text_type_main-medium">Ошибка: {error}</p>;
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        {/* Передаём ингредиенты */}
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
