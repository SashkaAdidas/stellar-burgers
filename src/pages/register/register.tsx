import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch } from '../../services/store';
import { registerUser } from '../../slices/user.slice';
import { useNavigate, useLocation } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';

// Тип для location state
type LocationState = {
  from?: string;
};

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  const from = locationState?.from || '/';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!userName || !email || !password) {
      setErrorText('Заполните все поля');
      return;
    }

    dispatch(registerUser({ name: userName, email, password }))
      .unwrap()
      .then(() => {
        setUserName('');
        setEmail('');
        setPassword('');
        setErrorText('');
        navigate(from, { replace: true });
      })
      .catch((err) => {
        setErrorText(err.message || 'Ошибка регистрации');
      });
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};

export default Register;
