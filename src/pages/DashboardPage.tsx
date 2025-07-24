import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, QrCode, User, Mail, Phone, CreditCard, X, RefreshCw } from 'lucide-react';
import { format, differenceInHours } from 'date-fns';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { bookings, fetchUserBookings, cancelBooking } = useBookingStore();

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      await fetchUserBookings();
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const confirmed = window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.');
    
    if (!confirmed) return;

    setIsCancelling(bookingId);
    try {
      const success = await cancelBooking(bookingId);
      if (success) {
        toast.success('Booking cancelled successfully');
        await fetchBookings(); // Refresh bookings
      }
    } catch (error) {
      toast.error('Failed to cancel booking');
    } finally {
      setIsCancelling(null);
    }
  };

  const canCancelBooking = (startDate: string) => {
    const bookingStart = new Date(startDate);
    const now = new Date();
    const hoursUntilStart = differenceInHours(bookingStart, now);
    return hoursUntilStart >= 2; // Can cancel if booking is at least 2 hours away
  };

  // Show loading state or login prompt if no user
  if (!user) {
    return (
      <div className="page-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <User className="h-16 w-16 mx-auto text-brown-500 mb-6" />
            <h1 className="section-title">Please Login</h1>
            <p className="text-lg text-brown-600 mb-8">
              You need to login to access your dashboard.
            </p>
            <a href="/login" className="btn-primary">
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'confirmed' && new Date(booking.startDate) > new Date()
  );

  const pastBookings = bookings.filter(booking => 
    booking.status === 'completed' || new Date(booking.endDate) < new Date()
  );

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="section-title">Member Dashboard</h1>
          <p className="text-lg text-brown-600">
            Welcome back! Manage your bookings and account information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile */}
          <div className="lg:col-span-1">
            <div className="card p-6 mb-6">
              <div className="flex items-center space-x-3 mb-6">
                <User className="h-6 w-6 text-brown-500" />
                <h2 className="text-xl font-semibold text-darkBrown-500">Profile Information</h2>
              </div>
              
              {user && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-brown-400" />
                    <div>
                      <p className="text-sm text-brown-600">Email</p>
                      <p className="font-medium text-darkBrown-500">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-brown-400" />
                    <div>
                      <p className="text-sm text-brown-600">Phone</p>
                      <p className="font-medium text-darkBrown-500">{user.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-4 w-4 text-brown-400" />
                    <div>
                      <p className="text-sm text-brown-600">National ID</p>
                      <p className="font-medium text-darkBrown-500">{user.nationalId}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-brown-400" />
                    <div>
                      <p className="text-sm text-brown-600">Member Since</p>
                      <p className="font-medium text-darkBrown-500">
                        {user.createdAt && !isNaN(new Date(user.createdAt).getTime())
                          ? format(new Date(user.createdAt), 'MMM dd, yyyy')
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-darkBrown-500 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-brown-600">Total Bookings:</span>
                  <span className="font-medium text-darkBrown-500">{bookings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brown-600">Upcoming:</span>
                  <span className="font-medium text-darkBrown-500">{upcomingBookings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brown-600">Completed:</span>
                  <span className="font-medium text-darkBrown-500">{pastBookings.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings Section */}
          <div className="lg:col-span-2">
            {/* Upcoming Bookings */}
            <div className="card p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 text-brown-500" />
                  <h2 className="text-xl font-semibold text-darkBrown-500">Upcoming Bookings</h2>
                </div>
                <button
                  onClick={fetchBookings}
                  disabled={isLoading}
                  className="btn-secondary text-sm disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="bg-cream-100 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <MapPin className="h-4 w-4 text-brown-500" />
                            <span className="font-medium text-darkBrown-500">Room {booking.roomId}</span>
                            {getStatusBadge(booking.status)}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-brown-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{format(new Date(booking.startDate), 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {format(new Date(booking.startDate), 'HH:mm')} - 
                                {format(new Date(booking.endDate), 'HH:mm')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="text-sm">
                              <span className="text-brown-600">Duration: </span>
                              <span className="font-medium text-darkBrown-500">{booking.totalHours}h</span>
                              <span className="text-brown-600 ml-4">Total: </span>
                              <span className="font-medium text-darkBrown-500">{booking.totalPrice} THB</span>
                            </div>
                            
                            {/* Cancel Button */}
                            {canCancelBooking(booking.startDate.toString()) && booking.status === 'confirmed' && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={isCancelling === booking.id}
                                className="px-3 py-1 text-xs bg-red-100 text-red-700 border border-red-200 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isCancelling === booking.id ? 'Cancelling...' : 'Cancel'}
                              </button>
                            )}
                            
                            {!canCancelBooking(booking.startDate.toString()) && booking.status === 'confirmed' && (
                              <span className="text-xs text-brown-500 italic">
                                Cannot cancel (less than 2h)
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          <QrCode className="h-8 w-8 text-brown-500" />
                        </div>
                      </div>
                      
                      {/* QR Code or booking details */}
                      {booking.qrCode && (
                        <div className="mt-3 pt-3 border-t border-cream-300">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-brown-600">Scan QR code at check-in</span>
                            <button className="text-xs text-brown-500 hover:text-brown-700 underline">
                              View QR Code
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-brown-300 mb-4" />
                  <h3 className="text-lg font-medium text-darkBrown-500 mb-2">No Upcoming Bookings</h3>
                  <p className="text-brown-600 mb-4">Book a room to see your reservations here.</p>
                  <button className="btn-primary">Book a Room</button>
                </div>
              )}
            </div>

            {/* Past Bookings */}
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="h-6 w-6 text-brown-500" />
                <h2 className="text-xl font-semibold text-darkBrown-500">Booking History</h2>
              </div>

              {pastBookings.length > 0 ? (
                <div className="space-y-3">
                  {pastBookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-cream-50 rounded-lg">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-darkBrown-500">Room {booking.roomId}</span>
                          {getStatusBadge(booking.status)}
                        </div>
                        <p className="text-sm text-brown-600">
                          {format(new Date(booking.startDate), 'MMM dd, yyyy')} • {booking.totalHours}h • {booking.totalPrice} THB
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {pastBookings.length > 5 && (
                    <p className="text-center text-brown-600 text-sm pt-2">
                      And {pastBookings.length - 5} more bookings...
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Clock className="h-8 w-8 mx-auto text-brown-300 mb-3" />
                  <p className="text-brown-600">No booking history yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
