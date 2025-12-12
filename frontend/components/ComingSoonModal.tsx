import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RocketLaunchIcon, StarIcon } from '@heroicons/react/24/solid';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden text-center p-8 border border-white/20 font-mono"
          >
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 opacity-20 blur-3xl -z-10" />
            <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-tl from-yellow-400 to-red-500 opacity-20 blur-3xl -z-10" />

            {/* Icon */}
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6 transform rotate-3"
            >
              <RocketLaunchIcon className="w-10 h-10 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-2"
            >
              Calendar Buddy
            </motion.h2>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-2 mb-6"
            >
                <StarIcon className="w-6 h-6 text-yellow-400" />
                <span className="text-3xl font-bold text-gray-800 dark:text-white tracking-tighter">
                    2026
                </span>
                <StarIcon className="w-6 h-6 text-yellow-400" />
            </motion.div>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-medium leading-relaxed"
            >
              Get ready for a whole new way to organize your life. <br />
              <span className="text-blue-600 dark:text-blue-400 font-bold">Coming Soon.</span>
            </motion.p>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
            >
              I Can't Wait! 🚀
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
