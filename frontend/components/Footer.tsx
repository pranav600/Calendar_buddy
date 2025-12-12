import React from "react";
import { format } from "date-fns";

interface FooterProps {
  currentDate: Date;
}

export function Footer({ currentDate }: FooterProps) {
  return (
    <div className="max-w-[95%] mx-auto mt-8 flex justify-between text-gray-900 dark:text-gray-400 font-medium">
        
        <div className="text-gray-500 font-normal">
            © {format(currentDate, "yyyy")} Calendar Buddy, Developed by Pranav
        </div>
    </div>
  );
}
