import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';
import './App.css';

// import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// import pages
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import BookLendingPage from './pages/BookLendingPage';
import RoomAvailabilityPage from './pages/RoomAvailabilityPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BookingSystemTestPage from './pages/BookingSystemTestPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/booking" element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            } />
            <Route path="/book-lending" element={<BookLendingPage />} />
            <Route path="/room-availability" element={<RoomAvailabilityPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/test" element={<BookingSystemTestPage />} />
            {/* เพิ่ม route อื่นๆ ตามต้องการ */}
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#F5F2E8',
            color: '#3C2415',
            border: '1px solid #8B4513',
          },
        }}
      />
    </Router>
  );
}

export default App;
