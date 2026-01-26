import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'student' | 'teacher' | 'admin';

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // MOCK AUTH FOR DEMO
  const mockUser: User = {
    id: 'mock-user-id',
    app_metadata: { provider: 'email' },
    user_metadata: { full_name: 'Pradip Ojha' },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as User;

  const mockProfile: Profile = {
    id: 'mock-user-id',
    full_name: 'Pradip Ojha',
    avatar_url: 'https://github.com/shadcn.png',
    phone: '9800000000',
  };

  const value: AuthContextType = {
    user: mockUser,
    session: {} as Session, // Mock session object
    profile: mockProfile,
    role: 'student',
    loading: false,
    signUp: async () => ({ error: null }),
    signIn: async () => ({ error: null }),
    signOut: async () => {},
  };

  return (
    <AuthContext.Provider value={value}>
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
