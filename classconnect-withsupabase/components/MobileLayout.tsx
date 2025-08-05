/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Search as SearchIcon,
  Calendar,
  X,
  Home,
  Bookmark,
  User,
  MoreHorizontal,
  MapPin,
  CalendarIcon,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import ClassScrollBar from "./ClassScrollBar";
import { Progress } from "./ui/progress";
import Image from "next/image";
import Link from "next/link";
import {
  fetchStudioClassesByDateAndTime,
  fetchStudioClassesBySearchAndTime,
} from "./SupabaseCalls";
import { DanceClass } from "@/lib/danceclass";

interface MobileLayoutProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const studios = [
  { id: "MDC", name: "MDC" },
  { id: "TMILLY", name: "TMILLY" },
  { id: "ML", name: "ML" },
  { id: "PLAYGROUND", name: "PLAYGROUND" },
  { id: "EIGHTYEIGHT", name: "EIGHTYEIGHT" },
];

const MobileLayout: React.FC<MobileLayoutProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  // State for mobile components
  const [openStudioId, setOpenStudioId] = useState<string>(studios[0]?.id);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dates, setDates] = useState<Date[]>([]);
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState<Date>(
    new Date()
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [danceClasses, setDanceClasses] = useState<
    Record<string, DanceClass[]>
  >({
    MDC: [],
    TMILLY: [],
    ML: [],
    PLAYGROUND: [],
    EIGHTYEIGHT: [],
  });
  const [timeRange] = useState({ start: "", end: "" });

  // Generate dates for a specific week
  const generateWeekDates = (startDate: Date) => {
    const newWeekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date;
    });
    return newWeekDates;
  };

  // Initialize dates for the current week, starting from today
  useEffect(() => {
    const today = new Date();
    // Set hours to 0 to avoid time comparison issues
    today.setHours(0, 0, 0, 0);

    // Set current week start date to today
    setCurrentWeekStartDate(today);

    // Generate dates for the current week
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });
    setDates(weekDates);

    // Set today as the initial selected date
    setSelectedDate(today);
  }, []);

  // Format date for API
  const formatDateForApi = (date: Date): string => {
    return date.toLocaleDateString("en-CA");
  };

  // Loading progress effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (isLoading) {
      setProgress(0);
      intervalId = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            if (intervalId) clearInterval(intervalId);
            return 90;
          }
          return prev + 10;
        });
      }, 4);
    } else {
      setProgress(100);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLoading]);

  // Load classes when date or studio changes
  useEffect(() => {
    const loadClassesForStudio = async () => {
      if (!openStudioId) return;

      setIsLoading(true);
      try {
        const formattedDate = formatDateForApi(selectedDate);

        let classes;
        if (searchTerm.trim()) {
          classes = await fetchStudioClassesBySearchAndTime(
            openStudioId,
            searchTerm,
            timeRange
          );
        } else {
          classes = await fetchStudioClassesByDateAndTime(
            openStudioId,
            formattedDate,
            timeRange
          );
        }

        setDanceClasses((prev) => ({
          ...prev,
          [openStudioId]: classes,
        }));
      } catch (error) {
        console.error(`Error fetching classes: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadClassesForStudio();
  }, [openStudioId, selectedDate, searchTerm, timeRange]);

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const prevWeekStart = new Date(currentWeekStartDate);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    setCurrentWeekStartDate(prevWeekStart);
    setDates(generateWeekDates(prevWeekStart));
  };

  // Navigate to next week
  const goToNextWeek = () => {
    const nextWeekStart = new Date(currentWeekStartDate);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    setCurrentWeekStartDate(nextWeekStart);
    setDates(generateWeekDates(nextWeekStart));
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <main className="flex flex-col w-full h-[100dvh] fixed inset-0 overflow-hidden pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-950 px-4 py-3 sticky top-0 z-50">
        <Link href={"/"} className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          <h1 className="text-2xl font-bold">ClassConnectLA</h1>
        </Link>
        <div className="flex gap-3">
          <Button size="icon" variant="ghost">
            <CalendarIcon className="h-5 w-5" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost">
                <SearchIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top">
              <div className="flex gap-2 pt-4">
                <Input
                  placeholder="Search classes or instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                {searchTerm && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Studio Navigation Tabs */}
      <div className="flex whitespace-nowrap py-3 px-4 border-b bg-white dark:bg-gray-950 shadow-sm mx-auto w-full">
        {studios.map((studio) => (
          <button
            key={studio.id}
            className={`px-4 py-2 text-sm font-medium mx-1 rounded-md ${
              openStudioId === studio.id
                ? "bg-primary/10 text-primary font-semibold"
                : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => setOpenStudioId(studio.id)}
          >
            {studio.name}
          </button>
        ))}
      </div>

      {/* Circular Date Picker with Swipe Navigation */}
      <div className="py-4 bg-white dark:bg-gray-950 border-b relative">
        {/* Date scrolling container - page-like swipe */}
        <div className="relative overflow-hidden w-full">
          <div
            className="flex justify-between w-full px-4 pb-1 touch-pan-x transition-transform duration-300 ease-out"
            style={{ transform: `translateX(0px)` }}
            id="date-container"
            onTouchStart={(e) => {
              const container = e.currentTarget;
              container.dataset.touchStartX = e.touches[0].clientX.toString();
            }}
            onTouchEnd={(e) => {
              const container = e.currentTarget;
              const touchEndX = e.changedTouches[0].clientX;
              const touchStartX = parseInt(
                container.dataset.touchStartX || "0"
              );
              const swipeDistance = touchEndX - touchStartX;

              // If swiped left significantly, go to next week
              if (swipeDistance < -50) {
                goToNextWeek();
                // Animation effect
                container.style.transform = "translateX(-50px)";
                setTimeout(() => {
                  container.style.transition = "none";
                  container.style.transform = "translateX(0px)";
                  setTimeout(() => {
                    container.style.transition = "transform 300ms ease-out";
                  }, 50);
                }, 300);
              }
              // If swiped right significantly, go to previous week
              else if (swipeDistance > 50) {
                goToPreviousWeek();
                // Animation effect
                container.style.transform = "translateX(50px)";
                setTimeout(() => {
                  container.style.transition = "none";
                  container.style.transform = "translateX(0px)";
                  setTimeout(() => {
                    container.style.transition = "transform 300ms ease-out";
                  }, 50);
                }, 300);
              }
            }}
          >
            {dates.map((date, index) => {
              const isToday = new Date().toDateString() === date.toDateString();
              const isSelected =
                selectedDate.toDateString() === date.toDateString();
              const day = date.getDate();
              const dayOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][
                date.getDay()
              ];

              return (
                <div
                  key={date.toISOString()}
                  className="flex flex-col items-center"
                  style={{ width: `${100 / 7}%` }}
                >
                  <button
                    onClick={() => handleDateSelect(date)}
                    className="flex flex-col items-center focus:outline-none w-full"
                    type="button"
                  >
                    <div
                      className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full shadow-sm 
                        ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : isToday
                            ? "border-2 border-primary"
                            : "bg-background border border-gray-300 dark:border-gray-700"
                        }
                      `}
                    >
                      <span className="text-lg font-medium">{day}</span>
                    </div>
                    <span className="text-xs mt-1 font-medium">
                      {index === 0 && isToday ? "Today" : dayOfWeek}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Left/right swipe indicators (subtle visual cues) */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-16 bg-gradient-to-r from-white/40 to-transparent dark:from-gray-950/40 pointer-events-none"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-16 bg-gradient-to-l from-white/40 to-transparent dark:from-gray-950/40 pointer-events-none"></div>
      </div>

      {/* Loading Indicator */}
      <div className="px-4">
        {isLoading && <Progress value={progress} className="h-1" />}
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2 w-full">
          {openStudioId ? (
            <Card className="overflow-hidden w-full border rounded-lg p-0">
              <CardContent className="p-0">
                <div className="">
                  <ClassScrollBar
                    studioName={openStudioId}
                    danceClassList={danceClasses[openStudioId] || []}
                    isSearchTerm={Boolean(searchTerm?.trim())}
                    isMobile={true}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a studio to view classes
            </div>
          )}
        </div>
      </div>

      {/* iOS-style Bottom Navigation */}
      <div className="flex items-center justify-around bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-2 px-4 mt-auto pb-[env(safe-area-inset-bottom)] sticky bottom-0">
        <button className="flex flex-col items-center justify-center p-2 text-primary">
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <Calendar className="h-5 w-5" />
          <span className="text-xs mt-1">Schedule</span>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <Bookmark className="h-5 w-5" />
          <span className="text-xs mt-1">Saved</span>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <MoreHorizontal className="h-5 w-5" />
          <span className="text-xs mt-1">More</span>
        </button>
      </div>
    </main>
  );
};

export default MobileLayout;
