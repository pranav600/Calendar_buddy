import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FcGoogle } from "react-icons/fc";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleGoogleLogin = () => {
    window.open(
      "https://calendar-buddy-bkend.onrender.com/auth/google",
      "_self"
    );
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm overflow-hidden bg-white/60 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
            <div className="p-6 text-center space-y-6">
              <div className="relative flex items-center justify-center">
                <h3 className="text-xl font-mono font-bold text-gray-900 dark:text-white">
                  Welcome Back
                </h3>
                <button
                  onClick={onClose}
                  className="absolute right-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-mono text-gray-500 dark:text-gray-400">
                  Sign in to sync your calendar and notes across devices.
                </p>

                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex font-mono items-center justify-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-white bg-white/30 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-all active:scale-[0.98] shadow-sm select-none">
                  <FcGoogle className="w-5 h-5" />
                  Continue with Google
                </button>
              </div>

              <p className="text-xs font-mono text-gray-400 dark:text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}
