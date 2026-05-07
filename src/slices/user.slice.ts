import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '../utils/types';
import {
  getUserApi,
  updateUserApi,
  registerUserApi,
  logoutApi,
  loginUserApi,
} from '../utils/burger-api';
import { setCookie } from '../utils/cookie';

// Типы
type TRegisterData = {
  name: string;
  email: string;
  password: string;
};

type TLoginData = {
  email: string;
  password: string;
};

// Вход пользователя
export const loginUser = createAsyncThunk(
  'user/login',
  async (userData: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(userData);
      // Сохраняем токены в куки и хранилище
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка входа');
    }
  }
);

// Получение пользователя
export const fetchUser = createAsyncThunk('user/fetch', async () => {
  try {
    const response = await getUserApi();

    return response.user;
  } catch (error) {
    throw error;
  }
});

// Обновление пользователя
export const updateUser = createAsyncThunk(
  'user/update',
  async (userData: Partial<TUser>) => {
    const response = await updateUserApi(userData);
    return response.user;
  }
);

// Регистрация нового пользователя
export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(userData);
      // Сохраняем токены в куки и хранилище
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка регистрации');
    }
  }
);

// Выход из системы
export const logoutUser = createAsyncThunk('user/logout', async () => {
  try {
    await logoutApi();
  } catch (error) {
  } finally {
    setCookie('accessToken', '');
    localStorage.removeItem('refreshToken');
  }
});

// Слайс
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null as TUser | null,
    loading: false,
    error: null as string | null,
    isAuthChecked: false,
  },
  reducers: {
    authCheckComplete: (state) => {
      state.isAuthChecked = true;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    forceAuthCheck: (state) => {
      state.isAuthChecked = true;
    },
  },
  extraReducers: (builder) => {
    // --- loginUser ---
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthChecked = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Ошибка входа';
    });

    // --- fetchUser ---
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthChecked = true;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.error.message || 'Ошибка получения данных пользователя';
      state.isAuthChecked = true;
    });

    // --- updateUser ---
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.error.message || 'Ошибка обновления данных пользователя';
    });

    // --- registerUser ---
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthChecked = true; // Авторизация проверена
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Ошибка регистрации';
    });

    // --- logoutUser ---
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
      state.user = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isAuthChecked = true;
      state.loading = false;
    });
    builder.addCase(logoutUser.rejected, (state) => {
      state.user = null;
      state.isAuthChecked = false;
      state.loading = false;
    });
  },
});

// Экспортируем действия
export const { authCheckComplete, setUser, forceAuthCheck } = userSlice.actions;

// Экспортируем редьюсер
export default userSlice.reducer;
