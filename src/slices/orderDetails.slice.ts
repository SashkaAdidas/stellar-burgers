// src/slices/orderDetails.slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../utils/types';
import { getOrderByNumberApi } from '../utils/burger-api';

// Асинхронный экшен для загрузки заказа по номеру
export const fetchOrder = createAsyncThunk(
  'orderDetails/fetch',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    if (!data.success) throw new Error('Заказ не найден');
    return data.orders[0];
  }
);

// Слайс для управления состоянием деталей заказа
const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState: {
    currentOrder: null as TOrder | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message
          ? `Ошибка: ${action.error.message}`
          : 'Не удалось загрузить заказ';
      });
  },
});

export default orderDetailsSlice.reducer;
