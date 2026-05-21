import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../utils/types';
import { getOrdersApi } from '../utils/burger-api';

// Тип состояния для истории заказов пользователя
type TUserOrdersState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

// Начальное состояние
const initialState: TUserOrdersState = {
  orders: [],
  loading: false,
  error: null,
};

// Асинхронный экшен для загрузки заказов пользователя
export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Ошибка загрузки истории заказов'
      );
    }
  }
);

// Создаем слайс для истории заказов пользователя
const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    clearUserOrders: (state) => {
      state.orders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка состояния загрузки
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Обработка успешной загрузки
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      // Обработка ошибки
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Экспортируем редьюсер и действия
export default userOrdersSlice.reducer;
export const { clearUserOrders } = userOrdersSlice.actions;

// Экспортируем селектор для получения данных из состояния
export const selectUserOrders = (state: { userOrders: TUserOrdersState }) =>
  state.userOrders.orders;
export const selectUserOrdersLoading = (state: {
  userOrders: TUserOrdersState;
}) => state.userOrders.loading;
export const selectUserOrdersError = (state: {
  userOrders: TUserOrdersState;
}) => state.userOrders.error;
