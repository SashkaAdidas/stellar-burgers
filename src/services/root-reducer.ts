import { combineReducers } from '@reduxjs/toolkit';

// Импорты редьюсеров
import userReducer from '../slices/user.slice';
import ingredientsReducer from '../slices/ingredients.slice';
import { constructorReducer } from '../slices/constructor.slice';
import feedReducer from '../slices/feed.slice';
import { orderDetailsReducer } from '../slices/order-details.slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  burger: constructorReducer,
  feed: feedReducer,
  orderDetails: orderDetailsReducer,
});
