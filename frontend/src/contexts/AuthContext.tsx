import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'farmer' | 'field_officer' | 'finance' | 'manager';
  created_at: Date;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'field_officer' | 'finance' | 'manager';
  accessCode?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('fmis-user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('fmis-user');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save JWT token
        localStorage.setItem('token', data.token);
        // Save user data
        localStorage.setItem('fmis-user', JSON.stringify(data.user));
        setUser(data.user);
        setError(null);
        return true;
      } else {
        setError(data.message || 'Login failed');
        return false;
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError('Network error. Please check if the backend server is running.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save JWT token from registration
        localStorage.setItem('token', data.token);
        
        // Fetch user profile to get complete user data
        const profileResponse = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${data.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          localStorage.setItem('fmis-user', JSON.stringify(profileData.user));
          setUser(profileData.user);
        } else {
          // If profile fetch fails, create user object from registration data
          const newUser = {
            _id: data.userId,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            created_at: new Date()
          };
          localStorage.setItem('fmis-user', JSON.stringify(newUser));
          setUser(newUser);
        }
        
        setError(null);
        return true;
      } else {
        setError(data.message || 'Registration failed');
        return false;
      }
    } catch (err: unknown) {
      console.error('Registration error:', err);
      setError('Network error. Please check if the backend server is running.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fmis-user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
