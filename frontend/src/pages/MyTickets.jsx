import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/bookingService';
import Spinner from '../components/Spinner';
import { Ticket, Calendar, User, Compass, Ban, HelpCircle, XCircle, Search } from 'lucide-react';

const MyTickets = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getBookings();
      if (data.success) {
        setBookings(data.bookings);
      } else {
        setError('Failed to fetch your bookings.');
      }
    } catch (err) {
      console.error('[MY BOOKINGS] Fetch error:', err);
      setError('Error connecting to the API server. Make sure the backend is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleCancelBooking = async (id, pnr) => {
    const confirmCancel = window.confirm(`Are you sure you want to cancel booking ticket PNR: ${pnr}?`);
    if (!confirmCancel) return;

    setCancellingId(id);
    try {
      const response = await bookingService.cancelBooking(id);
      if (response.success) {
        // Update booking status in state array to Cancelled
        setBookings(prev => 
          prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b)
        );
        alert(`Booking with PNR ${pnr} has been successfully cancelled.`);
      } else {
        alert(response.message || 'Failed to cancel the booking.');
      }
    } catch (err) {
      console.error('[CANCEL BOOKING] API Error:', err);
      alert('An error occurred while attempting to cancel your reservation.');
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6 animate-fade-in">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <Ticket className="h-12 w-12 text-slate-300 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Sign In to View Tickets</h2>
          <p className="text-slate-500 text-sm">
            Please log in to your account to review booking history, check PNR allocations, or cancel scheduled tickets.
          </p>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm cursor-pointer"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-fade-in">
      
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Booked Tickets</h1>
        <p className="text-slate-500 text-sm">
          Review your upcoming rail journeys, seat configurations, and ticket statuses.
        </p>
      </div>

      {loading ? (
        <Spinner message="Retrieving your reservation history..." />
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200/50 text-center font-medium max-w-lg mx-auto">
          {error}
        </div>
      ) : bookings.length === 0 ? (
        /* Empty State */
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center max-w-xl mx-auto space-y-5">
          <div className="mx-auto w-14 h-14 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center border border-slate-100">
            <Ticket className="h-6 w-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-800">No Reservations Found</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              You haven't reserved any train seats or cabins yet. Check out schedules to book your next trip.
            </p>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="px-5 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm cursor-pointer"
          >
            Find Trains
          </button>
        </div>
      ) : (
        /* Bookings List */
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div 
              key={booking.id}
              className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all ${
                booking.status === 'Cancelled' ? 'opacity-70' : ''
              }`}
            >
              {/* Card Banner */}
              <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PNR: {booking.pnr}</span>
                  <h3 className="font-extrabold text-base leading-tight">{booking.trainName}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-300">Train #{booking.trainNumber}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                    booking.status === 'Confirmed' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                      : booking.status === 'Waiting'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                      : 'bg-red-500/10 text-red-400 border-red-500/25'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>

              {/* Grid content */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                {/* Passenger Info */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <User className="h-3.5 w-3.5" />
                    <span>Passenger</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{booking.passengerName}</h4>
                    <p className="text-xs text-slate-500">Age: {booking.passengerAge} | {booking.passengerGender}</p>
                    <p className="text-xs text-slate-500">Phone: {booking.passengerPhone}</p>
                  </div>
                </div>

                {/* Route Info */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Compass className="h-3.5 w-3.5" />
                    <span>Travel Route</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{booking.source.split(' ')[0]} to {booking.destination.split(' ')[0]}</h4>
                    <p className="text-xs text-slate-500 truncate" title={booking.source}>From: {booking.source}</p>
                    <p className="text-xs text-slate-500 truncate" title={booking.destination}>To: {booking.destination}</p>
                  </div>
                </div>

                {/* Date & Seat */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Departure</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{booking.journeyDate}</h4>
                    <p className="text-xs text-slate-500">Berth: <span className="font-semibold text-slate-700">{booking.seatNumber}</span></p>
                    <p className="text-xs text-slate-500">Fare: ₹{booking.fare}</p>
                  </div>
                </div>

                {/* Cancel action */}
                <div className="flex justify-start md:justify-end">
                  {booking.status !== 'Cancelled' ? (
                    <button
                      onClick={() => handleCancelBooking(booking.id, booking.pnr)}
                      disabled={cancellingId === booking.id}
                      className="px-4.5 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 bg-white border border-red-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
                    >
                      <XCircle className="h-4 w-4" />
                      {cancellingId === booking.id ? 'Processing...' : 'Cancel Booking'}
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100/60 inline-flex items-center gap-1">
                      <Ban className="h-3.5 w-3.5" />
                      Cancelled & Refunded
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MyTickets;
