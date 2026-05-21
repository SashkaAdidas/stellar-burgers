import ingredientsSlice, {
  fetchIngredients,
  setCurrentIngredient,
} from '../../slices/ingredients.slice';
import { TIngredient } from '../../utils/types';

describe('Ingredients Slice - Редьюсер ингредиентов', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
    currentIngredient: null,
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: 'ing-1',
      name: 'Космическая булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 150,
      price: 100,
      image: 'bun.png',
      image_large: 'bun_large.png',
      image_mobile: 'bun_mobile.png',
    },
  ];

  describe('Начальное состояние', () => {
    test('должно возвращать начальное состояние при неизвестном экшене', () => {
      const state = ingredientsSlice(undefined, { type: 'UNKNOWN_ACTION' });
      expect(state).toEqual(initialState);
    });
  });

  describe('Обработка экшена Request (pending)', () => {
    test('должно установить loading в true', () => {
      const state = ingredientsSlice(initialState, {
        type: fetchIngredients.pending.type,
      } as any);
      expect(state.loading).toBe(true);
    });
  });

  describe('Обработка экшена Success (fulfilled)', () => {
    test('должно записать ингредиенты в стор и установить loading в false', () => {
      const state = ingredientsSlice(initialState, {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients,
      } as any);
      expect(state.loading).toBe(false);
      expect(state.items).toHaveLength(1);
      expect(state.items[0].name).toBe('Космическая булка');
    });
  });

  describe('Обработка экшена Failed (rejected)', () => {
    test('должно записать ошибку в стор и установить loading в false', () => {
      const errorMessage = 'Failed to fetch ingredients';
      const state = ingredientsSlice(initialState, {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage },
      } as any);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('setCurrentIngredient редьюсер', () => {
    test('должно установить текущий ингредиент', () => {
      const ingredient = mockIngredients[0];
      const state = ingredientsSlice(
        initialState,
        setCurrentIngredient(ingredient)
      );
      expect(state.currentIngredient).toBe(ingredient);
    });
  });
});
