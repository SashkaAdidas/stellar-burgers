import { RefObject } from 'react';
import { TIngredient, TTabMode, TConstructorIngredient } from '@utils-types';

export type TBurgerConstructorItem = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

export type BurgerIngredientsUIProps = {
  currentTab: TTabMode;
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  constructorItems: TBurgerConstructorItem;
  titleBunRef: RefObject<HTMLHeadingElement>;
  titleMainRef: RefObject<HTMLHeadingElement>;
  titleSaucesRef: RefObject<HTMLHeadingElement>;
  bunsRef: (node?: Element | null | undefined) => void;
  mainsRef: (node?: Element | null | undefined) => void;
  saucesRef: (node?: Element | null | undefined) => void;
  onTabClick: (val: string) => void;
};
