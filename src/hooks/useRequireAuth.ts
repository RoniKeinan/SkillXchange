import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const LOGIN_URL = 'https://us-east-1qm0ueiz0l.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=1h0smv7g3m91qshr4epscp3ual&response_type=token&scope=openid+email+profile&redirect_uri=http://localhost:5173/';

export const useRequireAuth = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const requireAuth = (onAuthenticated: () => void) => {
    if (user) {
      onAuthenticated(); // ממשיך לפעולה הרצויה
    } else {
      window.location.href = LOGIN_URL; // מעביר לדף התחברות
    }
  };

  return requireAuth;
};
