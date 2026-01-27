import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // You might need to install jwt-decode: npm install jwt-decode

const API_URL = 'http://localhost:3001/api';

type UserRole = 'student' | 'teacher' | 'admin';

interface User {
  id: string;
  email: string;
}

interface Profile {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  phone: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  token: string | null;
  loading: boolean;
  signUp: (userData: any) => Promise<void>;
  signIn: (credentials: any) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const decoded: { id: string; role: UserRole } = jwtDecode(token);
          // In a real app, you would fetch user profile here
          setUser({ id: decoded.id, email: '' }); // Placeholder email
          setRole(decoded.role);
        } catch (error) {
          console.error('Invalid token:', error);
          signOut();
        }
      } 
      setLoading(false);
    };
    initializeAuth();
  }, [token]);

  const signIn = async (credentials: any) => {
    const response = await axios.post(`${API_URL}/auth/signin`, credentials);
    const { token, user: userData, profile: profileData, role: userRole } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData);
    setProfile(profileData);
    setRole(userRole);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const signUp = async (userData: any) => {
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    const { token, user: newUser, profile: newProfile, role: newRole } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(newUser);
    setProfile(newProfile);
    setRole(newRole);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setProfile(null);
    setRole(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, profile, role, token, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
