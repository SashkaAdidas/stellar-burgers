import { store } from '../store';

describe('Store', () => {
  test('должен инициализироваться корректно', () => {
    const state = store.getState();
    expect(state).toBeDefined();
    expect(typeof state).toBe('object');
  });

  test('должен иметь правильную структуру state', () => {
    const state = store.getState();
    expect(state).toHaveProperty('burger');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('user');
  });

  test('должен обрабатывать неизвестный экшен без ошибок', () => {
    expect(() => {
      store.dispatch({ type: 'UNKNOWN_ACTION' } as any);
    }).not.toThrow();
  });
});
