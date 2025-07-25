import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'financial_advisor' | 'bailiff';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  type_user: string;
  user_id?: string;
  username?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('scoreUser');
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedRefreshToken = localStorage.getItem('refreshToken');

    if (savedUser && savedAccessToken) {
      setUser(JSON.parse(savedUser));
      setAccessToken(savedAccessToken);
      if (savedRefreshToken) setRefreshToken(savedRefreshToken);
      setIsAuthenticated(true);
    }
  }, []);

  const refreshAccessToken = async (): Promise<string | null> => {
    if (!refreshToken) return null;

    try {
      const response = await fetch('http://192.168.1.15:8000/score/refresh-token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        if (response.status === 401) logout();
        return null;
      }

      const data: { access_token: string } = await response.json();
      setAccessToken(data.access_token);
      localStorage.setItem('accessToken', data.access_token);
      return data.access_token;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      return null;
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (!accessToken) return null;

    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const isExpired = Date.now() >= payload.exp * 1000;

      if (isExpired) return await refreshAccessToken();

      return accessToken;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return await refreshAccessToken();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/score/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error(await response.text());

      const data: TokenResponse = await response.json();

      if (!data.access_token || !data.refresh_token || !data.type_user) {
        throw new Error('Réponse invalide du serveur');
      }

      const userData: User = {
        id: data.user_id || '1',
        username: data.username || email.split('@')[0],
        email: email,
        role: data.type_user as 'admin' | 'financial_advisor' | 'bailiff',
      };

      setUser(userData);
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      setIsAuthenticated(true);

      localStorage.setItem('scoreUser', JSON.stringify(userData));
      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
    } catch (err) {
      console.error('Erreur lors de la connexion :', err);
      throw err;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser: User = {
        id: Date.now().toString(),
        username,
        email,
        role: 'admin',
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('scoreUser', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Token d'accès non disponible");

      const response = await fetch('http://127.0.0.1:8000/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur changement mot de passe:', errorData);
        throw new Error(errorData.message || 'Échec du changement de mot de passe');
      }
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('scoreUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout,
      getAccessToken,
      changePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
