import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Train, LayoutDashboard, Shield, LogOut, Home, ArrowLeft } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-2 text-white">
            <Shield className="h-6 w-6 text-amber-500" />
            <span className="font-extrabold text-lg tracking-tight">
              Admin<span className="text-amber-500">Panel</span>
            </span>
          </div>
        </div>

        {/* User Info Card */}
        <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-900/40">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-semibold text-sm text-slate-200 truncate">{user?.name || 'Administrator'}</h4>
              <span className="text-xs text-amber-500 font-semibold tracking-wider uppercase">System Root</span>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-grow px-4 py-6 space-y-1.5">
          <Link
            to="/admin"
            className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              location.pathname === '/admin'
                ? 'bg-amber-500/10 text-amber-400 border-l-4 border-amber-500 font-semibold pl-3'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard Hub</span>
          </Link>

          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
          >
            <Home className="h-5 w-5" />
            <span>Go to Client Site</span>
          </Link>
        </nav>

        {/* Sidebar Footer / Sign Out */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-950/30 hover:bg-red-900/40 text-red-400 hover:text-red-300 border border-red-900/40 rounded-xl text-sm font-semibold transition-all cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-grow flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 sticky top-0 z-40">
          {/* Left panel info */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all mr-2"
              title="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-800">Railway Control Tower</h2>
          </div>

          {/* Right panel info */}
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
              Control Panel Active
            </span>
            
            <div className="md:hidden flex items-center">
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Admin Contents */}
        <main className="flex-grow p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
