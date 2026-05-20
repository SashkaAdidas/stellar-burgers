import {
  feedSlice,
  setOrders,
  wsConnect,
  wsDisconnect,
  wsMessage,
} from '../../slices/feed.slice';

describe('Feed Slice - Редьюсер ленты заказов', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
  };

  describe('Начальное состояние', () => {
    test('должно возвращать начальное состояние при неизвестном экшене', () => {
      const state = feedSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(state).toEqual(initialState);
    });
  });

  describe('Обработка экшена setOrders', () => {
    test('должно записать данные в стор', () => {
      const mockData = {
        orders: [
          {
            _id: '1',
            status: 'done',
            name: 'Бургер',
            createdAt: '2024',
            updatedAt: '2024',
            number: 1,
            ingredients: [],
          },
        ],
        total: 100,
        totalToday: 10,
      };
      const state = feedSlice.reducer(initialState, setOrders(mockData));
      expect(state.orders).toHaveLength(1);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
    });
  });

  describe('Обработка экшена wsMessage', () => {
    test('должно записать данные из WebSocket сообщения', () => {
      const mockData = {
        orders: [
          {
            _id: '2',
            status: 'pending',
            name: 'Бургер 2',
            createdAt: '2024',
            updatedAt: '2024',
            number: 2,
            ingredients: [],
          },
        ],
        total: 200,
        totalToday: 20,
      };
      const state = feedSlice.reducer(initialState, wsMessage(mockData));
      expect(state.orders).toHaveLength(1);
      expect(state.total).toBe(200);
      expect(state.totalToday).toBe(20);
    });
  });

  describe('WebSocket экшены', () => {
    test('wsConnect не меняет состояние', () => {
      const state = feedSlice.reducer(initialState, wsConnect());
      expect(state).toEqual(initialState);
    });

    test('wsDisconnect не меняет состояние', () => {
      const state = feedSlice.reducer(initialState, wsDisconnect());
      expect(state).toEqual(initialState);
    });
  });
});
