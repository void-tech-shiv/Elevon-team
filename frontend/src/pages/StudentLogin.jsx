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
      console.error('Login Request Failed:');
      console.error('Error Name:', err.name);
      console.error('Error Message:', err.message);
      if (err.response) {
        console.error('Response Status:', err.response.status);
        console.error('Response Data:', err.response.data);
      } else if (err.request) {
        console.error('No response received from server. Request details:', err.request);
      }
      
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials and network connection.');
      setExpectedCaptcha(generateCaptcha());
      setCaptcha('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 overflow-hidden bg-gray-950">
      {/* Cyber Grid Background */}
      <div className="cyber-grid"></div>
      
      {/* Abstract Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] animate-float mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-float mix-blend-screen pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-panel-neon p-10 max-w-md w-full relative z-10"
      >
        <h2 className="text-4xl font-black mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 neon-text-glow tracking-widest uppercase">Student Login</h2>
        
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <AlertCircle size={20} className="shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold mb-2 text-cyan-200 uppercase tracking-wider">Student ID or Email</label>
            <input 
              type="text" 
              required
              className="input-neon" 
              placeholder="Enter ID or Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-2 text-cyan-200 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              required
              className="input-neon" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mt-2">
            <label className="block text-xs font-bold mb-2 text-cyan-200 uppercase tracking-wider">Verification Code</label>
            <div className="flex gap-4 items-center mb-3">
              <div className="bg-black/50 px-6 py-3 font-mono text-2xl tracking-[0.2em] rounded-lg border border-cyan-500/30 text-cyan-50 select-none line-through decoration-purple-500 shadow-inner">
                {expectedCaptcha}
              </div>
              <button onClick={handleRefreshCaptcha} className="text-xs text-purple-400 hover:text-purple-300 uppercase tracking-wider border-b border-transparent hover:border-purple-400 transition-all font-bold">Refresh</button>
            </div>
            <input 
              type="text" 
              required
              className="input-neon text-center letter-spacing-wide tracking-widest font-mono" 
              placeholder="CODE"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value.toUpperCase())}
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-neon-primary w-full mt-4 h-14"
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'INITIALIZE LOGIN'}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-cyan-100/60 uppercase tracking-wider font-medium">
          No access? <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 hover:neon-text-glow transition-all ml-2 border-b border-cyan-500/30 pb-1">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default StudentLogin;
