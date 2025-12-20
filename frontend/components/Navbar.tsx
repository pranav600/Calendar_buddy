import React, { useState, useEffect } from "react";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
// import { ThemeToggle } from "./ThemeToggle";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { LoginModal } from "./LoginModal";

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

interface User {
  displayName: string;
  photos?: { value: string }[];
  avatarUrl?: string; // Legacy/Manual login potentially
  image?: string; // From MongoDB User model
}

export function Navbar({ isDarkMode, toggleTheme }: NavbarProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Note: You need to make sure credentials are included
        // Since we are cross-origin (3000 -> 5000), we need credentials: 'include'
        // But for now, since we haven't fully implemented the session storage with MongoDB,
        // we might not get persistence on refresh unless cookies are set correctly.
        // For this step, I'll assume we want to TRY fetching.
        const response = await fetch(
          "https://calendar-buddy-bkend.onrender.com/auth/login/success",
          {
            method: "GET",
            credentials: "include", // Important: Send session cookie
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (err) {
        console.log("Not authenticated");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    // Clear calendar color preferences
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("calendarColor-")) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    window.open(
      "https://calendar-buddy-bkend.onrender.com/auth/logout",
      "_self"
    );
  };

  return (
    <nav className="sticky top-0 w-full z-50 mb-6 shrink-0">
      <div className="absolute inset-0 border-b border-gray-300 dark:border-gray-700 backdrop-blur-xl bg-background/80 transition-all duration-300 -z-10" />

      <div className="flex justify-between items-center px-6 md:px-12 py-4">
        {/* Project Name */}
        <h1 className="text-2xl font-black tracking-tight drop-shadow-sm font-mono bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
          Calendrix
        </h1>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pr-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-zinc-700">
                {user.image ||
                user.avatarUrl ||
                (user.photos && user.photos[0]) ? (
                  <img
                    src={
                      user.image || user.avatarUrl || user.photos?.[0]?.value
                    }
                    alt={user.displayName}
                    className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
                    referrerPolicy="no-referrer" //Google often blocks profile images if the request comes from a different domain
                  />
                ) : (
                  <UserCircleIcon className="w-9 h-9 text-blue-600 dark:text-blue-400" />
                )}
                {/* <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                  {user.displayName}
                </span> */}
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    {/* Backdrop to close on click outside */}
                    <div
                      className="fixed inset-0 z-[105]"
                      onClick={() => setIsProfileOpen(false)}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-[-5rem] top-16 mt-2 w-60 p-5 z-[110] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-zinc-700/50">
                      <div className="flex flex-col items-center gap-3 mb-4">
                        {user.image ||
                        user.avatarUrl ||
                        (user.photos && user.photos[0]) ? (
                          <img
                            src={
                              user.image ||
                              user.avatarUrl ||
                              user.photos?.[0]?.value
                            }
                            alt={user.displayName}
                            className="w-16 h-16 rounded-full border-2 border-white dark:border-zinc-700 shadow-md object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <UserCircleIcon className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                        )}
                        <div className="text-center">
                          <p className="font-semibold text-gray-900 dark:text-white text-lg">
                            {user.displayName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            Logged in
                          </p>
                        </div>
                      </div>

                      <div className="h-px bg-gray-200 dark:bg-zinc-700 my-2" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 p-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium">
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              type="button"
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors group flex items-center gap-2 px-3"
              aria-label="Login">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                Login
              </span>
              <UserCircleIcon className="w-8 h-8 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </button>
          )}

          <DarkModeSwitch
            checked={isDarkMode}
            onChange={toggleTheme}
            size={30}
            moonColor="#f3f4f6"
            sunColor="#f59e0b"
          />
        </div>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </div>
    </nav>
  );
}
