import React from 'react';
import { Compass, ShieldCheck, Clock, Users, MapPin, Award } from 'lucide-react';

const About = () => {
  const milestones = [
    { icon: Compass, title: 'National Coverage', desc: 'Connecting over 500 cities and 12,000 active rail terminals nationwide.' },
    { icon: ShieldCheck, title: 'Verified Security', desc: 'Secure token authentication safeguarding user transactions and ticketing registries.' },
    { icon: Clock, title: 'Timely Dispatch', desc: '98.5% historical punctuality across all premium fast-rail routes.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in">
      
      {/* Intro Hero banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Connecting Journeys, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
            Empowering Modern Travel
          </span>
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          At SwiftRail, our mission is to offer premium, simple, and rapid digital ticketing solutions. We design services that help travelers book tickets, track itineraries, and manage travel seamlessly.
        </p>
      </div>

      {/* Grid Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {milestones.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center space-y-4"
            >
              <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Corporate Section */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5 text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Our Core Commitment</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            SwiftRail runs on high-speed servers featuring MVC architectures on Node.js/Express, caching credentials in JWT structures, and resolving transactions in microsecond intervals.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            We prioritize traveler experience and service transparency. Whether you are checking train schedules, booking berths for your family, or seeking support, our platform ensures immediate updates.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full">
              <Award className="h-4 w-4" />
              <span>ISO 9001 Certified System</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <Users className="h-4 w-4" />
              <span>10M+ Happy Passengers</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-800 text-center space-y-1.5">
            <span className="text-3xl font-extrabold text-blue-400">12,000+</span>
            <span className="text-xs text-slate-400 block font-semibold uppercase">Daily Departures</span>
          </div>
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-800 text-center space-y-1.5">
            <span className="text-3xl font-extrabold text-blue-400">50M+</span>
            <span className="text-xs text-slate-400 block font-semibold uppercase">Annual Bookings</span>
          </div>
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-800 text-center space-y-1.5">
            <span className="text-3xl font-extrabold text-blue-400">99.9%</span>
            <span className="text-xs text-slate-400 block font-semibold uppercase">Uptime Reliability</span>
          </div>
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-800 text-center space-y-1.5">
            <span className="text-3xl font-extrabold text-blue-400">24/7</span>
            <span className="text-xs text-slate-400 block font-semibold uppercase">Customer Care</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;
