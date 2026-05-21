import { rootReducer } from '../../services/root-reducer';

describe('Root Reducer', () => {
  test('должен возвращать корректное начальное состояние при вызове с undefined и UNKNOWN_ACTION', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState).toBeDefined();
    expect(typeof initialState).toBe('object');
  });

  test('должен иметь все ожидаемые ключи в начальном состоянии', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState).toHaveProperty('burger');
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('orderDetails');
    expect(initialState).toHaveProperty('userOrders');
  });

  test('должен возвращать тот же стейт при неизвестном экшене', () => {
    const sameState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    const state = rootReducer(sameState, { type: 'UNKNOWN_ACTION' });
    expect(state).toBe(sameState);
  });
});
