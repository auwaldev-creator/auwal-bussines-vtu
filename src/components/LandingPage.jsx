import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-chatgpt text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Moving Background Text (Marquee Style) */}
      <div className="absolute top-10 w-full overflow-hidden opacity-5 whitespace-nowrap pointer-events-none">
        <motion.h1 
          animate={{ x: [1000, -1000] }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          className="text-9xl font-black"
        >
          AUWAL VTU • FAST DATA • AIRTIME • NIN PRINT • BILLS •
        </motion.h1>
      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-2xl"
      >
        <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-3xl font-bold">AB</span>
            </div>
        </div>

        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600"
        >
          Auwal Business VTU
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 text-lg md:text-xl mb-8 leading-relaxed"
        >
          Shiga duniyar sauki. Sayan Data, Airtime, da Printing na NIN yanzu ya zama kaman kiftawar ido. 
          Inganci da sauri shine babban burin mu.
        </motion.p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="w-full sm:w-48 py-4 bg-white text-black font-bold rounded-xl shadow-lg hover:bg-gray-200 transition"
          >
            Fara Amfani (Log In)
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="w-full sm:w-48 py-4 bg-transparent border-2 border-gray-600 font-bold rounded-xl hover:bg-gray-800 transition"
          >
            Bude Account
          </motion.button>
        </div>
      </motion.div>

      {/* Bottom Features Carousel Simulation */}
      <div className="absolute bottom-10 flex gap-8 text-xs font-mono text-gray-500 uppercase tracking-widest">
          <span className="animate-pulse">● 24/7 Support</span>
          <span className="animate-pulse" style={{ animationDelay: '0.5s' }}>● Instant Delivery</span>
          <span className="animate-pulse" style={{ animationDelay: '1s' }}>● Secured Payments</span>
      </div>

    </div>
  );
};

export default LandingPage;
