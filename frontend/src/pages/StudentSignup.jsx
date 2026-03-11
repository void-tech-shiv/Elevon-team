import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../api/config';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const StudentSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    department: '',
    year: '',
    password: '',
    confirmPassword: ''
  });
  
  const [captcha, setCaptcha] = useState('');
  const [expectedCaptcha, setExpectedCaptcha] = useState(generateCaptcha());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  function generateCaptcha() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  const handleRefreshCaptcha = (e) => {
    e.preventDefault();
    setExpectedCaptcha(generateCaptcha());
    setCaptcha('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (captcha !== expectedCaptcha) {
      setError('Invalid captcha. Please try again.');
      setExpectedCaptcha(generateCaptcha());
      setCaptcha('');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        studentId: formData.studentId,
        email: formData.email,
        department: formData.department,
        year: formData.year,
        password: formData.password
      };
      await axios.post(`${API_BASE_URL}/api/auth/student/signup`, payload);
      setSuccess(true);
      setTimeout(() => navigate('/student/login'), 3000);
    } catch (err) {
      console.error('Signup Request Failed:');
      console.error('Error Message:', err.message);
      if (err.response) {
        console.error('Response Data:', err.response.data);
      }
      
      setError(err.response?.data?.message || err.message || 'Signup failed due to a network or server error.');
      setExpectedCaptcha(generateCaptcha());
      setCaptcha('');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative flex items-center justify-center min-h-screen px-4 bg-gray-950 overflow-hidden">
        <div className="cyber-grid"></div>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel-neon p-12 max-w-lg w-full text-center relative z-10">
          <CheckCircle size={80} className="text-cyan-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]" />
          <h2 className="text-3xl font-black mb-4 text-cyan-50 tracking-widest uppercase">Registration Successful</h2>
          <p className="text-cyan-200/80 mb-8 font-medium">Your account is pending admin authorization. You will be redirected shortly.</p>
          <Link to="/student/login" className="btn-neon-primary inline-flex">Go to Login</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 py-12 bg-gray-950 overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="cyber-grid"></div>
      
      {/* Ambient Glows */}
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] animate-float pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="glass-panel-neon p-8 md:p-12 max-w-2xl w-full relative z-10"
      >
        <h2 className="text-3xl md:text-4xl font-black mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-400 neon-text-glow tracking-widest uppercase">Student Registration</h2>
        
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-xl mb-8 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <AlertCircle size={20} className="shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold mb-2 text-cyan-200 uppercase tracking-wider">Full Name</label>
            <input type="text" name="name" required className="input-neon" value={formData.name} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-xs font-bold mb-2 text-cyan-200 uppercase tracking-wider">Student ID</label>
            <input type="text" name="studentId" required className="input-neon font-mono" value={formData.studentId} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-xs font-bold mb-2 text-cyan-200 uppercase tracking-wider">Email Address</label>
            <input type="email" name="email" required className="input-neon" value={formData.email} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-xs font-bold mb-2 text-cyan-200 uppercase tracking-wider">Department</label>
            <input type="text" name="department" required className="input-neon" value={formData.department} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-xs font-bold mb-2 text-cyan-200 uppercase tracking-wider">Year / Semester</label>
            <input type="text" name="year" required className="input-neon" value={formData.year} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-xs font-bold mb-2 text-cyan-200 uppercase tracking-wider">Password</label>
            <input type="password" name="password" required className="input-neon" value={formData.password} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-xs font-bold mb-2 text-cyan-200 uppercase tracking-wider">Confirm Password</label>
            <input type="password" name="confirmPassword" required className="input-neon" value={formData.confirmPassword} onChange={handleChange} />
          </div>

          <div className="md:col-span-2 mt-4 bg-black/30 p-6 rounded-xl border border-cyan-500/20">
            <label className="block text-xs font-bold mb-3 text-cyan-200 uppercase tracking-wider">Security Authorization</label>
            <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
              <div className="bg-black/80 px-6 py-3 font-mono text-2xl tracking-[0.2em] rounded-lg border border-cyan-500/30 text-cyan-50 select-none line-through decoration-purple-500 w-full text-center shadow-inner">
                {expectedCaptcha}
              </div>
              <button type="button" onClick={handleRefreshCaptcha} className="text-xs text-purple-400 hover:text-purple-300 uppercase tracking-wider font-bold shrink-0">Regenerate Code</button>
            </div>
            <input 
              type="text" 
              required
              className="input-neon text-center font-mono tracking-widest uppercase" 
              placeholder="ENTER CODE"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value.toUpperCase())}
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-neon-primary md:col-span-2 mt-4 h-14"
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'REGISTER PROFILE'}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-cyan-100/60 font-medium uppercase tracking-wider">
          Already registered? <Link to="/student/login" className="text-cyan-400 hover:text-cyan-300 hover:neon-text-glow transition-all ml-2 border-b border-cyan-500/30 pb-1">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default StudentSignup;
