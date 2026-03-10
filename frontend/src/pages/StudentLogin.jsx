import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';

const StudentLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [expectedCaptcha, setExpectedCaptcha] = useState(generateCaptcha());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  function generateCaptcha() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  const handleRefreshCaptcha = (e) => {
    e.preventDefault();
    setExpectedCaptcha(generateCaptcha());
    setCaptcha('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (captcha !== expectedCaptcha) {
      setError('Invalid captcha. Please try again.');
      setExpectedCaptcha(generateCaptcha());
      setCaptcha('');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/student/login`, { identifier, password });
      login(res.data.token, res.data.student, 'student');
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setExpectedCaptcha(generateCaptcha());
      setCaptcha('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-panel p-8 max-w-md w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        <h2 className="text-3xl font-bold mb-6 text-center">Student Login</h2>
        
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6">
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-indigo-100">Student ID or Email</label>
            <input 
              type="text" 
              required
              className="input-glass" 
              placeholder="Enter ID or Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-indigo-100">Password</label>
            <input 
              type="password" 
              required
              className="input-glass" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mt-2">
            <label className="block text-sm font-medium mb-1 text-indigo-100">Verification Code</label>
            <div className="flex gap-4 items-center">
              <div className="bg-white/10 px-4 py-2 font-mono text-xl tracking-widest rounded border border-white/20 select-none line-through decoration-indigo-400">
                {expectedCaptcha}
              </div>
              <button onClick={handleRefreshCaptcha} className="text-xs text-indigo-300 hover:text-white underline">Refresh</button>
            </div>
            <input 
              type="text" 
              required
              className="input-glass mt-2" 
              placeholder="Enter code above"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value.toUpperCase())}
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary mt-6 flex justify-center items-center h-12"
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Login'}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          Don't have an account? <Link to="/signup" className="text-indigo-400 hover:text-white underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default StudentLogin;
