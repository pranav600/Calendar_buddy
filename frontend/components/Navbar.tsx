import React from 'react';
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export function Navbar({ isDarkMode, toggleTheme }: NavbarProps) {
  return (
    <nav className="w-full flex justify-between mb-6 px-2 z-10 shrink-0">
       {/* Project Name */}
       <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white drop-shadow-sm font-mono">
         Calendar Buddy
       </h1>
       
       {/* Right Side Actions */}
       <div className="flex items-center gap-4">
          
          <button 
            type="button"
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors group"
            aria-label="User Profile"
          >
            <UserCircleIcon className="w-8 h-8 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          </button>
                    <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

       </div>
    </nav>
  );
}
