import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '../utils/types';
import { getIngredientsApi } from '../utils/burger-api';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async () => await getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: {
    items: [] as TIngredient[],
    loading: false,
    error: null as string | null,
    currentIngredient: null as TIngredient | null,
  },
  reducers: {
    setCurrentIngredient: (state, action) => {
      state.currentIngredient = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  },
});

export const { setCurrentIngredient } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
