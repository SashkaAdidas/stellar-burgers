import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { logoutUser, forceAuthCheck } from '../../slices/user.slice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(forceAuthCheck());
    navigate('/login');
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
