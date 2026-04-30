import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthUser, Role } from '../types';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

const BACKEND_ROLE_MAP: Record<string, Role> = {
  'admin': 'ADMIN',
  'country': 'COUNTRY_REPRESENTATIVE',
  'front office': 'FRONT_OFFICE',
  'huissier': 'BAILIFF',
  'conseiller': 'ADVISOR',
};

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Au chargement : restituer le rôle depuis le token stocké
    const stored = localStorage.getItem('afrikarisque-role');
    if (stored) {
      try {
        setUser({ id: '', email: '', firstName: '', lastName: '', role: stored as Role });
      } catch { /* ignore */ }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await Axios({
        ...SummaryApi.login,
        data: { email, password },
      });

      const { access_token, refresh_token, type_user } = res.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      const mappedRole = BACKEND_ROLE_MAP[type_user?.toLowerCase()] ?? type_user as Role;

      // On stocke uniquement le rôle — le reste viendra de /me plus tard
      localStorage.setItem('afrikarisque-role', mappedRole);

      setUser({ id: '', email: '', firstName: '', lastName: '', role: mappedRole });

      return { success: true };
    } catch (error: any) {
      let message = 'Erreur de connexion';

        if (error.response) {
          // Si le serveur a renvoyé du JSON (ex: { detail: "..." })
          if (typeof error.response.data === 'object' && error.response.data.detail) {
            message = error.response.data.detail;
          } 
          // Si le serveur renvoie une erreur 400 brute sans JSON (ton cas actuel)
          else if (error.response.status === 400) {
            message = 'Identifiants invalides'; // Message manuel car le serveur envoie du HTML
          }
        }
      
        return {
          success: false,
          error: message,
        };
      }
    };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('afrikarisque-role');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}