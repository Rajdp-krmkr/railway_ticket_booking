import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Ticket, Printer, Calendar, User, Compass, CreditCard, ChevronRight } from 'lucide-react';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract booking details passed from passenger details submit
  const booking = location.state?.booking;

  const handlePrint = () => {
    window.print();
  };

  // Safe fallback if booking object isn't present
  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-5 animate-fade-in">
        <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl">
          <Ticket className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No Booking Data Available</h3>
          <p className="text-slate-500 text-sm mt-1">
            We couldn't verify any recent successful reservations.
          </p>
        </div>
        <button
          onClick={() => navigate('/search')}
          className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer"
        >
          Browse Train Schedules
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 print:py-0 print:px-0 animate-fade-in">
      
      {/* Confirmation Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-4 print:border-none print:shadow-none">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Reservation Confirmed!</h1>
          <p className="text-slate-500 text-sm font-medium">
            Your payment has been processed and your berth has been allocated successfully.
          </p>
        </div>
        
        {/* PNR Info Box */}
        <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl max-w-sm mx-auto flex items-center justify-between text-left print:bg-white print:border">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Booking PNR</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono tracking-wide">{booking.pnr}</span>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full uppercase">
            {booking.status}
          </span>
        </div>
      </div>

      {/* Ticket Breakdown Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm print:border print:shadow-none">
        {/* Ticket Header Banner */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ticket Invoice</span>
            <h3 className="font-extrabold text-lg leading-tight">{booking.trainName}</h3>
          </div>
          <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/25 px-2.5 py-1 rounded">
            Train Number: {booking.trainNumber}
          </span>
        </div>

        {/* Ticket Grid Info */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Passenger Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <User className="h-4 w-4 text-slate-400" />
                <span>Passenger Identity</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-slate-800">{booking.passengerName}</p>
                <p className="text-xs text-slate-500 font-medium">Age: {booking.passengerAge} | Gender: {booking.passengerGender}</p>
                <p className="text-xs text-slate-500 font-medium">Phone: {booking.passengerPhone}</p>
              </div>
            </div>

            {/* Travel Route */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Compass className="h-4 w-4 text-slate-400" />
                <span>Route Details</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-slate-800">{booking.source.split(' ')[0]} to {booking.destination.split(' ')[0]}</p>
                <p className="text-xs text-slate-500 font-medium">Departs: {booking.source}</p>
                <p className="text-xs text-slate-500 font-medium">Arrives: {booking.destination}</p>
              </div>
            </div>

            {/* Allocation Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>Allocation details</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-slate-800">Berth: {booking.seatNumber}</p>
                <p className="text-xs text-slate-500 font-medium">Date: {booking.journeyDate}</p>
                <p className="text-xs text-slate-500 font-medium">Class: Standard AC Berth</p>
              </div>
            </div>

          </div>

          <hr className="border-slate-100" />

          {/* Pricing detail */}
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl print:bg-white print:border">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fare Transaction Complete</span>
            </div>
            <span className="text-xl font-extrabold text-slate-900">₹{booking.fare}</span>
          </div>
        </div>
      </div>

      {/* Button Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-sm font-semibold transition-all cursor-pointer"
        >
          <Printer className="h-4.5 w-4.5" />
          Print Ticket Receipt
        </button>

        <div className="flex items-center gap-3">
          <Link
            to="/my-bookings"
            className="px-5 py-2.5 text-slate-600 hover:text-slate-800 text-sm font-semibold transition-colors"
          >
            My Bookings
          </Link>
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-700 text-white hover:bg-blue-800 hover:shadow-md rounded-xl text-sm font-semibold transition-all"
          >
            Book Another Ticket
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};

export default BookingSuccess;
