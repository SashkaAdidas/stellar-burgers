import {
  constructorSlice,
  addIngredient,
  removeIngredient,
  moveIngredient,
  orderBurger,
} from '../../slices/constructor.slice';
import { TIngredient } from '../../utils/types';

describe('Constructor Slice - Редьюсер бургер-конструктора', () => {
  const initialState = {
    constructorItems: {
      bun: null,
      ingredients: [],
    },
    orderRequest: false,
    orderModalData: null,
  };

  const mockBun: TIngredient = {
    _id: 'bun-123',
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
  };

  const mockIngredient: TIngredient = {
    _id: 'ing-456',
    name: 'Космическая котлета',
    type: 'main',
    proteins: 30,
    fat: 15,
    carbohydrates: 5,
    calories: 250,
    price: 200,
    image: 'meat.png',
    image_large: 'meat_large.png',
    image_mobile: 'meat_mobile.png',
  };

  describe('Начальное состояние', () => {
    test('должно возвращать начальное состояние при неизвестном экшене', () => {
      const state = constructorSlice.reducer(undefined, {
        type: 'UNKNOWN_ACTION',
      });
      expect(state).toEqual(initialState);
    });
  });

  describe('Добавление ингредиента', () => {
    test('должно добавить булку в конструктор', () => {
      const state = constructorSlice.reducer(
        initialState,
        addIngredient(mockBun)
      );
      expect(state.constructorItems.bun).toBeDefined();
      expect(state.constructorItems.bun?.name).toBe('Космическая булка');
    });

    test('должно добавить ингредиент в список ингредиентов', () => {
      const stateWithBun = constructorSlice.reducer(
        initialState,
        addIngredient(mockBun)
      );
      const state = constructorSlice.reducer(
        stateWithBun,
        addIngredient(mockIngredient)
      );
      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0].name).toBe(
        'Космическая котлета'
      );
    });
  });

  describe('Удаление ингредиента', () => {
    test('должно удалить ингредиент по id', () => {
      const ingredientToRemove = { ...mockIngredient, id: 'temp-123' };
      const anotherIngredient = { ...mockIngredient, id: 'temp-456' };
      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          bun: null,
          ingredients: [ingredientToRemove, anotherIngredient],
        },
      };

      const state = constructorSlice.reducer(
        stateWithIngredients,
        removeIngredient({ id: 'temp-123' })
      );
      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0].id).toBe('temp-456');
    });
  });

  describe('Изменение порядка ингредиентов (move)', () => {
    test('должно переместить ингредиент из одной позиции в другую', () => {
      const ingredients = [
        { ...mockIngredient, id: '1' },
        { ...mockIngredient, id: '2' },
        { ...mockIngredient, id: '3' },
      ];
      const stateWithIngredients = {
        ...initialState,
        constructorItems: { bun: null, ingredients },
      };

      const state = constructorSlice.reducer(
        stateWithIngredients,
        moveIngredient({ dragIndex: 0, hoverIndex: 2 })
      );
      expect(state.constructorItems.ingredients[0].id).toBe('2');
      expect(state.constructorItems.ingredients[1].id).toBe('3');
      expect(state.constructorItems.ingredients[2].id).toBe('1');
    });
  });

  describe('Обработка асинхронных экшенов orderBurger', () => {
    test('должно установить orderRequest в true при pending', () => {
      const state = constructorSlice.reducer(initialState, {
        type: orderBurger.pending.type,
      } as any);
      expect(state.orderRequest).toBe(true);
    });

    test('должно установить orderRequest в false при fulfilled', () => {
      const stateWithRequest = { ...initialState, orderRequest: true };
      const state = constructorSlice.reducer(stateWithRequest, {
        type: orderBurger.fulfilled.type,
      } as any);
      expect(state.orderRequest).toBe(false);
    });

    test('должно установить orderRequest в false при rejected', () => {
      const stateWithRequest = { ...initialState, orderRequest: true };
      const state = constructorSlice.reducer(stateWithRequest, {
        type: orderBurger.rejected.type,
      } as any);
      expect(state.orderRequest).toBe(false);
    });
  });
});
