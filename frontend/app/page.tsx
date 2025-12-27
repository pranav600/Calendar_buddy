"use client";

import { useState, useEffect } from "react";
import { startOfDay, format } from "date-fns";
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
  const [now, setNow] = useState<Date>(new Date());

  // Live clock to keep date fresh all day
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60 * 1000); // update every minute

    return () => clearInterval(interval);
  }, []);

  // Always derive today from current time
  const today = startOfDay(now);

  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [events, setEvents] = useState<Record<string, DayWorkspaceData>>({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Coming Soon modal (first visit)
  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenComingSoonModal");
    if (!hasSeen) {
      setShowWelcomeModal(true);
      localStorage.setItem("hasSeenComingSoonModal", "true");
    }
  }, []);

  // Theme init
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          "https://calendar-buddy-bkend.onrender.com/events",
          { credentials: "include" }
        );

        if (res.ok) {
          const data = await res.json();
          const map: Record<string, DayWorkspaceData> = {};
          data.forEach((evt: any) => {
            map[evt.date] = {
              note: evt.note,
              stickies: evt.stickies,
            };
          });
          setEvents(map);
        }
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };

    fetchEvents();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
    localStorage.theme = !isDarkMode ? "dark" : "light";
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    setShowEventModal(true);
  };

  const handleSaveEvent = async (data: DayWorkspaceData) => {
    if (!selectedDate) return;

    const dateKey = format(selectedDate, "yyyy-MM-dd");

    setEvents((prev) => ({
      ...prev,
      [dateKey]: data,
    }));

    try {
      await fetch("https://calendar-buddy-bkend.onrender.com/events/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          date: dateKey,
          note: data.note,
          stickies: data.stickies,
        }),
      });
    } catch (err) {
      console.error("Failed to save event", err);
    }

    setShowEventModal(false);
  };

  return (
    <div className="w-full font-mono flex flex-col items-center overflow-hidden">
      <ComingSoonModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
      />

      <Navbar
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        mounted={true}
      />

      <div className="w-full p-2 flex flex-col items-center">
        <Calendar
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          events={events}
          onDateClick={handleDateClick}
          today={today}
        />

        <Footer currentDate={currentDate} />
      </div>

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