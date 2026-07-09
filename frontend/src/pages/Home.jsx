import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Compass, ShieldCheck, Ticket, Users, ArrowRight } from 'lucide-react';
import heroImage from '../assets/swiftrail_hero.png';

const Home = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    date: ''
  });

  const popularRoutes = [
    { source: 'New Delhi (NDLS)', destination: 'Mumbai Central (MMCT)', fare: '₹2,450', duration: '15h 40m' },
    { source: 'Pune Junction (PUNE)', destination: 'Mumbai CSMT (CSMT)', fare: '₹350', duration: '03h 10m' },
    { source: 'Howrah Junction (HWH)', destination: 'New Delhi (NDLS)', fare: '₹2,100', duration: '18h 15m' },
    { source: 'New Delhi (NDLS)', destination: 'Lucknow Charbagh (LKO)', fare: '₹1,150', duration: '06h 30m' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchParams.source || !searchParams.destination) {
      alert('Please fill out both Source and Destination.');
      return;
    }
    // Navigate to the search results page with parameters
    const query = new URLSearchParams(searchParams).toString();
    navigate(`/results?${query}`);
  };

  const handleQuickBook = (route) => {
    const today = new Date().toISOString().split('T')[0];
    const query = new URLSearchParams({
      source: route.source,
      destination: route.destination,
      date: today
    }).toString();
    navigate(`/results?${query}`);
  };

  return (
    <div className="space-y-16 pb-16 animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center py-16 px-4 sm:px-6 lg:px-8 bg-slate-900 overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="SwiftRail Speed Train" 
            className="w-full h-full object-cover object-center opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-3.5 py-1.5 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <span>🚀 Premium Railway Booking</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Fast, Reliable & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Seamless Journeys
              </span>
            </h1>
            <p className="text-slate-300 text-lg max-w-lg leading-relaxed">
              Book tickets, check schedules, and manage your railway travels with SwiftRail's clean and state-of-the-art reservation interface.
            </p>
          </div>

          {/* Search Box Card */}
          <div className="lg:col-span-6">
            <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/40 max-w-md mx-auto">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Ticket className="h-5.5 w-5.5 text-blue-600" />
                Find Your Train
              </h2>
              
              <form onSubmit={handleSearchSubmit} className="space-y-4">
                {/* Source Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">From (Source)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                    <input 
                      type="text"
                      name="source"
                      value={searchParams.source}
                      onChange={handleInputChange}
                      placeholder="Enter city or station"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                      required
                    />
                  </div>
                </div>

                {/* Destination Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">To (Destination)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                    <input 
                      type="text"
                      name="destination"
                      value={searchParams.destination}
                      onChange={handleInputChange}
                      placeholder="Enter city or station"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                      required
                    />
                  </div>
                </div>

                {/* Journey Date Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Journey Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                    <input 
                      type="date"
                      name="date"
                      value={searchParams.date}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
                >
                  <Search className="h-4.5 w-4.5" />
                  Search Trains
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900">Popular Travel Routes</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Travel to top destinations across the country. Click on any route to immediately find available services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularRoutes.map((route, i) => (
            <div 
              key={i}
              onClick={() => handleQuickBook(route)}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    {route.duration}
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">{route.fare}</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 truncate">{route.source.split(' ')[0]}</h4>
                  <div className="h-4 border-l border-dashed border-slate-300 ml-2 my-1" />
                  <h4 className="text-sm font-bold text-slate-800 truncate">{route.destination.split(' ')[0]}</h4>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                  <span>Check Availability</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-100 py-16 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">Why Book With SwiftRail?</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Our reservation portal is designed to provide you with the most efficient travel experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/55 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                <Compass className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Intuitive Search & Routing</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Quickly locate routes, filter by departure timings, seat choices, ticket class tiers, and available quotas.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/55 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Secure Digital Bookings</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Save details, check passenger information, generate verified PNR records, and view real-time reservation statuses.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/55 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Dedicated Administration Control</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Complete administration portal to monitor train registries, modify quotas, view seat allocations, and oversee system bookings.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
