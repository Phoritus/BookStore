import axios from 'axios';
import type { ApiResponse, Room, Booking, User } from '../types';

// UI-only mode flag (default true to satisfy requirement)
const UI_ONLY = (import.meta as any).env?.VITE_UI_ONLY === 'false' ? false : true;

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

// Axios instance for non-UI mode
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

if (!UI_ONLY) {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url,
        method: error.config?.method,
      });
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
}

// In-memory mock data for UI-only mode
type MockResponse<T = any> = { data: T; status: number };

const loadLS = <T>(key: string, fallback: T): T => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
};
const saveLS = (key: string, value: any) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };

let mockRooms: Room[] = loadLS<Room[]>('mock_rooms', [
  { id: '1', name: 'Amber Room', capacity: 3, hourlyRate: 120, isActive: true },
  { id: '2', name: 'Mocha Room', capacity: 5, hourlyRate: 180, isActive: true },
  { id: '3', name: 'Latte Room', capacity: 2, hourlyRate: 90, isActive: true },
]);

let mockBookings: Booking[] = loadLS<Booking[]>('mock_bookings', []);

let mockUser: User | null = loadLS<User | null>('mock_user', {
  id: 'u1',
  email: 'demo@example.com',
  phone: '0800000000',
  nationalId: '1-2345-67890-12-3',
  createdAt: new Date(),
  updatedAt: new Date(),
});

const delay = (ms = 250) => new Promise(res => setTimeout(res, ms));

const overlaps = (startA: Date, endA: Date, startB: Date, endB: Date) => startA < endB && startB < endA;

// Simple ID helpers
const uuid = () => Math.random().toString(36).slice(2);

