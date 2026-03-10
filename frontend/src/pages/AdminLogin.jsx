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
    <div className="flex items-center justify-center min-h-screen px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="glass-panel p-8 max-w-sm w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
        
        <div className="flex justify-center mb-4 text-orange-400">
          <ShieldCheck size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Access</h2>
        
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Admin Username</label>
            <input 
              type="text" 
              required
              className="input-glass" 
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Password</label>
            <input 
              type="password" 
              required
              className="input-glass" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(249, 115, 22, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 font-semibold text-white shadow-lg mt-4 flex justify-center items-center h-12"
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Secure Login'}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          <Link to="/" className="hover:text-white underline">Back to Home</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
