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
import { Navbar } from "../components/Navbar";
import { motion, AnimatePresence, Variants } from "framer-motion";
// import { SpiralBinding } from "../components/SpiralBinding";
import { WhiteboardWorkspace, DayWorkspaceData } from "../components/WhiteboardWorkspace";
import { ComingSoonModal } from "../components/ComingSoonModal";
import { Footer } from "../components/Footer";

const variants: Variants = {
  enter: (direction: number) => ({
    rotateX: direction > 0 ? -90 : 90,
    opacity: 0,
    scale: 0.8,
    transformOrigin: "center",
  }),
  center: {
    rotateX: 0,
    opacity: 1,
    scale: 1,
    transformOrigin: "center",
    transition: {
      duration: 0.7,
      type: "spring",
      bounce: 0.3
    }
  },
  exit: (direction: number) => ({
    rotateX: direction > 0 ? 90 : -90,
    opacity: 0,
    scale: 0.8,
    transformOrigin: "center",
    transition: {
      duration: 0.5,
      ease: "easeIn"
    }
  })
};

export default function Home() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [events, setEvents] = useState<Record<string, DayWorkspaceData>>({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [direction, setDirection] = useState(0);

  // Initialize theme based on system or local storage (optional)
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const startDay = startOfMonth(currentDate).getDay();

  const handlePrevMonth = () => {
      setDirection(-1);
      setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
      setDirection(1);
      setCurrentDate(addMonths(currentDate, 1));
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
    <div className="w-full p-2 md:p-4 font-mono text-foreground transition-colors duration-300 flex flex-col items-center relative overflow-hidden">
      
      {/* Coming Soon Modal */}
      <ComingSoonModal 
        isOpen={showWelcomeModal} 
        onClose={() => setShowWelcomeModal(false)} 
      />

      {/* Top Header */}
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Calendar Container with Spiral Binding */}
      <div className="relative w-full max-w-4xl perspective-[1200px] z-10 group">
         {/* Stacked Paper Effect - Layers behind */}
         <div className="absolute top-2 left-1 w-full h-[600px] bg-white rounded-b-3xl rounded-t-lg shadow-sm transform -rotate-1 opacity-60 pointer-events-none" />
         <div className="absolute top-4 -left-1 w-full h-[600px] bg-white rounded-b-3xl rounded-t-lg shadow-sm transform rotate-1 opacity-40 pointer-events-none" />
         
         {/* <SpiralBinding /> */}
         
         <AnimatePresence mode="wait" custom={direction}>
            <motion.div
                key={currentDate.toString()}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="bg-white dark:bg-stone-50 rounded-b-3xl rounded-t-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden border-t-8 border-stone-100 dark:border-gray-200 min-h-[600px] relative mt-4 origin-top"
            >
                 {/* Paper Texture Overlay */}
                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                     style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
                 />

                {/* Calendar Header */}
                <div className="flex items-center justify-between p-8 pb-4">
                    <h2 className="text-3xl font-black text-gray-800 dark:text-gray-800 tracking-tight">
                    {format(currentDate, "MMMM yyyy")}
                    </h2>
                    <div className="flex gap-2">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-300"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-300"
                    >
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                    </div>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-2 px-8 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        {day}
                    </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-2 p-8 pt-2">
                    {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                    ))}
                    {daysInMonth.map((day) => {
                    const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
                    const hasNote = hasEvent(day);
                    const isFuture = isAfter(day, startOfDay(new Date()));
                    
                    return (
                        <motion.button
                        key={day.toString()}
                        disabled={isFuture}
                        whileHover={!isFuture ? { scale: 1.05, translateY: -2 } : {}}
                        whileTap={!isFuture ? { scale: 0.95 } : {}}
                        onClick={() => !isFuture && handleDateClick(day)}
                        className={`
                            aspect-square rounded-2xl flex flex-col items-center justify-center relative group transition-all
                            ${isFuture ? "opacity-30 grayscale cursor-not-allowed bg-gray-50/50" : "cursor-pointer"}
                            ${isToday 
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900" 
                                : !isFuture 
                                    ? "hover:bg-gray-300 dark:hover:bg-gray-300 text-gray-900 dark:text-gray-900" 
                                    : "text-gray-400 dark:text-gray-400"
                            }
                        `}
                        >
                        <span className={`text-lg font-medium ${isToday ? "font-bold" : ""}`}>
                            {format(day, "d")}
                        </span>
                        
                        {/* Event Dot */}
                        {hasNote && (
                            <div className={`
                            absolute bottom-3 w-1.5 h-1.5 rounded-full
                            ${isToday ? "bg-white" : "bg-blue-500"}
                            `} />
                        )}
                        </motion.button>
                    );
                    })}
                </div>
            </motion.div>
         </AnimatePresence>
      </div>

      {/* Footer Year */}
      <Footer currentDate={currentDate} />


      {/* Full Screen Whiteboard Workspace */}
      <WhiteboardWorkspace
        isOpen={showEventModal}
        selectedDate={selectedDate}
        initialData={
            selectedDate 
            ? (events[format(selectedDate, "yyyy-MM-dd")] || { note: "", stickies: [] })
            : { note: "", stickies: [] }
        }
        onClose={() => setShowEventModal(false)}
        onSave={handleSaveEvent}
      />
    </div>
  );
}
