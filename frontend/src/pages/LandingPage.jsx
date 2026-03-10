import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, UserPlus, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px] animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-panel p-12 text-center max-w-2xl w-full z-10 mx-4"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 className="text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-purple-300 drop-shadow-lg">
            ELEVON
          </h1>
          <p className="text-2xl font-light mb-12 tracking-wide text-indigo-100">
            Making Projects Into Reality
          </p>
        </motion.div>

        <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
          <Link to="/student/login">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(99, 102, 241, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary w-full flex items-center justify-center gap-3 text-lg py-4"
            >
              <User size={24} />
              Student Login
            </motion.button>
          </Link>

          <Link to="/signup">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary w-full flex items-center justify-center gap-3 text-lg py-4"
            >
              <UserPlus size={24} />
              Student Sign Up
            </motion.button>
          </Link>

          <Link to="/admin/login">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(168, 85, 247, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary w-full flex items-center justify-center gap-3 text-lg py-4 border-purple-500/30 hover:bg-purple-500/20"
            >
              <ShieldCheck size={24} />
              Admin / Teacher Login
            </motion.button>
          </Link>
          
          <Link to="/showcase" className="mt-4 text-sm text-indigo-300 hover:text-white transition-colors underline underline-offset-4">
            Browse Public Projects
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
