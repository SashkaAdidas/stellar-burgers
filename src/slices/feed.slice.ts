import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';
import { WebSocketApi } from '../utils/websocket-api';

const initialState: TOrdersData = {
  orders: [],
  total: 0,
  totalToday: 0,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<TOrdersData>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },

    wsConnect: (state) => {
      // Подключение инициировано
    },

    wsDisconnect: (state) => {
      // Отключение инициировано
    },

    wsConnecting: (state) => {
      // Состояние: подключение в процессе
    },

    wsOpen: (state) => {
      // Соединение установлено
    },

    wsClose: (state) => {
      // Соединение закрыто
    },

    wsMessage: (state, action: PayloadAction<TOrdersData>) => {
      const sortedOrders = [...action.payload.orders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      state.orders = sortedOrders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },

    wsError: (state, action: PayloadAction<string>) => {
      // Обработка ошибки
    },
  },
});

export default feedSlice.reducer;

export const {
  setOrders,
  wsConnect,
  wsDisconnect,
  wsConnecting,
  wsOpen,
  wsClose,
  wsMessage,
  wsError,
} = feedSlice.actions;

export const startFeedConnection = (accessToken: string) => (dispatch: any) => {
  const ws = new WebSocketApi();

  ws.onOpen(() => {
    dispatch(wsOpen());
  });

  ws.onClose(() => {
    dispatch(wsClose());
  });

  ws.onError((event) => {
    dispatch(wsError(event.type));
  });

  ws.onMessage((data) => {
    dispatch(wsMessage(data));
  });

  dispatch(wsConnecting());

  // Для публичной ленты заказов не используем токен
  ws.connect('');

  return ws;
};
