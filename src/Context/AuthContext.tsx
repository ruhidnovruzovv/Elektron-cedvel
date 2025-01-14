import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { getProfile } from '../api/service';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
  } | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchProfile = async () => {
        try {
          const profileData = await getProfile();
          setUser({
            name: profileData.data.userData.name,
            email: profileData.data.userData.email,
            roles: profileData.data.userData.roles,
            permissions: profileData.data.userData.permissions,
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error fetching profile:', error);
          setIsAuthenticated(false);
        }
      };
      fetchProfile();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setIsAuthenticated(true);
        setUser({
          name: profileData.data.userData.name,
          email: profileData.data.userData.email,
          roles: profileData.data.userData.roles,
          permissions: profileData.data.userData.permissions,
        });
        navigate('/');
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/signin');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
