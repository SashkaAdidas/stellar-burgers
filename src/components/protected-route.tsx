import { FC, useEffect } from 'react';
import { useSelector } from '../services/store';
import { RootState } from '../services/store';
import { Preloader } from '@ui';
import { useNavigate, useLocation } from 'react-router-dom';

interface OnlyUnAuthProps {
  children: JSX.Element;
}

export const OnlyUnAuth: FC<OnlyUnAuthProps> = ({ children }) => {
  const { isAuthChecked, user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (isAuthChecked && user) {
      // Перенаправляем на главную страницу, если пользователь уже авторизован
      navigate('/', { replace: true });
    }
  }, [isAuthChecked, user, navigate]);

  // Пока проверяем статус аутентификации, показываем прелоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Показываем детей только если пользователь не авторизован
  return !user ? children : null;
};
