import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { Preloader } from '@ui';
import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';

// Стор
import { useSelector, useDispatch } from '../../services/store';
import { RootState } from '../../services/store';
import { fetchIngredients } from '../../slices/ingredients.slice';
import { fetchUser, authCheckComplete } from '../../slices/user.slice';
import { useEffect } from 'react';

import '../../index.css';
import styles from './app.module.css';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthChecked, user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthChecked && !user) {
      navigate('/login');
    }
  }, [isAuthChecked, user, navigate]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  return user ? children : null;
};

const ModalRoute = ({
  children,
  title,
}: {
  children: JSX.Element;
  title: string;
}) => {
  const navigate = useNavigate();

  return (
    <Modal title={title} onClose={() => navigate(-1)}>
      {children}
    </Modal>
  );
};

const AppRoutes = () => (
  <Routes>
    {/* Основные страницы */}
    <Route path="/" element={<ConstructorPage />} />
    <Route path="/feed" element={<Feed />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile/orders"
      element={
        <ProtectedRoute>
          <ProfileOrders />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound404 />} />

    {/* Модальные окна */}
    <Route
      path="/feed/:number"
      element={
        <ModalRoute title="Детали заказа">
          <OrderInfo />
        </ModalRoute>
      }
    />
    <Route
      path="/ingredients/:id"
      element={
        <ModalRoute title="Детали ингредиента">
          <IngredientDetails />
        </ModalRoute>
      }
    />
    <Route
      path="/profile/orders/:number"
      element={
        <ModalRoute title="Детали заказа">
          <OrderInfo />
        </ModalRoute>
      }
    />
  </Routes>
);

/**
 * Основной компонент приложения
 */
const App = () => {
  /** TODO: взять переменные из стора */
  const dispatch = useDispatch();

  // Загружаем ингредиенты и пользователя при старте
  useEffect(() => {
    dispatch(fetchIngredients());

    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      dispatch(fetchUser()).finally(() => dispatch(authCheckComplete()));
    } else {
      dispatch(authCheckComplete());
    }
  }, [dispatch]);

  // Берём состояние из Redux
  const { loading: isIngredientsLoading, error } = useSelector(
    (state: RootState) => state.ingredients
  );

  const userState = useSelector((state: RootState) => state.user);

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <AppHeader />

        {/* Показываем прелоадер только при первой загрузке ингредиентов */}
        {isIngredientsLoading && <Preloader />}

        {/* Ошибка, если есть */}
        {error && (
          <div className={`${styles.error} text text_type_main-medium pt-4`}>
            {error}
          </div>
        )}

        {/* Основной контент, когда данные загружены */}
        {!isIngredientsLoading && !error && <AppRoutes />}
      </div>
    </BrowserRouter>
  );
};

export default App;

export { AppRoutes, ProtectedRoute, ModalRoute };
