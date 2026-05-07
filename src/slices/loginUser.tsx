import { createAsyncThunk } from '@reduxjs/toolkit';
import { setCookie } from '../utils/cookie';
import { loginUserApi, TLoginData } from '../utils/burger-api';

export const loginUser = createAsyncThunk(
  'user/login',
  async (userData: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(userData);
      // Сохраняем токены
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка входа');
    }
  }
);
