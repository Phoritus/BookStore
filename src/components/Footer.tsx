import React from 'react';
import { Coffee, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-darkBrown-500 text-cream-50 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Coffee className="h-6 w-6 text-brown-300" />
            <span className="text-xl font-display font-semibold">Book Café</span>
          </div>
          <p className="text-brown-300 mb-2">
            Where literature meets comfort
          </p>
          <p className="text-sm text-brown-400 flex items-center justify-center space-x-1">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-400" />
            <span>for book lovers</span>
          </p>
          <p className="text-xs text-brown-400 mt-2">
            © 2025 Book Café. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;