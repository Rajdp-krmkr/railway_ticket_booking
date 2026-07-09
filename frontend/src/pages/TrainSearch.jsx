import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import trainService from '../services/trainService';
import Spinner from '../components/Spinner';
import { Search, MapPin, Calendar, Train, ArrowRight } from 'lucide-react';

const TrainSearch = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    date: ''
  });
  
  const [allTrains, setAllTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all trains to display as a browseable list below the search
  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const data = await trainService.getAllTrains();
        if (data.success) {
          setAllTrains(data.trains);
        } else {
          setError('Failed to load train listings.');
        }
      } catch (err) {
        console.error('[TRAIN SEARCH] Fetch error:', err);
        setError('Error connecting to the API server.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrains();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchParams.source || !searchParams.destination) {
      alert('Please enter both source and destination.');
      return;
    }
    const query = new URLSearchParams(searchParams).toString();
    navigate(`/results?${query}`);
  };

  const handleTrainClick = (train) => {
    const today = new Date().toISOString().split('T')[0];
    navigate(`/results?source=${encodeURIComponent(train.source)}&destination=${encodeURIComponent(train.destination)}&date=${today}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in">
      {/* Search Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Train Schedule Explorer</h1>
        <p className="text-slate-500 text-base max-w-xl mx-auto">
          Query nationwide services, check live seat quotas, ticket pricing, and booking timelines.
        </p>
      </div>

      {/* Main Search Panel */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/80 max-w-4xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          {/* Source input */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Origin (Source)</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="text"
                name="source"
                value={searchParams.source}
                onChange={handleInputChange}
                placeholder="e.g. New Delhi"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                required
              />
            </div>
          </div>

          {/* Destination input */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="text"
                name="destination"
                value={searchParams.destination}
                onChange={handleInputChange}
                placeholder="e.g. Mumbai"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                required
              />
            </div>
          </div>

          {/* Date Selector */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Departure Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="date"
                name="date"
                value={searchParams.date}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                required
              />
            </div>
          </div>

          {/* Submit Search Button */}
          <div className="md:col-span-1">
            <button
              type="submit"
              className="w-full py-3 bg-blue-700 text-white rounded-xl flex items-center justify-center hover:bg-blue-800 hover:shadow-md transition-all cursor-pointer"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Directory Browse Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Browse Available Train Services</h2>

        {loading ? (
          <Spinner message="Fetching train schedules..." />
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200/50 text-center font-medium">
            {error}
          </div>
        ) : allTrains.length === 0 ? (
          <div className="bg-slate-50 text-slate-500 p-8 rounded-xl border border-slate-200 border-dashed text-center">
            No trains registered in system directory.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTrains.map((train) => (
              <div 
                key={train.id}
                onClick={() => handleTrainClick(train)}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Train className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 truncate group-hover:text-blue-700 transition-colors">
                        {train.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-semibold">Train #{train.number}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-11 items-center gap-1">
                    <div className="col-span-5">
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">From</p>
                      <p className="text-sm font-bold text-slate-700 truncate">{train.source.split(' ')[0]}</p>
                      <p className="text-xs text-slate-500">{train.departure}</p>
                    </div>
                    <div className="col-span-1 flex items-center justify-center text-slate-300">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <div className="col-span-5 text-right">
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">To</p>
                      <p className="text-sm font-bold text-slate-700 truncate">{train.destination.split(' ')[0]}</p>
                      <p className="text-xs text-slate-500">{train.arrival}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Runs: {train.runsOn.slice(0, 3).join(', ')}...
                  </span>
                  <span className="text-sm font-extrabold text-blue-700">₹{train.fare}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainSearch;
