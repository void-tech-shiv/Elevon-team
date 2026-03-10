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
      setError(err.response?.data?.message || 'Signup failed.');
      setExpectedCaptcha(generateCaptcha());
      setCaptcha('');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel p-8 max-w-md w-full text-center">
          <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
          <p className="text-gray-300 mb-6">Your account is now pending admin approval. You will be redirected to login shortly.</p>
          <Link to="/student/login" className="btn-primary inline-block">Go to Login</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-panel p-8 max-w-lg w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
        <h2 className="text-3xl font-bold mb-6 text-center">Student Registration</h2>
        
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6">
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-indigo-100">Full Name</label>
            <input type="text" name="name" required className="input-glass" value={formData.name} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-indigo-100">Student ID</label>
            <input type="text" name="studentId" required className="input-glass" value={formData.studentId} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-indigo-100">Email Address</label>
            <input type="email" name="email" required className="input-glass" value={formData.email} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-indigo-100">Department</label>
            <input type="text" name="department" required className="input-glass" value={formData.department} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-indigo-100">Year / Semester</label>
            <input type="text" name="year" required className="input-glass" value={formData.year} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-indigo-100">Password</label>
            <input type="password" name="password" required className="input-glass" value={formData.password} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-indigo-100">Confirm Password</label>
            <input type="password" name="confirmPassword" required className="input-glass" value={formData.confirmPassword} onChange={handleChange} />
          </div>

          <div className="md:col-span-2 mt-2">
            <label className="block text-sm font-medium mb-1 text-indigo-100">Verification Code</label>
            <div className="flex gap-4 items-center mb-2">
              <div className="bg-white/10 px-4 py-2 font-mono text-xl tracking-widest rounded border border-white/20 select-none line-through decoration-indigo-400">
                {expectedCaptcha}
              </div>
              <button onClick={handleRefreshCaptcha} className="text-xs text-indigo-300 hover:text-white underline">Refresh</button>
            </div>
            <input 
              type="text" 
              required
              className="input-glass" 
              placeholder="Enter code above"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value.toUpperCase())}
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="btn-primary md:col-span-2 mt-4 flex justify-center items-center h-12"
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          Already have an account? <Link to="/student/login" className="text-indigo-400 hover:text-white underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default StudentSignup;
