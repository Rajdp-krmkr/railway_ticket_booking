import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Train, Menu, X, LogOut, User, ShieldAlert, Ticket, Info, Mail } from 'lucide-react';

const MainLayout = ({ children }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/', icon: Train },
    { name: 'Search Trains', path: '/search', icon: Train },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 text-blue-700 hover:text-blue-800 transition-colors">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-700">
                  <Train className="h-6 w-6" />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Swift<span className="text-blue-700">Rail</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 items-center">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(link.path)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {isAuthenticated && (
                <Link
                  to="/my-bookings"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive('/my-bookings')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Ticket className="h-4 w-4" />
                  My Tickets
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive('/admin')
                      ? 'bg-amber-50 text-amber-700 border border-amber-200/50'
                      : 'text-amber-600 hover:bg-amber-50/60'
                  }`}
                >
                  <ShieldAlert className="h-4 w-4" />
                  Admin
                </Link>
              )}
            </nav>

            {/* Authentication Buttons (Desktop) */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3 bg-slate-50 pl-3 pr-2 py-1.5 rounded-full border border-slate-200/60">
                  <div className="flex items-center space-x-1.5">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-xs font-semibold">
                      {user?.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                      {user?.name || 'Passenger'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4.5 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-all shadow-sm hover:shadow-md cursor-pointer"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated && (
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium flex items-center gap-1.5 ${
                    isActive('/my-bookings')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Ticket className="h-5 w-5" />
                  My Tickets
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium flex items-center gap-1.5 ${
                    isActive('/admin')
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <ShieldAlert className="h-5 w-5" />
                  Admin Dashboard
                </Link>
              )}

              <hr className="my-2 border-slate-200" />

              {isAuthenticated ? (
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold text-sm">
                      {user?.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{user?.name}</div>
                      <div className="text-xs text-slate-500">{user?.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-2.5 text-center text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 px-3 py-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-center text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-white">
                <Train className="h-6 w-6 text-blue-400" />
                <span className="font-extrabold text-xl tracking-tight">
                  Swift<span className="text-blue-400">Rail</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Experience the next generation of booking systems. SwiftRail provides seamless ticket purchasing, real-time schedule checks, and stress-free travel management.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
                </li>
                <li>
                  <Link to="/search" className="text-slate-400 hover:text-white transition-colors">Search Trains</Link>
                </li>
                <li>
                  <Link to="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact Support</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Passenger Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/my-bookings" className="text-slate-400 hover:text-white transition-colors">Track Ticket PNR</Link>
                </li>
                <li>
                  <span className="text-slate-500 cursor-not-allowed">Train Route Maps (Soon)</span>
                </li>
                <li>
                  <span className="text-slate-500 cursor-not-allowed">Refund Policies</span>
                </li>
                <li>
                  <span className="text-slate-500 cursor-not-allowed">FAQs & Help</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Safety & Care</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-3">
                Need quick support? Contact our 24/7 National Rail Helpline.
              </p>
              <div className="text-sm font-semibold text-blue-400">
                Helpline: +1 (800) 555-RAIL
              </div>
            </div>
          </div>

          <hr className="my-8 border-slate-800" />

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              &copy; {new Date().getFullYear()} SwiftRail Inc. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-400 cursor-pointer">Cookie Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
