import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Location,
  Outlet,
} from 'react-router-dom';
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
import { OnlyUnAuth } from '../../components/protected-route';

// Стор
import { useSelector, useDispatch } from '../../services/store';
import { RootState } from '../../services/store';
import { fetchIngredients } from '../../slices/ingredients.slice';
import { fetchUser, authCheckComplete } from '../../slices/user.slice';
import { useEffect } from 'react';

import '../../index.css';
import styles from './app.module.css';

// Тип для location state
type LocationState = {
  background?: Location;
  from?: string;
};

const ProtectedRoute = () => {
  const { isAuthChecked, user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthChecked && !user) {
      // Сохраняем текущий маршрут для последующего редиректа после авторизации
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isAuthChecked, user, navigate, location.pathname]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  return user ? <Outlet /> : null;
};

const ModalRoute = ({ title }: { title: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  const background = locationState?.background;

  // Извлекаем номер заказа или идентификатор ингредиента из пути
  const orderNumber = location.pathname.split('/').pop();

  return (
    <Modal
      title={title}
      onClose={() => {
        // Если есть background, возвращаемся к нему, иначе переходим на главную
        if (background) {
          navigate(-1);
        } else {
          navigate('/');
        }
      }}
    >
      <div className={styles.detailPageWrap}>
        <p className={`text text_type_digits-default ${styles.detailHeader}`}>
          #{orderNumber}
        </p>
        <OrderInfo />
      </div>
    </Modal>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const locationState = location.state as LocationState;
  const background = locationState?.background;

  return (
    <>
      {/* Основные маршруты - отображаются когда нет background location */}
      <Routes location={background || location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />

        {/* Защищенные маршруты профиля */}
        <Route path="/profile" element={<ProtectedRoute />}>
          <Route index element={<Profile />} />
          <Route path="orders" element={<ProfileOrders />} />
          <Route path="orders/:number" element={<ProtectedRoute />}>
            <Route
              index
              element={
                <div className={styles.detailPageWrap}>
                  <p
                    className={`text text_type_digits-default ${styles.detailHeader}`}
                  >
                    #{location.pathname.split('/').pop()}
                  </p>
                  <OrderInfo />
                </div>
              }
            />
          </Route>
        </Route>

        {/* Публичные маршруты, доступные только неавторизованным пользователям */}
        <Route
          path="/login"
          element={
            <OnlyUnAuth>
              <Login />
            </OnlyUnAuth>
          }
        />
        <Route
          path="/register"
          element={
            <OnlyUnAuth>
              <Register />
            </OnlyUnAuth>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <OnlyUnAuth>
              <ForgotPassword />
            </OnlyUnAuth>
          }
        />
        <Route
          path="/reset-password"
          element={
            <OnlyUnAuth>
              <ResetPassword />
            </OnlyUnAuth>
          }
        />

        {/* Детальные страницы */}
        <Route
          path="/feed/:number"
          element={
            <div className={styles.detailPageWrap}>
              <p
                className={`text text_type_digits-default ${styles.detailHeader}`}
              >
                #{location.pathname.split('/').pop()}
              </p>
              <OrderInfo />
            </div>
          }
        />

        <Route
          path="/ingredients/:id"
          element={
            <div className={styles.detailPageWrap}>
              <p
                className={`text text_type_digits-default ${styles.detailHeader}`}
              >
                Детали ингредиента
              </p>
              <IngredientDetails />
            </div>
          }
        />

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна - отображаются поверх основного контента при наличии background location */}
      {background && (
        <Routes>
          <Route
            path="/feed/:number"
            element={<ModalRoute title="Детали заказа" />}
          />
          <Route
            path="/ingredients/:id"
            element={<ModalRoute title="Детали ингредиента" />}
          />
          <Route
            path="/profile/orders/:number"
            element={<ModalRoute title="Детали заказа" />}
          />
        </Routes>
      )}
    </>
  );
};

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

  return (
    <BrowserRouter>
      <AppContent isIngredientsLoading={isIngredientsLoading} error={error} />
    </BrowserRouter>
  );
};

// Отдельный компонент для содержимого приложения, который находится внутри BrowserRouter
const AppContent = ({
  isIngredientsLoading,
  error,
}: {
  isIngredientsLoading: boolean;
  error: string | null;
}) => {
  const location = useLocation();
  const locationState = location.state as LocationState;
  const background = locationState?.background;

  return (
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
  );
};

export default App;

export { AppRoutes, ProtectedRoute, ModalRoute };
