import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Coffee, LogOut, User, BookOpen, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-cream-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-brown-600 hover:text-brown-700 transition-colors">
            <Coffee className="h-8 w-8" />
            <span className="text-xl font-display font-semibold">Book Café</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/book-lending" 
              className="text-darkBrown-500 hover:text-brown-600 transition-colors font-medium flex items-center space-x-1"
            >
              <BookOpen className="h-4 w-4" />
              <span>Book Lending</span>
            </Link>
            <Link 
              to="/room-availability" 
              className="text-darkBrown-500 hover:text-brown-600 transition-colors font-medium flex items-center space-x-1"
            >
              <Calendar className="h-4 w-4" />
              <span>Room Availability</span>
            </Link>
            {isAuthenticated && (
              <Link 
                to="/booking" 
                className="btn-primary text-sm"
              >
                Book Room
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-2 text-darkBrown-500 hover:text-brown-600 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user?.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-darkBrown-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-darkBrown-500 hover:text-brown-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            <Link 
              to="/book-lending" 
              className="text-darkBrown-500 hover:text-brown-600 transition-colors font-medium flex items-center space-x-2 py-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Book Lending Info</span>
            </Link>
            <Link 
              to="/room-availability" 
              className="text-darkBrown-500 hover:text-brown-600 transition-colors font-medium flex items-center space-x-2 py-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Check Availability</span>
            </Link>
            {isAuthenticated && (
              <Link 
                to="/booking" 
                className="btn-primary text-sm inline-flex items-center justify-center py-2"
              >
                Book Room
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
