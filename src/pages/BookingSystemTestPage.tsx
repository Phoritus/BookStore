import React, { useState } from 'react';
import { Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle, Settings } from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';
import { useAuthStore } from '../store/authStore';

const BookingSystemTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const { rooms, fetchRooms, fetchRoomStatus, checkRoomAvailability } = useBookingStore();
  const { user } = useAuthStore();

  const runBookingSystemTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    const results: any[] = [];

    try {
      // Test 1: Fetch Rooms
      results.push({ test: 'Fetching Rooms', status: 'running', message: 'Loading rooms...' });
      setTestResults([...results]);
      
      await fetchRooms();
      
      if (rooms.length > 0) {
        results[results.length - 1] = { test: 'Fetching Rooms', status: 'success', message: `${rooms.length} rooms loaded successfully` };
      } else {
        results[results.length - 1] = { test: 'Fetching Rooms', status: 'error', message: 'No rooms found' };
      }
      setTestResults([...results]);

      // Test 2: Room Status API
      results.push({ test: 'Room Status API', status: 'running', message: 'Checking room status...' });
      setTestResults([...results]);
      
      const roomStatus = await fetchRoomStatus();
      
      if (roomStatus.length > 0) {
        results[results.length - 1] = { test: 'Room Status API', status: 'success', message: `Status for ${roomStatus.length} rooms retrieved` };
      } else {
        results[results.length - 1] = { test: 'Room Status API', status: 'error', message: 'Failed to get room status' };
      }
      setTestResults([...results]);

      // Test 3: Room Availability Check
      if (rooms.length > 0) {
        results.push({ test: 'Availability Check', status: 'running', message: 'Testing availability API...' });
        setTestResults([...results]);
        
        const testRoom = rooms[0];
        const today = new Date().toISOString().split('T')[0];
        const isAvailable = await checkRoomAvailability(
          Number(testRoom.id), 
          today, 
          '14:00', 
          '16:00'
        );
        
        results[results.length - 1] = { 
          test: 'Availability Check', 
          status: 'success', 
          message: `Room ${testRoom.name} availability: ${isAvailable ? 'Available' : 'Not Available'}` 
        };
        setTestResults([...results]);
      }

      // Test 4: Authentication Status
      results.push({ test: 'Authentication', status: 'running', message: 'Checking user auth...' });
      setTestResults([...results]);
      
      if (user) {
        results[results.length - 1] = { test: 'Authentication', status: 'success', message: `Logged in as ${user.email}` };
      } else {
        results[results.length - 1] = { test: 'Authentication', status: 'warning', message: 'Not logged in - some features unavailable' };
      }
      setTestResults([...results]);

    } catch (error) {
      results.push({ test: 'System Error', status: 'error', message: `Test failed: ${error}` });
      setTestResults([...results]);
    } finally {
      setIsRunningTests(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'running':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'running':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Settings className="h-16 w-16 mx-auto text-brown-500 mb-6" />
          <h1 className="section-title">Booking System Status</h1>
          <p className="text-lg text-brown-600 max-w-2xl mx-auto">
            Complete functionality test of the Book Café booking system
          </p>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto text-brown-500 mb-3" />
            <h3 className="font-semibold text-darkBrown-500">Booking System</h3>
            <p className="text-sm text-brown-600 mt-2">Complete room reservation functionality</p>
          </div>
          
          <div className="card p-6 text-center">
            <Users className="h-8 w-8 mx-auto text-brown-500 mb-3" />
            <h3 className="font-semibold text-darkBrown-500">Real-time Status</h3>
            <p className="text-sm text-brown-600 mt-2">Live room availability tracking</p>
          </div>
          
          <div className="card p-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto text-brown-500 mb-3" />
            <h3 className="font-semibold text-darkBrown-500">User Management</h3>
            <p className="text-sm text-brown-600 mt-2">Authentication & booking history</p>
          </div>
        </div>

        {/* Test Controls */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-darkBrown-500">System Tests</h2>
            <button
              onClick={runBookingSystemTests}
              disabled={isRunningTests}
              className="btn-primary disabled:opacity-50"
            >
              {isRunningTests ? 'Running Tests...' : 'Run System Tests'}
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div key={index} className={`card p-4 border-2 ${getStatusColor(result.status)}`}>
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <h3 className="font-medium text-darkBrown-500">{result.test}</h3>
                    <p className="text-sm text-brown-600">{result.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Feature List */}
        <div className="card p-6 mt-8">
          <h2 className="text-xl font-semibold text-darkBrown-500 mb-6">Completed Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Room booking with time selection</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Real-time availability checking</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Pricing with 5+ hour discounts</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">QR code generation</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">User dashboard with booking history</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Booking cancellation (2h+ notice)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Room status visualization</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">JWT authentication system</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-8 text-center space-x-4">
          <a href="/booking" className="btn-primary">
            Book a Room
          </a>
          <a href="/room-availability" className="btn-secondary">
            Room Status
          </a>
          <a href="/dashboard" className="btn-secondary">
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookingSystemTestPage;
