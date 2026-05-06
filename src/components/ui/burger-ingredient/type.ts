import { Location } from 'react-router-dom';
import { TIngredient } from '@utils-types';
import { MouseEventHandler } from 'react';

export type TBurgerIngredientUIProps = {
  ingredient: TIngredient;
  count: number;
  locationState: { background: Location };
  handleAdd: () => void;
  onClick?: MouseEventHandler<HTMLLIElement>;
};
