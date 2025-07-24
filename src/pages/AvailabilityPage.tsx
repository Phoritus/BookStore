import React from 'react';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

const AvailabilityPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Calendar className="h-12 w-12 mx-auto text-darkBrown-500 mb-4" />
            <h1 className="text-4xl font-display font-bold text-darkBrown-500 mb-4">
              Room Availability
            </h1>
            <p className="text-lg text-brown-600 max-w-2xl mx-auto">
              Check our available rooms and book your perfect space for reading, studying, or meeting friends.
            </p>
          </div>

          {/* Room Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((room) => (
              <div key={room} className="card bg-white/80 backdrop-blur-sm border border-brown-200 hover:shadow-warm transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-cream-100 to-brown-100 rounded-lg mb-4"></div>
                <h3 className="text-xl font-semibold text-darkBrown-500 mb-2">
                  Reading Room {room}
                </h3>
                <div className="space-y-2 text-brown-600">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>2-4 people</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Available 9:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Floor {Math.ceil(room / 2)}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-brown-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-darkBrown-500">
                      ฿50/hour
                    </span>
                    <button className="btn-primary">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPage;
