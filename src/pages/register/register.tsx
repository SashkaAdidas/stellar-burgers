import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch } from '../../services/store'; // Путь к store
import { registerUser } from '../../slices/user.slice'; // Импортируем экшен
import { useNavigate } from 'react-router-dom'; // Для перехода после регистрации
import { RegisterUI } from '@ui-pages';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!userName || !email || !password) {
      setErrorText('Заполните все поля');
      return;
    }

    dispatch(registerUser({ name: userName, email, password }))
      .unwrap()
      .then(() => {
        // Сбрасываем состояние формы после успешной регистрации
        setUserName('');
        setEmail('');
        setPassword('');
        setErrorText('');
        navigate('/profile'); // Успешная регистрация → профиль
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
