import React, { useState, useEffect } from 'react';
import trainService from '../services/trainService';
import bookingService from '../services/bookingService';
import Spinner from '../components/Spinner';
import { 
  Train, 
  Ticket, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Trash2, 
  Plus, 
  ListOrdered,
  XCircle,
  FileText,
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const [trains, setTrains] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('trains'); // trains, bookings, users
  const [cancellingId, setCancellingId] = useState(null);

  // Mock Users Registry
  const mockUsers = [
    { id: 1, name: 'John Passenger', email: 'passenger@railway.com', role: 'user', created: '2026-06-12' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'user', created: '2026-07-02' },
    { id: 99, name: 'Admin Officer', email: 'admin@railway.com', role: 'admin', created: '2026-01-01' }
  ];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [trainsRes, bookingsRes] = await Promise.all([
        trainService.getAllTrains(),
        bookingService.getBookings()
      ]);

      if (trainsRes.success) setTrains(trainsRes.trains);
      if (bookingsRes.success) setBookings(bookingsRes.bookings);
    } catch (err) {
      console.error('[ADMIN DASHBOARD] Data fetch error:', err);
      setError('Failed to fetch administrative metrics from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCancelBooking = async (id, pnr) => {
    const confirmCancel = window.confirm(`Admin Action: Are you sure you want to cancel booking PNR: ${pnr}?`);
    if (!confirmCancel) return;

    setCancellingId(id);
    try {
      const response = await bookingService.cancelBooking(id);
      if (response.success) {
        setBookings(prev => 
          prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b)
        );
        alert(`Booking PNR ${pnr} has been successfully cancelled.`);
      } else {
        alert(response.message || 'Failed to cancel reservation.');
      }
    } catch (err) {
      console.error('[ADMIN CANCEL] API Error:', err);
      alert('Error occurred while cancels booking.');
    } finally {
      setCancellingId(null);
    }
  };

  // Derive stats dynamically from API responses
  const totalTrains = trains.length;
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
  const waitingBookings = bookings.filter(b => b.status === 'Waiting').length;
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled').length;

  if (loading) {
    return <Spinner message="Assembling control tower metrics..." />;
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto py-12 px-4 text-center space-y-4">
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200">
          <h3 className="font-bold text-lg mb-2">Metrics Fetch Failed</h3>
          <p className="text-sm font-medium">{error}</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        
        {/* Total Trains */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <Train className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase block tracking-wider">Total Trains</span>
            <span className="text-2xl font-extrabold text-slate-900">{totalTrains}</span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
            <Ticket className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase block tracking-wider">All Bookings</span>
            <span className="text-2xl font-extrabold text-slate-900">{totalBookings}</span>
          </div>
        </div>

        {/* Confirmed Tickets */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase block tracking-wider">Confirmed</span>
            <span className="text-2xl font-extrabold text-slate-900">{confirmedBookings}</span>
          </div>
        </div>

        {/* Waiting Tickets */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase block tracking-wider">Waiting List</span>
            <span className="text-2xl font-extrabold text-slate-900">{waitingBookings}</span>
          </div>
        </div>

        {/* Cancelled Tickets */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-700 rounded-xl">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase block tracking-wider">Cancelled</span>
            <span className="text-2xl font-extrabold text-slate-900">{cancelledBookings}</span>
          </div>
        </div>

      </div>

      {/* Control Tabs */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-1.5 flex gap-1 shadow-sm max-w-md">
        <button
          onClick={() => setActiveTab('trains')}
          className={`flex-1 py-2 px-4 text-xs font-bold rounded-xl tracking-wider uppercase transition-all cursor-pointer ${
            activeTab === 'trains'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          Manage Trains ({trains.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex-1 py-2 px-4 text-xs font-bold rounded-xl tracking-wider uppercase transition-all cursor-pointer ${
            activeTab === 'bookings'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2 px-4 text-xs font-bold rounded-xl tracking-wider uppercase transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          Users ({mockUsers.length})
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Manage Trains Tab */}
        {activeTab === 'trains' && (
          <div>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Train Catalog Registry</h3>
                <p className="text-xs text-slate-400 font-semibold">List of active routes and catalog inventory registered in SwiftRail database.</p>
              </div>
              <button 
                onClick={() => alert('New Train Catalog Wizard (Placeholder)')}
                className="px-4 py-2 bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-blue-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Train
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs font-bold text-slate-400 uppercase border-b border-slate-100">
                    <th className="p-4 pl-6">Train Info</th>
                    <th className="p-4">Route Details</th>
                    <th className="p-4">Departure & Arrival</th>
                    <th className="p-4">Available Seats</th>
                    <th className="p-4">Fare</th>
                    <th className="p-4 pr-6 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {trains.map((train) => (
                    <tr key={train.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="p-4 pl-6">
                        <span className="font-bold text-slate-900 block">{train.name}</span>
                        <span className="text-xs text-slate-400 font-semibold">Code: #{train.number}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-slate-400 font-semibold block uppercase">Path</span>
                        <span>{train.source.split(' ')[0]} ➔ {train.destination.split(' ')[0]}</span>
                      </td>
                      <td className="p-4">
                        <span>{train.departure} - {train.arrival}</span>
                        <span className="text-xs text-slate-400 block font-semibold">({train.duration})</span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded">
                          {train.availableSeats} Seats
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900">₹{train.fare}</td>
                      <td className="p-4 pr-6 text-right">
                        <button 
                          onClick={() => alert(`Edit train: ${train.name} (Placeholder)`)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-bold mr-3 cursor-pointer"
                        >
                          Modify
                        </button>
                        <button 
                          onClick={() => alert(`Remove train: ${train.name} (Placeholder)`)}
                          className="text-xs text-red-500 hover:text-red-700 font-bold cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Manage Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">Passenger Reservation History</h3>
              <p className="text-xs text-slate-400 font-semibold">Monitor and cancel passenger tickets or override allocation statuses.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs font-bold text-slate-400 uppercase border-b border-slate-100">
                    <th className="p-4 pl-6">PNR / ID</th>
                    <th className="p-4">Passenger Info</th>
                    <th className="p-4">Train & Travel Details</th>
                    <th className="p-4">Berth / Fare</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className={`hover:bg-slate-50/40 transition-colors ${booking.status === 'Cancelled' ? 'opacity-60' : ''}`}>
                      <td className="p-4 pl-6">
                        <span className="font-mono font-bold text-slate-900 block">{booking.pnr}</span>
                        <span className="text-xs text-slate-400 font-semibold">System ID: {booking.id}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{booking.passengerName}</span>
                        <span className="text-xs text-slate-500">Age: {booking.passengerAge} | Gender: {booking.passengerGender}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold block text-slate-800">{booking.trainName}</span>
                        <span className="text-xs text-slate-500 block">Date: {booking.journeyDate}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-slate-400 font-semibold block uppercase">Berth</span>
                        <span className="font-bold text-slate-800">{booking.seatNumber}</span>
                        <span className="text-xs text-slate-400 block font-semibold">Fare: ₹{booking.fare}</span>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                          booking.status === 'Confirmed' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                            : booking.status === 'Waiting'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                            : 'bg-red-500/10 text-red-400 border-red-500/25'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {booking.status !== 'Cancelled' ? (
                          <button 
                            onClick={() => handleCancelBooking(booking.id, booking.pnr)}
                            disabled={cancellingId === booking.id}
                            className="text-xs text-red-500 hover:text-red-700 font-bold border border-red-100 hover:bg-red-50 py-1.5 px-3 rounded-lg transition-colors cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
                          >
                            Cancel Ticket
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-semibold">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Manage Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">System Users Accounts</h3>
              <p className="text-xs text-slate-400 font-semibold">Verify active traveler profiles, roles, and registration audit-trails.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs font-bold text-slate-400 uppercase border-b border-slate-100">
                    <th className="p-4 pl-6">User ID</th>
                    <th className="p-4">Full Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Permission Role</th>
                    <th className="p-4 pr-6 text-right font-semibold">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {mockUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="p-4 pl-6 font-mono text-xs text-slate-500">{u.id}</td>
                      <td className="p-4 font-bold text-slate-900">{u.name}</td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                          u.role === 'admin' 
                            ? 'bg-amber-100 text-amber-800 border-amber-200' 
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right text-xs text-slate-400 font-semibold">{u.created}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default AdminDashboard;
