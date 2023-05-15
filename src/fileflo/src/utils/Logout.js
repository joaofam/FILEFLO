// External imports
import { resetUserSession } from '../service/AuthService';
import { useNavigate } from 'react-router-dom';

// useLogout hook
export const useLogout = () => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    // Reset the user session
    resetUserSession();
    // Navigate to the login page
    navigate('/login');
  };

  return logoutHandler;
};
