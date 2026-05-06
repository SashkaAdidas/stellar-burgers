import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchUser,
  updateUser,
  logoutUser,
  forceAuthCheck,
} from '../../slices/user.slice';
import { TUser } from '@utils-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.user);
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: '',
      });
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const userData: Partial<TUser> = {};
    if (formValue.name !== user?.name) {
      userData.name = formValue.name;
    }
    if (formValue.email !== user?.email) {
      userData.email = formValue.email;
    }

    dispatch(updateUser(userData))
      .unwrap()
      .then(() => {
        setSuccessMessage('Данные успешно обновлены');
        setErrorMessage('');
        setFormValue((prev) => ({ ...prev, password: '' }));
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch((error) => {
        setErrorMessage(error.message || 'Ошибка при обновлении данных');
        setSuccessMessage('');
      });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: '',
      });
    }
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(forceAuthCheck());
    navigate('/login');
  };

  useEffect(
    () => () => {
      setFormValue({
        name: '',
        email: '',
        password: '',
      });
      setSuccessMessage('');
      setErrorMessage('');
    },
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setSuccessMessage('');
    setErrorMessage('');
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    return <div>Загрузка данных пользователя...</div>;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      handleLogout={handleLogout}
      successMessage={successMessage}
      errorMessage={errorMessage}
    />
  );
};
