"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isAfter,
  startOfDay,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ThemeToggle } from "../components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { WhiteboardWorkspace, DayWorkspaceData } from "../components/WhiteboardWorkspace";

export default function Home() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Record<string, DayWorkspaceData>>({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme based on system or local storage (optional)
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Generate days for the current month view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    setShowEventModal(true);
  };

  const handleSaveEvent = (data: DayWorkspaceData) => {
    if (!selectedDate) return;
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    
    setEvents((prev) => ({
      ...prev,
      [dateKey]: data,
    }));

    setShowEventModal(false);
  };

  const hasEvent = (date: Date): boolean => {
    const dateKey = format(date, "yyyy-MM-dd");
    const dayData = events[dateKey];
    return !!(dayData && (dayData.note.trim() !== "" || dayData.stickies.length > 0));
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/50 dark:bg-background p-4 md:p-8 font-sans text-foreground transition-colors duration-300">
      
      {/* Top Header */}
      <div className="max-w-[95%] mx-auto flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Calendar Buddy</h1>
        
        <div className="flex items-center gap-4">
            <button
              onClick={handleToday}
              className="px-4 py-1.5 text-sm font-medium border border-border rounded-lg bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-accent transition-colors shadow-sm"
            >
              Today
            </button>
            
            {/* Theme Toggle Switch */}
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />
        </div>
      </div>

      {/* Main Calendar Card */}
      <div className="max-w-[95%] mx-auto bg-gray-100/80 dark:bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-sm">
        
        {/* Calendar Navigation Header */}
        <div className="flex items-center mb-8">
            <h2 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mr-auto">
                {format(currentDate, "MMMM yyyy")}
            </h2>
            
            {/* Can add arrows here if desired, or keep them relative to grid if specific design needs */}
            {/* Current design shows title left aligned, maybe arrows are subtle or elsewhere. 
                The prompt image shows "December 2025" large on left. 
                I will add simple arrows next to it or right aligned if needed. 
                Let's put them right aligned for clarity. */}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-8 gap-x-4">
            {/* Weekday Headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-l font-mono text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            ))}

             {/* Days */}
            {days.map((day, i) => {
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isCurrentDay = isToday(day);
              const dayHasEvent = hasEvent(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isFutureDate = isAfter(day, startOfDay(new Date()));

              return (
                <div
                  key={i}
                  onClick={() => !isFutureDate && handleDateClick(day)}
                  className={`
                    relative group flex flex-col items-center justify-start py-2 h-24 rounded-2xl transition-all
                    ${
                        isFutureDate 
                        ? "cursor-not-allowed opacity-40 bg-gray-50/50 dark:bg-gray-800/30" 
                        : "cursor-pointer hover:bg-white/60 dark:hover:bg-white/10"
                    }
                    ${!isCurrentMonth && !isFutureDate ? "opacity-30" : ""}
                  `}
                >
                  <span
                    className={`
                      text-lg font-mono w-8 h-8 flex items-center justify-center rounded-full transition-colors
                      ${isCurrentDay 
                        ? "bg-blue-600 text-white shadow-md" 
                        : isFutureDate 
                            ? "text-gray-400 dark:text-gray-600"
                            : "text-gray-700 dark:text-gray-300 group-hover:bg-gray-200/50 dark:group-hover:bg-gray-700/50"
                      }
                    `}
                  >
                    {format(day, "d")}
                  </span>
                  
                  {/* Event Dot */}
                  {dayHasEvent && !isFutureDate && (
                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-400"></div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Footer Year */}
      <div className="max-w-[95%] mx-auto mt-8 flex justify-between text-gray-900 dark:text-gray-400 font-medium">
            <div>
                <h3 className="font-bold">Upcoming Calendar Buddy</h3>
                <p>{(parseInt(format(currentDate, "yyyy")) + 1).toString()}</p>
            </div>
            <div className="text-gray-500 font-normal">
                © {format(currentDate, "yyyy")} Calendar Buddy
            </div>
      </div>


      {/* Full Screen Whiteboard Workspace */}
      <WhiteboardWorkspace
        isOpen={showEventModal}
        selectedDate={selectedDate}
        initialData={
            selectedDate && events[format(selectedDate, "yyyy-MM-dd")] 
            ? events[format(selectedDate, "yyyy-MM-dd")]
            : { note: "", stickies: [] }
        }
        onClose={() => setShowEventModal(false)}
        onSave={handleSaveEvent}
      />
    </div>
  );
}
