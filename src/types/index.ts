export interface User {
  id: string;
  email: string;
  phone: string;
  nationalId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  hourlyRate: number;
  isActive: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  startDate: Date;
  endDate: Date;
  totalHours: number;
  totalPrice: number;
  discountApplied: number;
  qrCode: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingFormData {
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface RegisterFormData {
  email: string;
  phone: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  phone: string;
  password: string;
}

export interface RoomAvailability {
  roomId: string;
  date: string;
  availableSlots: TimeSlot[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type BookingState = {
  bookings: Booking[];
  isLoading: boolean;
}

export type RoomState = {
  rooms: Room[];
  availability: RoomAvailability[];
  isLoading: boolean;
}
