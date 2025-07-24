import React, { useState, useEffect } from 'react';
import { MapPin, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format, addHours } from 'date-fns';
import { useBookingStore } from '../store/bookingStore';
import type { Room } from '../types';

interface RoomWithStatus extends Room {
  currentStatus: 'available' | 'occupied' | 'upcoming';
  nextBooking?: {
    startTime: string;
    endTime: string;
    user?: string;
  };
  currentBooking?: {
    startTime: string;
    endTime: string;
    user?: string;
  };
}

const RoomAvailabilityPage: React.FC = () => {
  const [roomsWithStatus, setRoomsWithStatus] = useState<RoomWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { fetchRoomStatus } = useBookingStore();

  useEffect(() => {
    fetchRoomStatusData();
  }, []);

  useEffect(() => {
    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      fetchRoomStatusData(); // Refresh room status
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const fetchRoomStatusData = async () => {
    setIsLoading(true);
    try {
      const statusData = await fetchRoomStatus();
      
      // Transform API data to match our interface
      const roomsWithStatusData: RoomWithStatus[] = statusData.map((room: any) => ({
        id: room.id,
        name: room.name,
        capacity: room.capacity,
        hourlyRate: room.hourlyRate,
        isActive: true,
        currentStatus: room.currentStatus,
        currentBooking: room.currentBooking,
        nextBooking: room.nextBooking
      }));

      setRoomsWithStatus(roomsWithStatusData);
    } catch (error) {
      console.error('Failed to fetch room status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'occupied':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'upcoming':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'occupied':
        return 'Occupied';
      case 'upcoming':
        return 'Booking Soon';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Clock className="h-16 w-16 mx-auto text-brown-500 mb-6 animate-spin" />
            <h1 className="section-title">Loading Room Status...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <MapPin className="h-16 w-16 mx-auto text-brown-500 mb-6" />
          <h1 className="section-title">Room Availability</h1>
          <p className="text-lg text-brown-600 max-w-2xl mx-auto mb-4">
            Real-time status of all study rooms at our Book Café
          </p>
          <p className="text-sm text-brown-500">
            Last updated: {format(currentTime, 'MMM dd, yyyy - HH:mm')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomsWithStatus.map((room) => (
            <div key={room.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-darkBrown-500">{room.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-brown-600 mt-1">
                    <Users className="h-4 w-4" />
                    <span>Up to {room.capacity} people</span>
                  </div>
                </div>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(room.currentStatus)}`}>
                  {getStatusIcon(room.currentStatus)}
                  <span className="text-sm font-medium">{getStatusText(room.currentStatus)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-brown-600">Hourly Rate:</span>
                  <span className="font-medium text-darkBrown-500">{room.hourlyRate} THB</span>
                </div>

                {room.currentBooking && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-red-700">Currently Occupied</span>
                    </div>
                    <p className="text-xs text-red-600">
                      {room.currentBooking.startTime} - {room.currentBooking.endTime}
                    </p>
                  </div>
                )}

                {room.nextBooking && room.currentStatus !== 'occupied' && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-700">Next Booking</span>
                    </div>
                    <p className="text-xs text-yellow-600">
                      {room.nextBooking.startTime} - {room.nextBooking.endTime}
                    </p>
                  </div>
                )}

                {room.currentStatus === 'available' && !room.nextBooking && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-700">Available Now</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-cream-300">
                <a
                  href="/booking"
                  className="w-full btn-primary text-center block disabled:opacity-50"
                >
                  Book This Room
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 card p-6">
          <h3 className="text-lg font-semibold text-darkBrown-500 mb-4">Room Status Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-green-700">Available</p>
                <p className="text-sm text-green-600">Ready for immediate booking</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium text-red-700">Occupied</p>
                <p className="text-sm text-red-600">Currently in use</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium text-yellow-700">Booking Soon</p>
                <p className="text-sm text-yellow-600">Next booking starting soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomAvailabilityPage;
