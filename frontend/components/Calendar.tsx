import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  startOfDay,
  isAfter,
} from "date-fns";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { DayWorkspaceData } from "./WhiteboardWorkspace";

interface CalendarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  events: Record<string, DayWorkspaceData>;
  onDateClick: (day: Date) => void;
}

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
      bounce: 0.3,
    },
  },
  exit: (direction: number) => ({
    rotateX: direction > 0 ? 90 : -90,
    opacity: 0,
    scale: 0.8,
    transformOrigin: "center",
    transition: {
      duration: 0.5,
      ease: "easeIn",
    },
  }),
};

const colors = [
  { name: "white", class: "bg-white dark:bg-stone-50" },
  { name: "blue", class: "bg-blue-50 dark:bg-blue-100" },
  { name: "rose", class: "bg-rose-50 dark:bg-rose-100" },
  { name: "amber", class: "bg-amber-50 dark:bg-amber-100" },
  { name: "emerald", class: "bg-emerald-50 dark:bg-emerald-100" },
  { name: "violet", class: "bg-violet-50 dark:bg-violet-100" },
];

export function Calendar({
  currentDate,
  setCurrentDate,
  events,
  onDateClick,
}: CalendarProps) {
  const [direction, setDirection] = useState(0);
  const [calendarColor, setCalendarColor] = useState(colors[0].class);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Load saved color preference for the CURRENT MONTH
  useEffect(() => {
    const monthKey = format(currentDate, "yyyy-MM");

    // 1. Try Local Storage first (fastest)
    const localColor = localStorage.getItem(`calendarColor-${monthKey}`);
    if (localColor) {
      setCalendarColor(localColor);
    } else {
      setCalendarColor(colors[0].class);
    }

    // 2. Sync with Backend
    const fetchColors = async () => {
      try {
        const res = await fetch(
          "https://calendar-buddy-bkend.onrender.com/user/colors",
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const colorMap = await res.json();
          const backendColor = colorMap[monthKey];

          if (backendColor) {
            setCalendarColor(backendColor);
            // Update local storage to match backend
            localStorage.setItem(`calendarColor-${monthKey}`, backendColor);
          }
        }
      } catch (err) {
        console.error("Failed to fetch calendar colors", err);
      }
    };
    fetchColors();
  }, [currentDate]);

  const handleColorChange = async (colorClass: string) => {
    setCalendarColor(colorClass);
    const monthKey = format(currentDate, "yyyy-MM");

    // Update Local Storage
    localStorage.setItem(`calendarColor-${monthKey}`, colorClass);

    // Update Backend
    try {
      await fetch("https://calendar-buddy-bkend.onrender.com/user/colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ monthKey, color: colorClass }),
      });
    } catch (err) {
      console.error("Failed to save color preference", err);
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

  const hasEvent = (date: Date): boolean => {
    const dateKey = format(date, "yyyy-MM-dd");
    const dayData = events[dateKey];
    return !!(
      dayData &&
      (dayData.note.trim() !== "" || dayData.stickies.length > 0)
    );
  };

  return (
    <div className="relative w-full max-w-4xl perspective-[1200px] z-10 group flex gap-8">
      {/* Color Picker (Left Side) */}
      <div className="hidden lg:flex flex-col gap-3 py-4 z-20">
        {/* Pencil Toggle */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors">
          <PencilIcon className="w-5 h-5" />
        </motion.button>

        {/* Animated Color List */}
        <AnimatePresence>
          {showColorPicker && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex flex-col gap-3 overflow-hidden pt-2">
              {colors.map((c, index) => (
                <motion.button
                  key={c.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.1 }}
                  onClick={() => handleColorChange(c.class)}
                  className={`w-6 h-6 rounded-full border-2 shadow-sm transition-all hover:scale-125 mx-auto ${c.class.split(" ")[0]} ${calendarColor === c.class ? "border-blue-500 scale-125 ring-2 ring-blue-200" : "border-gray-200 dark:border-gray-300"}`}
                  title={c.name}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative w-full">
        {/* Stacked Paper Effect - Layers behind */}
        <div
          className={`absolute top-2 left-1 w-full h-[600px] rounded-b-3xl rounded-t-lg shadow-sm transform -rotate-1 opacity-60 pointer-events-none ${calendarColor}`}
        />
        <div
          className={`absolute top-4 -left-1 w-full h-[600px] rounded-b-3xl rounded-t-lg shadow-sm transform rotate-1 opacity-40 pointer-events-none ${calendarColor}`}
        />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentDate.toString()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className={`rounded-b-3xl rounded-t-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden border-t-8 border-stone-100 dark:border-gray-200 min-h-[600px] relative mt-4 origin-top transition-colors duration-500 ${calendarColor}`}>
            {/* Paper Texture Overlay */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Calendar Header */}
            <div className="flex items-center justify-between p-8 pb-4">
              <h2 className="text-3xl font-black text-gray-800 dark:text-gray-800 tracking-tight">
                {format(currentDate, "MMMM yyyy")}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors text-gray-600 dark:text-gray-600">
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors text-gray-600 dark:text-gray-600">
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 px-8 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wider">
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
                const isToday =
                  format(day, "yyyy-MM-dd") ===
                  format(new Date(), "yyyy-MM-dd");
                const hasNote = hasEvent(day);
                const isFuture = isAfter(day, startOfDay(new Date()));

                return (
                  <motion.button
                    key={day.toString()}
                    disabled={isFuture}
                    whileTap={!isFuture ? { scale: 0.95 } : {}}
                    onClick={() => !isFuture && onDateClick(day)}
                    className={`
                                aspect-square rounded-2xl flex flex-col items-center justify-center relative group transition-all
                                ${isFuture ? "opacity-30 grayscale cursor-not-allowed bg-gray-50/50" : "cursor-pointer"}
                                ${
                                  isToday
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900"
                                    : !isFuture
                                      ? "hover:bg-black/5 text-gray-900 dark:text-gray-900"
                                      : "text-gray-400 dark:text-gray-400"
                                }
                            `}>
                    <span
                      className={`text-lg font-medium ${isToday ? "font-bold" : ""}`}>
                      {format(day, "d")}
                    </span>

                    {/* Event Dot */}
                    {hasNote && (
                      <div
                        className={`
                                absolute bottom-3 w-1.5 h-1.5 rounded-full
                                ${isToday ? "bg-white" : "bg-blue-500"}
                                `}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
