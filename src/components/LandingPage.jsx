import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Text */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex flex-col justify-center">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="text-9xl font-bold whitespace-nowrap"
        >
          DATA AIRTIME VTU NIN PRINT DATA AIRTIME
        </motion.div>
      </div>

      <div className="z-10 text-center space-y-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
        >
          Auwal Business VTU
        </motion.h1>

        <div className="h-24">
           {/* Typewriter Effect simulation */}
           <p className="text-xl text-gray-300">Fast. Reliable. Secure.</p>
           <p className="text-sm text-gray-400 mt-2">The future of seamless transactions.</p>
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate('/login')} className="px-8 py-3 bg-gray-700 rounded-full hover:bg-gray-600 transition">Log in</button>
          <button onClick={() => navigate('/register')} className="px-8 py-3 bg-blue-600 rounded-full hover:bg-blue-500 transition">Sign up</button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
