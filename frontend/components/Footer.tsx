import React from "react";
import { format } from "date-fns";
import { FaGithub, FaLinkedin } from "react-icons/fa";

interface FooterProps {
  currentDate: Date;
}

export function Footer({ currentDate }: FooterProps) {
  return (
    <div className="max-w-[95%] mx-auto mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center text-gray-900 dark:text-gray-400 font-medium">
        
        <div className="text-gray-500 font-normal text-center sm:text-left">
            © {format(currentDate, "yyyy")} Calendar Buddy, Developed by Pranav.
        </div>
        
        <div className="flex gap-4">
            <a 
              href={process.env.NEXT_PUBLIC_GITHUB_URL || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              aria-label="GitHub"
            >
                <FaGithub size={24} />
            </a>
            <a 
              href={process.env.NEXT_PUBLIC_LINKEDIN_URL || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              aria-label="LinkedIn"
            >
                <FaLinkedin size={24} />
            </a>
        </div>
    </div>
  );
}
