"use client";

import { useState, useEffect } from "react";
import { format, startOfDay } from "date-fns";
import { Navbar } from "../components/Navbar";
import {
  WhiteboardWorkspace,
  DayWorkspaceData,
} from "../components/WhiteboardWorkspace";
import { ComingSoonModal } from "../components/ComingSoonModal";
import { Footer } from "../components/Footer";
import { Calendar } from "../components/Calendar";

export default function Home() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [today, setToday] = useState<Date | null>(null);

  // Set 'today' and keep it updated
  useEffect(() => {
    // Initial set
    setToday(startOfDay(new Date()));

    // Function to update date if it has changed
    const updateDate = () => {
      const now = startOfDay(new Date());
      setToday((prev) => {
        if (!prev) return now;
        // Only update if the day has changed to avoid unnecessary re-renders
        if (now.getTime() !== prev.getTime()) {
          return now;
        }
        return prev;
      });
    };

    // Calculate time until next midnight and set timer
    const scheduleNextUpdate = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const msUntilMidnight = tomorrow.getTime() - now.getTime();

      return setTimeout(() => {
        updateDate();
        // Reschedule for the next midnight after update
        timerId = scheduleNextUpdate();
      }, msUntilMidnight);
    };

    let timerId = scheduleNextUpdate();

    // Check on visibility change (tab switch/window minimize)
    // This acts as a backup if the timer doesn't fire due to sleep
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        updateDate();
        // Reset timer on wake/visibility to ensure accuracy
        clearTimeout(timerId);
        timerId = scheduleNextUpdate();
      }
    };

    // Check on window focus (clicking back into the window)
    const handleFocus = () => {
      updateDate();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearTimeout(timerId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [events, setEvents] = useState<Record<string, DayWorkspaceData>>({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if user has seen the Coming Soon modal
  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenComingSoonModal");
    if (!hasSeen) {
      setShowWelcomeModal(true);
      localStorage.setItem("hasSeenComingSoonModal", "true");
    }
  }, []);

  // Initialize theme based on system or local storage (optional)
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          "https://calendar-buddy-bkend.onrender.com/events",
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          const eventsMap: Record<string, DayWorkspaceData> = {};
          data.forEach((evt: any) => {
            eventsMap[evt.date] = {
              note: evt.note,
              stickies: evt.stickies,
            };
          });
          setEvents(eventsMap);
        }
      } catch (error) {
        console.error("Failed to fetch events", error);
      }
    };
    fetchEvents();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    setShowEventModal(true);
  };

  const handleSaveEvent = async (data: DayWorkspaceData) => {
    if (!selectedDate) return;
    const dateKey = format(selectedDate, "yyyy-MM-dd");

    // Update local state immediately
    setEvents((prev) => ({
      ...prev,
      [dateKey]: data,
    }));

    // Save to backend
    try {
      await fetch("https://calendar-buddy-bkend.onrender.com/events/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          date: dateKey,
          note: data.note,
          stickies: data.stickies,
        }),
      });
    } catch (error) {
      console.error("Failed to save event", error);
    }

    setShowEventModal(false);
  };

  return (
    <div className="w-full font-mono text-foreground transition-colors duration-300 flex flex-col items-center relative overflow-hidden">
      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
      />

      {/* Top Header */}
      <Navbar
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        mounted={true}
      />

      {/* Main Content Area */}
      <div className="w-full p-2 md:p-2 flex flex-col items-center">
        {/* Calendar Component */}
        <Calendar
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          events={events}
          onDateClick={handleDateClick}
          today={today || new Date()} // Fallback for initial render, effectively client-side
        />

        {/* Footer Year */}
        <Footer currentDate={currentDate} />
      </div>

      {/* Full Screen Whiteboard Workspace */}
      <WhiteboardWorkspace
        isOpen={showEventModal}
        selectedDate={selectedDate}
        initialData={
          selectedDate
            ? events[format(selectedDate, "yyyy-MM-dd")] || {
                note: "",
                stickies: [],
              }
            : { note: "", stickies: [] }
        }
        onClose={() => setShowEventModal(false)}
        onSave={handleSaveEvent}
      />
    </div>
  );
}
