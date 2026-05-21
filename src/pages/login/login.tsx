import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../slices/user.slice';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../../services/store';

// Тип для location state
type LocationState = {
  from?: string;
};

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorText, setErrorText] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;

  // Получаем состояние загрузки и ошибки из Redux
  const { loading } = useSelector((state: RootState) => state.user);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Сбрасываем предыдущую ошибку
    setErrorText('');

    // Dispatch-им thunk для входа пользователя
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        // После успешного входа переходим на сохраненный маршрут или на главную
        const from = locationState?.from || '/';
        navigate(from, { replace: true });
      })
      .catch((error: string) => {
        setErrorText(error || 'Ошибка входа');
      });
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      isLoading={loading}
    />
  );
};
