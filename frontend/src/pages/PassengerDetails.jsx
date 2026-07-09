import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import trainService from '../services/trainService';
import bookingService from '../services/bookingService';
import Spinner from '../components/Spinner';
import { User, Calendar, Phone, ArrowLeft, ShieldAlert, Award, Compass, Train } from 'lucide-react';

const PassengerDetails = () => {
  const { trainId } = useParams();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date') || '';
  
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Booking Form State
  const [formData, setFormData] = useState({
    passengerName: user?.name || '',
    passengerAge: '',
    passengerGender: 'Male',
    passengerPhone: '',
    journeyDate: dateParam || new Date().toISOString().split('T')[0]
  });

  // Prefill user details if user context changes
  useEffect(() => {
    if (user?.name) {
      setFormData(prev => ({ ...prev, passengerName: user.name }));
    }
  }, [user]);

  // Fetch target train details
  useEffect(() => {
    const fetchTrainInfo = async () => {
      try {
        const data = await trainService.getTrainById(trainId);
        if (data.success) {
          setTrain(data.train);
        } else {
          setError('Train details not found.');
        }
      } catch (err) {
        console.error('[BOOKING PAGE] Fetch train details error:', err);
        setError('Error fetching train information.');
      } finally {
        setLoading(false);
      }
    };

    if (trainId) {
      fetchTrainInfo();
    }
  }, [trainId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('You must be signed in to perform reservations.');
      navigate('/login');
      return;
    }

    if (!formData.passengerName || !formData.passengerAge || !formData.passengerPhone || !formData.journeyDate) {
      alert('Please fill out all fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        trainId,
        ...formData
      };
      
      const response = await bookingService.createBooking(payload);
      
      if (response.success) {
        // Navigate to booking success page with target booking details
        navigate('/booking-success', { state: { booking: response.booking } });
      } else {
        alert(response.message || 'Error occurred during reservation.');
      }
    } catch (err) {
      console.error('[BOOKING SUBMISSION] API Error:', err);
      alert(err.response?.data?.message || 'Error completing booking. Check server logs.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner message="Fetching ticket details..." />;
  }

  if (error || !train) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-4">
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200">
          <h3 className="font-bold text-lg mb-2">Error Locating Route</h3>
          <p className="text-sm font-medium">{error || 'Train parameters are invalid.'}</p>
        </div>
        <button
          onClick={() => navigate('/search')}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
        >
          Return to search
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Return route link */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-700 transition-colors gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Booking Form Area */}
        <div className="lg:col-span-8 space-y-6">
          {!isAuthenticated ? (
            /* Auth Alert Overlay */
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-8 space-y-6 text-center shadow-sm">
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-800">Authentication Required</h3>
                <p className="text-slate-600 text-sm max-w-sm mx-auto">
                  You need to be registered and signed in to reserve ticket berths and seats. Log in or create an account to proceed.
                </p>
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-300 transition-colors cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </div>
          ) : (
            /* Passenger Form */
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Passenger Reservation Details</h2>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Fill in travel details below. Verify passenger details to prevent incorrect booking records.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <input 
                        type="text"
                        name="passengerName"
                        value={formData.passengerName}
                        onChange={handleInputChange}
                        placeholder="John Passenger"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <input 
                        type="tel"
                        name="passengerPhone"
                        value={formData.passengerPhone}
                        onChange={handleInputChange}
                        placeholder="9876543210"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Age input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Age</label>
                    <input 
                      type="number"
                      name="passengerAge"
                      value={formData.passengerAge}
                      onChange={handleInputChange}
                      placeholder="e.g. 30"
                      min="1"
                      max="120"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                      required
                    />
                  </div>

                  {/* Gender Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Gender</label>
                    <select
                      name="passengerGender"
                      value={formData.passengerGender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Journey Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Travel Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <input 
                        type="date"
                        name="journeyDate"
                        value={formData.journeyDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Creating Reservation...' : 'Book Ticket'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Selected Train Breakdown Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-400">Reservation Ticket</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/25">
                  <Train className="h-5.5 w-5.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base leading-tight">{train.name}</h4>
                  <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded mt-1.5 inline-block">
                    Train #{train.number}
                  </span>
                </div>
              </div>

              <hr className="border-slate-800" />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-400 font-semibold block uppercase">Origin</span>
                  <span className="font-bold text-slate-200">{train.source.split(' ')[0]}</span>
                  <span className="text-xs text-slate-400 block mt-0.5">{train.departure}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-semibold block uppercase">Destination</span>
                  <span className="font-bold text-slate-200">{train.destination.split(' ')[0]}</span>
                  <span className="text-xs text-slate-400 block mt-0.5">{train.arrival}</span>
                </div>
              </div>

              <hr className="border-slate-800" />

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-400">Class Quota:</span>
                  <span className="text-slate-200">{train.classes[0]}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-400">Base Fare:</span>
                  <span className="text-slate-200">₹{train.fare}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-400">Tax & Fees:</span>
                  <span className="text-emerald-400">Free/Included</span>
                </div>
              </div>

              <hr className="border-slate-800" />

              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Charge</span>
                <span className="text-2xl font-extrabold text-white">₹{train.fare}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetails;
