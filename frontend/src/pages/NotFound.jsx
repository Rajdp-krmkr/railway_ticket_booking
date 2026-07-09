import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ban, Compass, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center py-16 px-4 text-center space-y-6 animate-fade-in">
      
      {/* 404 Visual Icon */}
      <div className="relative">
        <h1 className="text-9xl font-black text-slate-200 tracking-widest select-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <Ban className="h-16 w-16 text-red-500/80 animate-pulse" />
        </div>
      </div>

      {/* Description text */}
      <div className="space-y-2 max-w-sm mx-auto">
        <h3 className="text-xl font-bold text-slate-800">You've Gone Off Track!</h3>
        <p className="text-slate-500 text-sm leading-relaxed">
          The station platform or route you are searching for does not exist. Check your URL address or consult our train explorer.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Home className="h-4.5 w-4.5" />
          SwiftRail Home
        </button>
        <button
          onClick={() => navigate('/search')}
          className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Compass className="h-4.5 w-4.5" />
          Search Trains
        </button>
      </div>

    </div>
  );
};

export default NotFound;
