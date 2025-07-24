import React from 'react';
import { BookOpen, Clock, CreditCard, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookLendingPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <BookOpen className="h-16 w-16 mx-auto text-brown-500 mb-6" />
          <h1 className="section-title">Book Lending System</h1>
          <p className="text-lg text-brown-600 max-w-2xl mx-auto">
            Discover our extensive collection and learn how our in-café lending system works.
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-gold-100 border border-gold-300 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-gold-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-darkBrown-500 mb-2">In-Café Lending Only</h3>
              <p className="text-brown-600">
                All books must remain within the café premises. No overnight lending or take-home options available.
              </p>
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="card p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Clock className="h-6 w-6 text-brown-500" />
            <h2 className="text-2xl font-display font-semibold text-darkBrown-500">Operating Hours</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Book Borrowing</h4>
              <p className="text-green-700">8:00 AM - 6:00 PM</p>
              <p className="text-sm text-green-600 mt-1">Request books during these hours</p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">Return Deadline</h4>
              <p className="text-red-700">Before 7:00 PM</p>
              <p className="text-sm text-red-600 mt-1">All books must be returned by this time</p>
            </div>
          </div>
        </div>

        {/* Card System */}
        <div className="card p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <CreditCard className="h-6 w-6 text-brown-500" />
            <h2 className="text-2xl font-display font-semibold text-darkBrown-500">Card System</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-lg p-4 mb-4">
                <CreditCard className="h-8 w-8 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-semibold text-darkBrown-500 mb-2">Entry Card</h4>
              <p className="text-brown-600 text-sm">
                Exchange your National ID for an Entry Card to access the café
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-lg p-4 mb-4">
                <BookOpen className="h-8 w-8 text-green-600 mx-auto" />
              </div>
              <h4 className="font-semibold text-darkBrown-500 mb-2">Book Lending Card</h4>
              <p className="text-brown-600 text-sm">
                Separate card for borrowing books within the café premises
              </p>
            </div>

            <div className="text-center">
              <div className="bg-brown-100 rounded-lg p-4 mb-4">
                <Users className="h-8 w-8 text-brown-600 mx-auto" />
              </div>
              <h4 className="font-semibold text-darkBrown-500 mb-2">Membership Card</h4>
              <p className="text-brown-600 text-sm">
                Digital membership for room booking and member benefits
              </p>
            </div>
          </div>
        </div>

        {/* Process Flow */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-display font-semibold text-darkBrown-500 mb-6">How It Works</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-brown-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-darkBrown-500">Exchange National ID</h4>
                <p className="text-brown-600">Present your National ID at the entrance to receive an Entry Card</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-brown-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-darkBrown-500">Visit the Trigger Zone</h4>
                <p className="text-brown-600">Go to the designated area to request a Book Lending Card from our staff</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-brown-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-darkBrown-500">Book Registration</h4>
                <p className="text-brown-600">Staff will record your lending information and provide you with the book</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-brown-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-darkBrown-500">Enjoy Reading</h4>
                <p className="text-brown-600">Use the book within the café premises only - no take-home allowed</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-brown-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                5
              </div>
              <div>
                <h4 className="font-semibold text-darkBrown-500">Return Everything</h4>
                <p className="text-brown-600">Return both the book and Book Lending Card before 7:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rules and Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold text-darkBrown-500">Do's</h3>
            </div>
            <ul className="space-y-2 text-brown-600">
              <li>• Handle books with care</li>
              <li>• Return books by 7:00 PM</li>
              <li>• Keep books within café premises</li>
              <li>• Report any damage immediately</li>
              <li>• Respect other readers' quiet time</li>
            </ul>
          </div>

          <div className="card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-semibold text-darkBrown-500">Don'ts</h3>
            </div>
            <ul className="space-y-2 text-brown-600">
              <li>• Don't take books outside the café</li>
              <li>• Don't eat or drink near books</li>
              <li>• Don't write or mark in books</li>
              <li>• Don't bend or fold pages</li>
              <li>• Don't share your lending card</li>
            </ul>
          </div>
        </div>

        {/* Collection Highlights */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-display font-semibold text-darkBrown-500 mb-6">Our Collection</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-brown-100 rounded-lg p-4 mb-2">
                <BookOpen className="h-6 w-6 text-brown-600 mx-auto" />
              </div>
              <h4 className="font-medium text-darkBrown-500">Literature</h4>
              <p className="text-sm text-brown-600">Classic & Modern</p>
            </div>
            <div className="text-center">
              <div className="bg-brown-100 rounded-lg p-4 mb-2">
                <BookOpen className="h-6 w-6 text-brown-600 mx-auto" />
              </div>
              <h4 className="font-medium text-darkBrown-500">Academic</h4>
              <p className="text-sm text-brown-600">Study Materials</p>
            </div>
            <div className="text-center">
              <div className="bg-brown-100 rounded-lg p-4 mb-2">
                <BookOpen className="h-6 w-6 text-brown-600 mx-auto" />
              </div>
              <h4 className="font-medium text-darkBrown-500">Self-Help</h4>
              <p className="text-sm text-brown-600">Personal Growth</p>
            </div>
            <div className="text-center">
              <div className="bg-brown-100 rounded-lg p-4 mb-2">
                <BookOpen className="h-6 w-6 text-brown-600 mx-auto" />
              </div>
              <h4 className="font-medium text-darkBrown-500">Magazines</h4>
              <p className="text-sm text-brown-600">Current Issues</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-darkBrown-500 mb-4">
            Ready to Start Reading?
          </h3>
          <p className="text-brown-600 mb-6">
            Visit us today and explore our extensive collection of books and resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/room-availability" className="btn-primary">
              Check Room Availability
            </Link>
            <Link to="/" className="btn-outline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookLendingPage;
