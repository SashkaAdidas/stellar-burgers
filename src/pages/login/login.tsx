import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { setCookie } from '../../utils/cookie';
import { loginUserApi } from '../../utils/burger-api';
import { useDispatch } from '../../services/store';
import { setUser } from '../../slices/user.slice';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorText, setErrorText] = useState('');
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    loginUserApi({ email, password })
      .then((data) => {
        // Сохраняем токены
        setCookie('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        dispatch(setUser(data.user));
        // Перенаправляем на главную
        navigate('/');
      })
      .catch((err) => {
        setErrorText(err.message || 'Ошибка входа');
      });
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
