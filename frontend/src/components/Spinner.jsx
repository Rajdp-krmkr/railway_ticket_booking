import React from 'react';

const Spinner = ({ size = 'medium', message = 'Loading details...' }) => {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-10 w-10 border-3',
    large: 'h-16 w-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      {/* Spinning Outer Ring */}
      <div 
        className={`${sizeClasses[size]} rounded-full border-blue-100 border-t-blue-700 animate-spin`}
        role="status"
      />
      {/* Optional Loading Description */}
      {message && (
        <p className="mt-3 text-sm font-semibold text-slate-500 tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
};

export default Spinner;
