import { create } from 'zustand';
import { api } from '../utils/api';
import toast from 'react-hot-toast';
import type { BookingState, Room } from '../types';

interface BookingData {
  roomId: number;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

interface BookingStore extends BookingState {
  rooms: Room[];
  fetchRooms: () => Promise<void>;
  fetchUserBookings: () => Promise<void>;
  createBooking: (data: BookingData) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  checkRoomAvailability: (roomId: number, date: string, startTime: string, endTime: string) => Promise<boolean>;
  setLoading: (loading: boolean) => void;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: [],
  rooms: [],
  isLoading: false,
  
  fetchRooms: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get('/rooms');
      set({ rooms: response.data.rooms, isLoading: false });
    } catch (error: any) {
      console.error('Fetch rooms error:', error);
      toast.error('Failed to load rooms');
      set({ isLoading: false });
    }
  },

  fetchUserBookings: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get('/bookings/my-bookings');
      set({ bookings: response.data.bookings, isLoading: false });
    } catch (error: any) {
      console.error('Fetch bookings error:', error);
      toast.error('Failed to load bookings');
      set({ isLoading: false });
    }
  },

  createBooking: async (data: BookingData) => {
    try {
      set({ isLoading: true });
      await api.post('/bookings', data);
      
      // Refresh user bookings
      get().fetchUserBookings();
      
      toast.success('Booking created successfully!');
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      console.error('Create booking error:', error);
      const message = error.response?.data?.message || 'Failed to create booking';
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  cancelBooking: async (bookingId: string) => {
    try {
      set({ isLoading: true });
      await api.patch(`/bookings/${bookingId}/cancel`);
      
      // Refresh user bookings
      get().fetchUserBookings();
      
      toast.success('Booking cancelled successfully');
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      console.error('Cancel booking error:', error);
      const message = error.response?.data?.message || 'Failed to cancel booking';
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  checkRoomAvailability: async (roomId: number, date: string, startTime: string, endTime: string) => {
    try {
      const response = await api.get(`/rooms/${roomId}/availability`, {
        params: { date, startTime, endTime }
      });
      return response.data.isAvailable;
    } catch (error: any) {
      console.error('Check availability error:', error);
      return false;
    }
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
}));
