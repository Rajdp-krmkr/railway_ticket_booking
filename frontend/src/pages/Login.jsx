import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, User } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/');
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (result.success) {
      // Check role to redirect appropriately
      const userStr = localStorage.getItem('railway_user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        if (userObj.role === 'admin') {
          navigate('/admin');
          return;
        }
      }
      navigate('/search');
    } else {
      setError(result.message || 'Incorrect credentials. Please try again.');
      setLoading(false);
    }
  };

  const handleQuickLogin = (role) => {
    if (role === 'admin') {
      setEmail('admin@railway.com');
      setPassword('admin123');
    } else {
      setEmail('passenger@railway.com');
      setPassword('passenger123');
    }
  };

  return (
    <div className="min-h-[500px] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 animate-fade-in">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 text-sm mt-1">Sign in to book berths and review tickets.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 text-red-700 text-xs font-semibold p-3.5 rounded-xl border border-red-200/50">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="passenger@railway.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <LogIn className="h-4.5 w-4.5" />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Quick Logins */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">Quick Demo Credentials</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('user')}
              className="py-2 px-3 border border-slate-200 hover:border-blue-200 bg-slate-50 hover:bg-blue-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <User className="h-3.5 w-3.5 text-blue-500" />
              Passenger
            </button>
            <button
              onClick={() => handleQuickLogin('admin')}
              className="py-2 px-3 border border-slate-200 hover:border-amber-200 bg-slate-50 hover:bg-amber-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
              Admin User
            </button>
          </div>
        </div>

        {/* Toggle to register */}
        <div className="text-center text-xs font-semibold text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-700 hover:underline">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
