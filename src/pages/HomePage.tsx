import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Coffee, BookOpen, Calendar, Users, Clock, MapPin } from 'lucide-react';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream-100/90 to-brown-100/90"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <Coffee className="h-16 w-16 mx-auto text-brown-500 mb-6 animate-bounce-subtle" />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-darkBrown-500 mb-6 text-shadow">
              Welcome to Book Café
            </h1>
            <p className="text-xl md:text-2xl text-brown-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Where literature meets comfort. Discover your next great read while enjoying our cozy atmosphere and premium study spaces.
            </p>
            
            {/* Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {!isAuthenticated ? (
                <>
                  <Link to="/register" className="btn-primary text-lg px-8 py-4">
                    Become a Member
                  </Link>
                  <Link to="/login" className="btn-outline text-lg px-8 py-4">
                    Member Login
                  </Link>
                </>
              ) : (
                <Link to="/booking" className="btn-primary text-lg px-8 py-4">
                  Book a Room Now
                </Link>
              )}
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Link 
                to={isAuthenticated ? "/booking" : "/register"}
                className="card p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <Calendar className="h-8 w-8 text-brown-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-darkBrown-500 mb-2">Room Booking</h3>
                <p className="text-brown-600 text-sm">Reserve your perfect study space</p>
              </Link>

              <Link 
                to="/room-availability" 
                className="card p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <MapPin className="h-8 w-8 text-brown-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-darkBrown-500 mb-2">Check Availability</h3>
                <p className="text-brown-600 text-sm">View real-time room status</p>
              </Link>

              <Link 
                to="/book-lending" 
                className="card p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <BookOpen className="h-8 w-8 text-brown-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-darkBrown-500 mb-2">Book Lending</h3>
                <p className="text-brown-600 text-sm">Learn about our lending system</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Why Choose Book Café?</h2>
            <p className="text-lg text-brown-600 max-w-2xl mx-auto">
              Experience the perfect blend of literature, comfort, and productivity in our thoughtfully designed spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-brown-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-brown-600" />
              </div>
              <h3 className="text-xl font-semibold text-darkBrown-500 mb-2">Flexible Spaces</h3>
              <p className="text-brown-600">
                Choose from intimate 5-person rooms or spacious 10-person study areas, perfect for any group size.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-brown-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-brown-600" />
              </div>
              <h3 className="text-xl font-semibold text-darkBrown-500 mb-2">Affordable Rates</h3>
              <p className="text-brown-600">
                Just 50 THB per hour with 15% discount for bookings of 5 hours or more. Great value for premium spaces.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-brown-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-brown-600" />
              </div>
              <h3 className="text-xl font-semibold text-darkBrown-500 mb-2">Extensive Library</h3>
              <p className="text-brown-600">
                Access our curated collection with our convenient in-café lending system. Perfect for research and leisure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Zones Information */}
      <section className="py-20 bg-gradient-to-r from-cream-200 to-brown-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Spaces</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card p-8">
              <h3 className="text-2xl font-display font-semibold text-darkBrown-500 mb-4">Free Zone</h3>
              <ul className="space-y-3 text-brown-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-brown-400 rounded-full mr-3"></span>
                  Walk-in seating available
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-brown-400 rounded-full mr-3"></span>
                  First-come, first-served basis
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-brown-400 rounded-full mr-3"></span>
                  No reservation required
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-brown-400 rounded-full mr-3"></span>
                  Perfect for quick visits
                </li>
              </ul>
            </div>

            <div className="card p-8">
              <h3 className="text-2xl font-display font-semibold text-darkBrown-500 mb-4">Booking Zone</h3>
              <ul className="space-y-3 text-brown-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-brown-400 rounded-full mr-3"></span>
                  4 private rooms available
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-brown-400 rounded-full mr-3"></span>
                  5-person and 10-person capacity
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-brown-400 rounded-full mr-3"></span>
                  Advanced booking required
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-brown-400 rounded-full mr-3"></span>
                  Members only access
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brown-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-brown-100">
            Join our community of book lovers and productivity enthusiasts today.
          </p>
          {!isAuthenticated ? (
            <Link 
              to="/register" 
              className="bg-white text-brown-600 hover:bg-cream-100 font-medium py-4 px-8 rounded-lg transition-all duration-200 text-lg inline-block transform hover:-translate-y-1 hover:shadow-lg"
            >
              Get Started Now
            </Link>
          ) : (
            <Link 
              to="/booking" 
              className="bg-white text-brown-600 hover:bg-cream-100 font-medium py-4 px-8 rounded-lg transition-all duration-200 text-lg inline-block transform hover:-translate-y-1 hover:shadow-lg"
            >
              Book Your Space
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