// Mock adapter implementing subset of Axios API
const mockApi = {
  async request(cfg: { method?: string; url: string; data?: any; params?: any }): Promise<MockResponse> {
    const method = (cfg.method || 'GET').toUpperCase();
    const url = cfg.url;
    const body = cfg.data || {};
    const params = cfg.params || {};
    await delay();

    // AUTH
    if (method === 'POST' && url === '/auth/login') {
      const user = mockUser || {
        id: 'u1', email: body.email || 'user@example.com', phone: body.phone || '0800000000', nationalId: 'X', createdAt: new Date(), updatedAt: new Date(),
      } as User;
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(user));
      saveLS('mock_user', user);
      return { status: 200, data: { user, accessToken: 'mock-token' } };
    }
    if (method === 'POST' && url === '/auth/register') {
      const user: User = {
        id: uuid(),
        email: body.email,
        phone: body.phone,
        nationalId: body.nationalId || 'X',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUser = user; saveLS('mock_user', user);
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(user));
      return { status: 200, data: { user, accessToken: 'mock-token' } };
    }

    // ROOMS
    if (method === 'GET' && url === '/rooms') {
      return { status: 200, data: { rooms: mockRooms } };
    }
    if (method === 'GET' && url.startsWith('/rooms/') && url.endsWith('/availability')) {
      const parts = url.split('/');
      const roomId = parts[2];
      const date = params.date || new URLSearchParams(url.split('?')[1] || '').get('date');
      const startTime = params.startTime || new URLSearchParams(url.split('?')[1] || '').get('startTime');
      const endTime = params.endTime || new URLSearchParams(url.split('?')[1] || '').get('endTime');
      if (!date || !startTime || !endTime) return { status: 400, data: { message: 'Missing params' } } as any;
      const start = new Date(`${date}T${startTime}:00`);
      const end = new Date(`${date}T${endTime}:00`);
      const conflicting = mockBookings.some(b => b.roomId === roomId && overlaps(start, end, new Date(b.startDate), new Date(b.endDate)) && b.status !== 'cancelled');
      return { status: 200, data: { isAvailable: !conflicting } };
    }
    if (method === 'GET' && url === '/rooms/status/current') {
      // Synthesize current status
      const now = new Date();
      const rooms = mockRooms.map(r => {
        const current = mockBookings.find(b => b.roomId === r.id && b.status !== 'cancelled' && new Date(b.startDate) <= now && now < new Date(b.endDate));
        const upcoming = mockBookings
          .filter(b => b.roomId === r.id && b.status !== 'cancelled' && new Date(b.startDate) > now)
          .sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];
        return {
          id: r.id,
          name: r.name,
          capacity: r.capacity,
          hourlyRate: r.hourlyRate,
          currentStatus: current ? 'occupied' : upcoming ? 'upcoming' : 'available',
          currentBooking: current ? { startTime: new Date(current.startDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), endTime: new Date(current.endDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) } : undefined,
          nextBooking: upcoming ? { startTime: new Date(upcoming.startDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), endTime: new Date(upcoming.endDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) } : undefined,
        };
      });
      return { status: 200, data: { rooms } };
    }

    // BOOKINGS
    if (method === 'GET' && url === '/bookings/my-bookings') {
      return { status: 200, data: { bookings: mockBookings } };
    }
    if (method === 'POST' && url === '/bookings') {
      const id = uuid();
      const start = new Date(`${body.date}T${body.startTime}:00`);
      const end = new Date(`${body.date}T${body.endTime}:00`);
      const room = mockRooms.find(r => r.id === String(body.roomId));
      const hours = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 3600000));
      const rate = room?.hourlyRate ?? 100;
      const total = rate * hours;
      const discountApplied = hours >= 5 ? Math.round(total * 0.15) : 0;
      const finalPrice = total - discountApplied;
      const booking: Booking = {
        id,
        userId: (mockUser?.id || 'u1') as string,
        roomId: String(body.roomId),
        startDate: start,
        endDate: end,
        totalHours: hours,
        totalPrice: finalPrice,
        discountApplied,
        qrCode: 'MOCK-QR-' + id,
        status: 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Booking;
      mockBookings = [booking, ...mockBookings];
      saveLS('mock_bookings', mockBookings);
      return { status: 200, data: { booking } };
    }
    if (method === 'PATCH' && url.startsWith('/bookings/') && url.endsWith('/cancel')) {
      const id = url.split('/')[2];
      mockBookings = mockBookings.map(b => b.id === id ? { ...b, status: 'cancelled', updatedAt: new Date() } : b);
      saveLS('mock_bookings', mockBookings);
      return { status: 200, data: { success: true } };
    }

    // Fallback
    return { status: 404, data: { message: 'Not found (mock)' } } as any;
  },
  get(url: string, config?: any) { return this.request({ method: 'GET', url, ...(config||{}) }); },
  post(url: string, data?: any, config?: any) { return this.request({ method: 'POST', url, data, ...(config||{}) }); },
  patch(url: string, data?: any, config?: any) { return this.request({ method: 'PATCH', url, data, ...(config||{}) }); },
};

export const api = UI_ONLY ? (mockApi as any) : axiosInstance;

export const apiCall = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  data?: any,
  params?: any
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.request({ method, url, data, params });
    return { success: true, data: response.data } as any;
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error?.message || 'An error occurred' };
  }
};

// Convenience wrappers (work for both real and mock api)
export const authAPI = {
  register: (data: any) => apiCall('POST', '/auth/register', data),
  login: (data: any) => apiCall('POST', '/auth/login', data),
  logout: () => Promise.resolve({ success: true } as ApiResponse<any>),
  me: () => Promise.resolve({ success: true, data: loadLS('mock_user', null) } as ApiResponse<any>),
};

export const bookingAPI = {
  getBookings: () => apiCall('GET', '/bookings/my-bookings'),
  createBooking: (data: any) => apiCall('POST', '/bookings', data),
  updateBooking: (_id: string, _data: any) => Promise.resolve({ success: true } as ApiResponse<any>),
  deleteBooking: (_id: string) => Promise.resolve({ success: true } as ApiResponse<any>),
  getBooking: (_id: string) => Promise.resolve({ success: true, data: null } as ApiResponse<any>),
};

export const roomAPI = {
  getRooms: () => apiCall('GET', '/rooms'),
  getRoom: (_id: string) => Promise.resolve({ success: true, data: null } as ApiResponse<any>),
  getAvailability: (roomId: string, date: string) => apiCall('GET', `/rooms/${roomId}/availability`, undefined, { date }),
};

export default api;
