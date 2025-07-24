import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, MapPin, Calculator, QrCode } from 'lucide-react';
import { format, addDays, startOfDay, parseISO, differenceInHours } from 'date-fns';
import toast from 'react-hot-toast';
import { useBookingStore } from '../store/bookingStore';
import { calculateBookingPrice, generateTimeSlots } from '../utils/helpers';
import type { BookingFormData } from '../types';

const bookingSchema = z.object({
  roomId: z.string().min(1, 'Please select a room'),
  date: z.string().min(1, 'Please select a date'),
  startTime: z.string().min(1, 'Please select start time'),
  endTime: z.string().min(1, 'Please select end time'),
}).refine((data) => data.startTime < data.endTime, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

const BookingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookingPreview, setBookingPreview] = useState<any>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'available' | 'unavailable' | null>(null);
  const { rooms, fetchRooms, createBooking, checkRoomAvailability } = useBookingStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const watchedValues = watch();
  const timeSlots = generateTimeSlots(8, 22);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (watchedValues.roomId && watchedValues.date && watchedValues.startTime && watchedValues.endTime) {
      calculatePreview();
      checkAvailability();
    } else {
      setBookingPreview(null);
      setAvailabilityStatus(null);
    }
  }, [watchedValues]);

  const checkAvailability = async () => {
    if (!watchedValues.roomId || !watchedValues.date || !watchedValues.startTime || !watchedValues.endTime) {
      return;
    }

    setIsCheckingAvailability(true);
    try {
      const isAvailable = await checkRoomAvailability(
        parseInt(watchedValues.roomId),
        watchedValues.date,
        watchedValues.startTime,
        watchedValues.endTime
      );
      setAvailabilityStatus(isAvailable ? 'available' : 'unavailable');
    } catch (error) {
      console.error('Availability check failed:', error);
      setAvailabilityStatus(null);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const calculatePreview = () => {
    const room = rooms.find(r => r.id === watchedValues.roomId);
    if (!room) return;

    const startDateTime = parseISO(`${watchedValues.date}T${watchedValues.startTime}`);
    const endDateTime = parseISO(`${watchedValues.date}T${watchedValues.endTime}`);
    const duration = differenceInHours(endDateTime, startDateTime);

    if (duration <= 0) return;

    const pricing = calculateBookingPrice(duration, room.hourlyRate);

    setBookingPreview({
      room,
      duration,
      ...pricing,
      startDateTime,
      endDateTime,
    });
  };

  const getDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) { // 2 weeks in advance
      const date = addDays(startOfDay(new Date()), i);
      dates.push({
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, 'MMM dd, yyyy'),
        isToday: i === 0,
      });
    }
    return dates;
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!bookingPreview) {
      toast.error('Please complete all booking details');
      return;
    }

    setIsLoading(true);
    try {
      const bookingData = {
        roomId: parseInt(data.roomId),
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        notes: '',
      };

      const success = await createBooking(bookingData);
      
      if (success) {
        toast.success('Booking confirmed! Check your email for QR code.');
        reset();
        setBookingPreview(null);
      } else {
        toast.error('Booking failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred while creating the booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Calendar className="h-16 w-16 mx-auto text-brown-500 mb-6" />
          <h1 className="section-title">Book a Room</h1>
          <p className="text-lg text-brown-600 max-w-2xl mx-auto">
            Reserve your perfect study space. Enjoy 15% discount for bookings of 5 hours or more.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="card p-8">
            <h2 className="text-xl font-semibold text-darkBrown-500 mb-6">Booking Details</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Room Selection */}
              <div>
                <label className="block text-sm font-medium text-darkBrown-500 mb-2">
                  Select Room
                </label>
                <select
                  {...register('roomId')}
                  className="input-field"
                >
                  <option value="">Choose a room...</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} - {room.capacity} people - {room.hourlyRate} THB/hour
                    </option>
                  ))}
                </select>
                {errors.roomId && (
                  <p className="mt-1 text-sm text-red-600">{errors.roomId.message}</p>
                )}
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-darkBrown-500 mb-2">
                  Select Date
                </label>
                <select
                  {...register('date')}
                  className="input-field"
                >
                  <option value="">Choose a date...</option>
                  {getDateOptions().map((date) => (
                    <option key={date.value} value={date.value}>
                      {date.label} {date.isToday && '(Today)'}
                    </option>
                  ))}
                </select>
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-darkBrown-500 mb-2">
                    Start Time
                  </label>
                  <select
                    {...register('startTime')}
                    className="input-field"
                  >
                    <option value="">Select time...</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors.startTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-darkBrown-500 mb-2">
                    End Time
                  </label>
                  <select
                    {...register('endTime')}
                    className="input-field"
                  >
                    <option value="">Select time...</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors.endTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !bookingPreview || availabilityStatus === 'unavailable'}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Booking...' : 
                 availabilityStatus === 'unavailable' ? 'Time Slot Unavailable' :
                 isCheckingAvailability ? 'Checking Availability...' : 
                 'Confirm Booking'}
              </button>
              
              {/* Availability Status */}
              {availabilityStatus && (
                <div className={`p-3 rounded-lg border text-sm ${
                  availabilityStatus === 'available' 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  {availabilityStatus === 'available' 
                    ? '✅ This time slot is available!' 
                    : '❌ This time slot is already booked. Please choose a different time.'}
                </div>
              )}
              
              {isCheckingAvailability && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                  🔍 Checking availability...
                </div>
              )}
            </form>
          </div>

          {/* Booking Preview */}
          <div className="space-y-6">
            {bookingPreview ? (
              <div className="card p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Calculator className="h-6 w-6 text-brown-500" />
                  <h3 className="text-xl font-semibold text-darkBrown-500">Booking Summary</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-cream-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-brown-500" />
                    <div>
                      <p className="font-medium text-darkBrown-500">{bookingPreview.room.name}</p>
                      <p className="text-sm text-brown-600">Up to {bookingPreview.room.capacity} people</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-cream-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-brown-500" />
                    <div>
                      <p className="font-medium text-darkBrown-500">
                        {format(bookingPreview.startDateTime, 'MMM dd, yyyy')}
                      </p>
                      <p className="text-sm text-brown-600">
                        {format(bookingPreview.startDateTime, 'HH:mm')} - {format(bookingPreview.endDateTime, 'HH:mm')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-cream-100 rounded-lg">
                    <Clock className="h-5 w-5 text-brown-500" />
                    <div>
                      <p className="font-medium text-darkBrown-500">
                        {bookingPreview.duration} {bookingPreview.duration === 1 ? 'hour' : 'hours'}
                      </p>
                      <p className="text-sm text-brown-600">
                        {bookingPreview.room.hourlyRate} THB per hour
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-cream-300 pt-4 mt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-brown-600">Subtotal:</span>
                      <span className="text-darkBrown-500">{bookingPreview.total} THB</span>
                    </div>
                    {bookingPreview.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount (15%):</span>
                        <span>-{bookingPreview.discount} THB</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-semibold text-darkBrown-500 border-t border-cream-300 pt-2">
                      <span>Total:</span>
                      <span>{bookingPreview.finalPrice} THB</span>
                    </div>
                  </div>
                </div>

                {bookingPreview.duration >= 5 && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      🎉 15% discount applied for 5+ hour booking!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="card p-8 text-center">
                <QrCode className="h-12 w-12 mx-auto text-brown-300 mb-4" />
                <h3 className="text-lg font-medium text-darkBrown-500 mb-2">Booking Preview</h3>
                <p className="text-brown-600">Complete the form to see your booking details and pricing.</p>
              </div>
            )}

            {/* Booking Information */}
            <div className="card p-6">
              <h4 className="font-semibold text-darkBrown-500 mb-3">Booking Policy</h4>
              <ul className="space-y-2 text-sm text-brown-600">
                <li>• Bookings can be made same-day or in advance</li>
                <li>• 15% discount for bookings of 5 hours or more</li>
                <li>• QR code confirmation will be sent to your email</li>
                <li>• Cancellation allowed up to 2 hours before start time</li>
                <li>• Member rates: 50 THB per hour</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
