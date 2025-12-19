import React from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export function ThemeToggle({ isDarkMode, toggleTheme }: ThemeToggleProps) {
  return (
    <DarkModeSwitch
      style={{
        marginLeft: "1rem",
      }}
      checked={isDarkMode}
      onChange={toggleTheme}
      size={30}
      moonColor="#f3f4f6" // gray-100/warning-ish
      sunColor="#f59e0b" // amber-500
    />
  );
}
