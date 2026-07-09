import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import trainService from '../services/trainService';
import Spinner from '../components/Spinner';
import { ArrowLeft, Clock, Search, Train, ArrowUpDown, ChevronRight, Ban, Users } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const source = searchParams.get('source') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';

  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('fare-low'); // fare-low, fare-high, duration-short

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await trainService.searchTrains(source, destination, date);
        if (data.success) {
          setTrains(data.trains);
        } else {
          setError('Failed to fetch search results.');
        }
      } catch (err) {
        console.error('[SEARCH RESULTS] Query error:', err);
        setError('Could not connect to server. Ensure your backend is running.');
      } finally {
        setLoading(false);
      }
    };

    if (source && destination) {
      fetchSearchResults();
    } else {
      setLoading(false);
    }
  }, [source, destination, date]);

  // Sort logic
  const sortedTrains = [...trains].sort((a, b) => {
    if (sortBy === 'fare-low') return a.fare - b.fare;
    if (sortBy === 'fare-high') return b.fare - a.fare;
    
    if (sortBy === 'duration-short') {
      const getMin = (durationStr) => {
        const matches = durationStr.match(/(\d+)h\s*(\d+)m/);
        if (matches) {
          return parseInt(matches[1]) * 60 + parseInt(matches[2]);
        }
        return 9999;
      };
      return getMin(a.duration) - getMin(b.duration);
    }
    return 0;
  });

  const handleBookNow = (trainId) => {
    navigate(`/book/${trainId}?date=${encodeURIComponent(date)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Return link */}
      <div>
        <button
          onClick={() => navigate('/search')}
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-700 transition-colors gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </button>
      </div>

      {/* Query Header and Filter Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">Search Results</span>
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            <span className="text-sm font-bold text-blue-700">{trains.length} Trains Found</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center flex-wrap gap-2">
            <span>{source || 'Any Station'}</span>
            <ChevronRight className="h-5 w-5 text-slate-300" />
            <span>{destination || 'Any Station'}</span>
          </h1>
          {date && (
            <p className="text-xs font-bold text-slate-500 bg-slate-100 py-1 px-2.5 rounded-md inline-block">
              📅 Journey Date: {date}
            </p>
          )}
        </div>

        {/* Sort dropdown */}
        {trains.length > 0 && (
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <ArrowUpDown className="h-4.5 w-4.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="fare-low">Lowest Fare First</option>
              <option value="fare-high">Highest Fare First</option>
              <option value="duration-short">Shortest Travel Duration</option>
            </select>
          </div>
        )}
      </div>

      {/* Results Listing */}
      {loading ? (
        <Spinner message="Searching for train availability..." />
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200/50 text-center font-medium max-w-lg mx-auto">
          {error}
        </div>
      ) : sortedTrains.length === 0 ? (
        /* Empty State */
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center max-w-xl mx-auto space-y-6">
          <div className="mx-auto w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
            <Ban className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-800">No Services Available</h2>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              We couldn't locate any direct trains matching the selected route or timings. Try adjusting your stations or looking for connections.
            </p>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="px-5 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm cursor-pointer"
          >
            Adjust Search
          </button>
        </div>
      ) : (
        /* Cards List */
        <div className="space-y-6">
          {sortedTrains.map((train) => (
            <div
              key={train.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Train Header Info */}
                <div className="lg:col-span-4 space-y-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                      <Train className="h-5.5 w-5.5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-lg leading-tight">{train.name}</h3>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        Train #{train.number}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold pl-1.5">
                    <span>Runs on:</span>
                    <span className="text-slate-700">{train.runsOn.join(', ')}</span>
                  </div>
                </div>

                {/* Journey Times and Duration */}
                <div className="lg:col-span-4 grid grid-cols-11 items-center gap-1.5 text-center">
                  <div className="col-span-4 space-y-1">
                    <p className="text-xl font-extrabold text-slate-800 leading-none">{train.departure}</p>
                    <p className="text-xs font-bold text-slate-400 truncate uppercase tracking-wider">{train.source.split(' ')[0]}</p>
                  </div>
                  
                  <div className="col-span-3 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full mb-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {train.duration}
                    </span>
                    <div className="w-full flex items-center">
                      <div className="h-1 w-full bg-slate-200 relative">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-400 absolute left-0 -top-0.25" />
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-400 absolute right-0 -top-0.25" />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-4 space-y-1">
                    <p className="text-xl font-extrabold text-slate-800 leading-none">{train.arrival}</p>
                    <p className="text-xs font-bold text-slate-400 truncate uppercase tracking-wider">{train.destination.split(' ')[0]}</p>
                  </div>
                </div>

                {/* Quota & Seats Availability Info */}
                <div className="lg:col-span-2 flex flex-col sm:flex-row lg:flex-col items-start lg:items-center justify-between lg:justify-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    <Users className="h-3.5 w-3.5" />
                    <span>{train.availableSeats} Seats Available</span>
                  </div>
                  <div className="text-xs text-slate-500 font-semibold">
                    Class: <span className="text-slate-800">{train.classes[0]}</span>
                  </div>
                </div>

                {/* Pricing & Booking Button */}
                <div className="lg:col-span-2 flex sm:flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 lg:border-l border-slate-100 lg:pl-6">
                  <div className="text-left lg:text-center">
                    <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Fare Price</span>
                    <span className="text-2xl font-extrabold text-slate-900">₹{train.fare}</span>
                  </div>
                  <button
                    onClick={() => handleBookNow(train.id)}
                    className="px-5 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
                  >
                    Book Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
