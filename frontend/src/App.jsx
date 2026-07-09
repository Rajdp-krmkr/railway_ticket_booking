import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Components & Guards
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

// Pages
import Home from './pages/Home';
import TrainSearch from './pages/TrainSearch';
import SearchResults from './pages/SearchResults';
import PassengerDetails from './pages/PassengerDetails';
import BookingSuccess from './pages/BookingSuccess';
import MyTickets from './pages/MyTickets';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Pages wrapped in MainLayout */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/search" element={<MainLayout><TrainSearch /></MainLayout>} />
          <Route path="/results" element={<MainLayout><SearchResults /></MainLayout>} />
          <Route path="/book/:trainId" element={<MainLayout><PassengerDetails /></MainLayout>} />
          <Route path="/booking-success" element={<MainLayout><BookingSuccess /></MainLayout>} />
          <Route path="/my-bookings" element={<MainLayout><MyTickets /></MainLayout>} />
          <Route path="/about" element={<MainLayout><About /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
          <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
          <Route path="/register" element={<MainLayout><Register /></MainLayout>} />

          {/* Protected Admin Routes wrapped in AdminLayout */}
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedAdminRoute>
            } 
          />

          {/* 404 Page */}
          <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
