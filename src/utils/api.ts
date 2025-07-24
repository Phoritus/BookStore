import axios from 'axios';
import type { ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      method: error.config?.method
    });

    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 429) {
      // Rate limit error
      console.warn('Rate limit exceeded, please try again later');
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('Network error: Cannot connect to server');
    }
    
    return Promise.reject(error);
  }
);

export const apiCall = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.request({
      method,
      url,
      data,
    });
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('API call failed:', error);
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'An error occurred',
    };
  }
};

// Auth API calls
export const authAPI = {
  register: (data: any) => apiCall('POST', '/auth/register', data),
  login: (data: any) => apiCall('POST', '/auth/login', data),
  logout: () => apiCall('POST', '/auth/logout'),
  me: () => apiCall('GET', '/auth/me'),
};

// Booking API calls
export const bookingAPI = {
  getBookings: () => apiCall('GET', '/bookings'),
  createBooking: (data: any) => apiCall('POST', '/bookings', data),
  updateBooking: (id: string, data: any) => apiCall('PUT', `/bookings/${id}`, data),
  deleteBooking: (id: string) => apiCall('DELETE', `/bookings/${id}`),
  getBooking: (id: string) => apiCall('GET', `/bookings/${id}`),
};

// Room API calls
export const roomAPI = {
  getRooms: () => apiCall('GET', '/rooms'),
  getRoom: (id: string) => apiCall('GET', `/rooms/${id}`),
  getAvailability: (roomId: string, date: string) => apiCall('GET', `/rooms/${roomId}/availability?date=${date}`),
};

export default api;
