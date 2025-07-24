import { create } from 'zustand';
import { api } from '../utils/api';
import toast from 'react-hot-toast';
import type { AuthState } from '../types';

interface LoginData {
  email: string;
  phone: string;
  password: string;
}

interface RegisterData {
  email: string;
  phone: string;
  nationalId: string;
  password: string;
}

interface AuthStore extends AuthState {
  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  
  login: async (data: LoginData) => {
    try {
      set({ isLoading: true });
      
      console.log('Attempting login with:', { email: data.email, phone: data.phone });
      
      const response = await api.post('/auth/login', data);
      const { user, accessToken } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, isAuthenticated: true, isLoading: false });
      toast.success('Login successful!');
      return true;
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      let message = 'Login failed';
      
      if (error.response?.status === 429) {
        message = 'Too many login attempts. Please try again later.';
      } else if (error.response?.status === 401) {
        message = 'Invalid credentials. Please check your email/phone and password.';
      } else if (error.response?.status === 400) {
        message = error.response?.data?.message || 'Invalid login data.';
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        message = 'Cannot connect to server. Please check your connection.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  register: async (data: RegisterData) => {
    try {
      set({ isLoading: true });
      
      const response = await api.post('/auth/register', data);
      const { user, accessToken } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, isAuthenticated: true, isLoading: false });
      toast.success('Registration successful!');
      return true;
      
    } catch (error: any) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false, isLoading: false });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
  },
  
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
}));

// Initialize auth state from localStorage
const initializeAuth = () => {
  const savedUser = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  if (savedUser && token) {
    try {
      const user = JSON.parse(savedUser);
      useAuthStore.setState({ user, isAuthenticated: true });
    } catch (error) {
      console.error('Failed to parse saved user data:', error);
      useAuthStore.getState().logout();
    }
  }
};

// Call initialization
initializeAuth();
