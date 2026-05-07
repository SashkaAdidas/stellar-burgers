import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { getOrderByNumberApi, orderBurgerApi } from '../utils/burger-api';

type TConstructorState = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

// Начальное состояние
const initialState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: [],
  },
  orderRequest: false,
  orderModalData: null,
};

// Асинхронная Thunk-функция для оформления заказа
export const orderBurger = createAsyncThunk(
  'constructor/orderBurger',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);

    return response.order;
  }
);

// Слайс
export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: { payload: TConstructorIngredient }) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: Date.now().toString(),
        },
      }),
    },
    removeIngredient: (state, action: { payload: { id: string } }) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload.id
        );
    },
    moveIngredient: (
      state,
      action: {
        payload: { dragIndex: number; hoverIndex: number };
      }
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const newArray = [...state.constructorItems.ingredients];
      const draggedItem = newArray[dragIndex];
      newArray.splice(dragIndex, 1);
      newArray.splice(hoverIndex, 0, draggedItem);
      state.constructorItems.ingredients = newArray;
    },
    clearConstructor: (state) => {
      state.constructorItems = {
        bun: null,
        ingredients: [],
      };
    },
    resetOrder: (state) => {
      state.orderModalData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        const orderData = action.payload;

        // Формируем массив идентификаторов ингредиентов
        const ingredientsIds = [
          ...state.constructorItems.ingredients.map((item) => item._id),
        ].filter((id): id is string => Boolean(id));

        if (state.constructorItems.bun) {
          ingredientsIds.unshift(state.constructorItems.bun._id);
          ingredientsIds.push(state.constructorItems.bun._id);
        }

        const fullOrder: TOrder = {
          ...orderData,
          ingredients: ingredientsIds,
        };

        state.orderRequest = false;
        state.orderModalData = fullOrder;
        state.constructorItems = {
          bun: null,
          ingredients: [],
        };
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderRequest = false;
      });
  },
});

// Экспортируем действия
export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  resetOrder,
} = constructorSlice.actions;

// Экспортируем редьюсер
export const constructorReducer = constructorSlice.reducer;
