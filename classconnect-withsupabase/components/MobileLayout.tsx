/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
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
  SlidersHorizontal,
  CalendarDaysIcon,
  Clock,
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
import { MobileTimeSelector } from "./MobileTimeSelector";
import Calendar08 from "./calendar-08";
import BottomNavBarMobile from "./BottomNavBarMobile";

interface MobileLayoutProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  debouncedSearchTerm: string;
}

interface TimeRange {
  start: string;
  end: string;
}

const studios = [
  { id: "MDC", name: "MDC" },
  { id: "TMILLY", name: "TMILLY" },
  { id: "ML", name: "ML" },
  { id: "PLAYGROUND", name: "PLAYGROUND" },
  { id: "EIGHTYEIGHT", name: "88" },
  { id: "THESIX", name: "THE SIX" },
];

const MobileLayout: React.FC<MobileLayoutProps> = ({
  searchTerm,
  setSearchTerm,
  debouncedSearchTerm,
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
    THESIX: [],
  });
  const [timeRange, setTimeRange] = useState<TimeRange>({ start: "", end: "" });
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);

  // Refs for smooth horizontal dragging on date strip
  const dateContainerRef = useRef<HTMLDivElement | null>(null);
  const baseTranslateXRef = useRef<number>(0);
  const touchStartXRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const currentTranslateXRef = useRef<number>(0);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

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
        if (debouncedSearchTerm.trim()) {
          classes = await fetchStudioClassesBySearchAndTime(
            openStudioId,
            debouncedSearchTerm,
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
  }, [openStudioId, selectedDate, debouncedSearchTerm, timeRange]);

  const handleTimeChange = ({ start, end }: TimeRange): void => {
    setTimeRange({ start, end });
  };

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

  // Handle date selection from calendar
  const handleCalendarDateSelect = (date: Date | undefined) => {
    if (!date) return;

    // Set the selected date
    setSelectedDate(date);

    // Update the current week to show the week containing the selected date
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    setCurrentWeekStartDate(weekStart);
    setDates(generateWeekDates(weekStart));

    // Close the calendar sheet
    setCalendarOpen(false);
  };

  // Get disabled dates for calendar (disable all days before today)
  const getDisabledDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return { before: today };
  };

  // Smooth drag handlers for date strip
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const container = dateContainerRef.current;
    if (!container) return;
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    isDraggingRef.current = true;
    touchStartXRef.current = event.touches[0].clientX;
    currentTranslateXRef.current = 0;
    container.style.transition = "none";
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const container = dateContainerRef.current;
    if (!container || !isDraggingRef.current) return;
    const currentX = event.touches[0].clientX;
    const deltaX = currentX - touchStartXRef.current;
    currentTranslateXRef.current = deltaX;
    container.style.transform = `translateX(${
      baseTranslateXRef.current + deltaX
    }px)`;
  };

  const animateToAndThenReset = (
    targetTranslateX: number,
    onAfter?: () => void
  ) => {
    const container = dateContainerRef.current;
    if (!container) return;
    container.style.transition = "transform 280ms ease-out";
    container.style.transform = `translateX(${targetTranslateX}px)`;
    animationTimeoutRef.current = setTimeout(() => {
      // After animation, caller will typically update week.
      // Do not force transform to 0; the caller will recenter.
      container.style.transition = "none";
      if (onAfter) onAfter();
    }, 280);
  };

  const handleTouchEnd = () => {
    const container = dateContainerRef.current;
    if (!container) return;
    const pageWidth = container.parentElement?.clientWidth || window.innerWidth;
    const threshold = Math.max(40, Math.floor(pageWidth * 0.18)); // ~18% of width, min 40px
    const finalDelta = currentTranslateXRef.current;

    isDraggingRef.current = false;

    // Decide action based on drag distance
    if (finalDelta <= -threshold) {
      // Slide left to next week (to the third page)
      animateToAndThenReset(baseTranslateXRef.current - pageWidth, () => {
        // Update week to next and recenter to middle page without animation
        const nextWeekStart = new Date(currentWeekStartDate);
        nextWeekStart.setDate(nextWeekStart.getDate() + 7);
        setCurrentWeekStartDate(nextWeekStart);
        setDates(generateWeekDates(nextWeekStart));
        // Keep the selected day aligned by advancing it a week
        const nextSelected = new Date(selectedDate);
        nextSelected.setDate(nextSelected.getDate() + 7);
        setSelectedDate(nextSelected);
      });
    } else if (finalDelta >= threshold) {
      // Slide right to previous week (to the first page)
      animateToAndThenReset(baseTranslateXRef.current + pageWidth, () => {
        const prevWeekStart = new Date(currentWeekStartDate);
        prevWeekStart.setDate(prevWeekStart.getDate() - 7);
        setCurrentWeekStartDate(prevWeekStart);
        setDates(generateWeekDates(prevWeekStart));
        // Keep the selected day aligned by moving it back a week
        const prevSelected = new Date(selectedDate);
        prevSelected.setDate(prevSelected.getDate() - 7);
        setSelectedDate(prevSelected);
      });
    } else {
      // Not enough drag, snap back smoothly to middle page
      animateToAndThenReset(baseTranslateXRef.current);
    }
  };

  // Cleanup pending animation timers on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Keep the track centered on the current week page. Do not move on day selection.
  useEffect(() => {
    const container = dateContainerRef.current;
    if (!container) return;
    const width = container.parentElement?.clientWidth || window.innerWidth;
    baseTranslateXRef.current = -width;
    container.style.transition = "none";
    container.style.transform = `translateX(${baseTranslateXRef.current}px)`;
  }, [currentWeekStartDate]);

  // Helpers to render a week's dates
  const renderWeekDates = (weekDates: Date[]) => (
    <div className="flex justify-between w-full px-4 pb-1">
      {weekDates.map((date, index) => {
        const isToday = new Date().toDateString() === date.toDateString();
        const isSelected = selectedDate.toDateString() === date.toDateString();
        const day = date.getDate();
        const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
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
  );

  // Compute prev/current/next week arrays
  const prevWeekStartForView = new Date(currentWeekStartDate);
  prevWeekStartForView.setDate(prevWeekStartForView.getDate() - 7);
  const nextWeekStartForView = new Date(currentWeekStartDate);
  nextWeekStartForView.setDate(nextWeekStartForView.getDate() + 7);
  const prevWeekDates = generateWeekDates(prevWeekStartForView);
  const currentWeekDates = generateWeekDates(currentWeekStartDate);
  const nextWeekDates = generateWeekDates(nextWeekStartForView);

  return (
    <main className="flex flex-col w-full h-[100dvh] fixed inset-0 overflow-hidden pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-200 dark:bg-gray-950 px-4 py-3 sticky top-0 z-50">
        <Link href={"/"} className="flex items-center">
          <MapPin className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">ClassConnectLA</h1>
        </Link>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button iconSize="lg" variant="ghost" className="relative">
                {/** Clock summary indicator */}
                {(timeRange.start || timeRange.end) && (
                  <span className="absolute -top-1 -left-1 h-6 w-6 rounded-full text-primary-foreground grid place-items-center">
                    <Clock
                      className="h-0.5 w-0.5 z-0"
                      color="green"
                      strokeWidth={2}
                    />
                  </span>
                )}
                <SlidersHorizontal className="z-10" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="top"
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <div className="pt-4 space-y-3 w-full">
                <SheetHeader>
                  <SheetTitle>Filter by time</SheetTitle>
                </SheetHeader>
                <SheetDescription className="hidden">
                  Time Filtering
                </SheetDescription>
                <div className="w-full flex flex-col items-center justify-center">
                  <MobileTimeSelector
                    onTimeChange={handleTimeChange}
                    value={timeRange}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Sheet open={calendarOpen} onOpenChange={setCalendarOpen}>
            <SheetTrigger asChild>
              <Button iconSize="lg" variant="ghost">
                <CalendarDaysIcon />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="top"
              className="h-[65vh] bg-transparent border-none"
            >
              <SheetHeader>
                <SheetTitle></SheetTitle>
              </SheetHeader>
              <SheetDescription className="hidden">
                Month Day Selector
              </SheetDescription>
              <div className="flex justify-center items-center pt-6 pb-6 h-full">
                <Calendar08
                  selected={selectedDate}
                  onSelect={handleCalendarDateSelect}
                  disabled={getDisabledDates()}
                  defaultMonth={selectedDate}
                  className="rounded-3xl border shadow-sm bg-background"
                />
              </div>
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <Button iconSize="lg" variant="ghost">
                <SearchIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="top">
              <SheetHeader>
                <SheetTitle className="sr-only">Search</SheetTitle>
              </SheetHeader>
              <SheetDescription className="hidden">
                Search for Teachers, Styles, Classes
              </SheetDescription>
              <div className="flex gap-2 pt-4">
                <Input
                  placeholder="Search Teachers/Classes/Styles"
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
      <div className="flex whitespace-nowrap py-3 justify-around border-b bg-white dark:bg-gray-950 shadow-sm mx-auto w-full">
        {studios.map((studio) => (
          <button
            key={studio.id}
            className={`px-2 py-2 text-sm font-medium mx-1 rounded-md ${
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
        {/* Date scrolling container with prev/current/next pages */}
        <div className="relative overflow-hidden w-full">
          <div
            ref={dateContainerRef}
            className="flex w-[300%] touch-pan-x transition-transform duration-300 ease-out"
            style={{ transform: `translateX(0px)` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Previous week */}
            <div className="w-full">{renderWeekDates(prevWeekDates)}</div>
            {/* Current week */}
            <div className="w-full">{renderWeekDates(currentWeekDates)}</div>
            {/* Next week */}
            <div className="w-full">{renderWeekDates(nextWeekDates)}</div>
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
                    isSearchTerm={Boolean(debouncedSearchTerm?.trim())}
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
      <BottomNavBarMobile />
    </main>
  );
};

export default MobileLayout;
