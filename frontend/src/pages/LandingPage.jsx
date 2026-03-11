import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, UserPlus, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gray-950">
      {/* Cyber Grid Background */}
      <div className="cyber-grid"></div>

      {/* Futuristic Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[120px] animate-float mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-float mix-blend-screen pointer-events-none" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-panel-neon p-10 md:p-14 text-center max-w-2xl w-full z-10 mx-4 border-t border-cyan-400/50"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-white to-purple-400 neon-text-glow uppercase">
            ELEVON
          </h1>
          <p className="text-xl md:text-2xl font-light mb-12 tracking-[0.2em] text-cyan-100/80 uppercase">
            Making Projects Into Reality
          </p>
        </motion.div>

        <div className="flex flex-col gap-5 w-full max-w-sm mx-auto">
          <Link to="/student/login">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-neon-primary w-full"
            >
              <User size={24} className="text-cyan-300" />
              <span>Student Login</span>
            </motion.button>
          </Link>

          <Link to="/signup">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-neon-secondary w-full"
            >
              <UserPlus size={24} className="text-purple-300" />
              <span>Student Sign Up</span>
            </motion.button>
          </Link>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-600/50 to-transparent my-2"></div>

          <Link to="/admin/login">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-neon-admin w-full"
            >
              <ShieldCheck size={24} className="text-pink-300" />
              <span>Admin / Teacher Login</span>
            </motion.button>
          </Link>
          
          <Link to="/showcase" className="mt-8 inline-block text-sm text-cyan-400/70 hover:text-cyan-300 transition-colors uppercase tracking-widest hover:neon-text-glow">
            [ Browse Public Projects ]
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
