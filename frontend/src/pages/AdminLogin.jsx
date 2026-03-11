import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/admin/login`, { username, password });
      login(res.data.token, res.data.admin, 'admin');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 overflow-hidden bg-gray-950">
      {/* Cyber Grid Background */}
      <div className="cyber-grid"></div>
      
      {/* Abstract Red/Orange Orb for Admin Theme */}
      <div className="absolute top-[30%] left-[30%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px] animate-float pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="glass-panel-neon p-10 max-w-sm w-full relative z-10 border-t-pink-500/50"
      >
        <div className="flex justify-center mb-6 text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
          <ShieldCheck size={56} strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-black mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 tracking-widest uppercase">Admin Access</h2>
        
        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <AlertCircle size={20} className="shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label className="block text-xs font-bold mb-2 text-pink-200 uppercase tracking-wider">Admin Key</label>
            <input 
              type="text" 
              required
              className="input-neon focus:border-pink-500 focus:shadow-[0_0_15px_rgba(236,72,153,0.2)]" 
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-2 text-pink-200 uppercase tracking-wider">Passphrase</label>
            <input 
              type="password" 
              required
              className="input-neon focus:border-pink-500 focus:shadow-[0_0_15px_rgba(236,72,153,0.2)]" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl bg-pink-950/40 border border-pink-400/50 font-bold text-pink-50 shadow-[0_0_15px_rgba(236,72,153,0.2)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] hover:bg-pink-900/60 transition-all duration-300 mt-2 flex justify-center items-center h-14 tracking-widest uppercase"
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Authenticate'}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-xs text-pink-200/50 font-medium uppercase tracking-widest">
          <Link to="/" className="hover:text-pink-300 transition-colors">Abort & Return</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
