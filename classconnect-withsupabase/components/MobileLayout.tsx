"use client";

import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  Search as SearchIcon,
  Calendar,
  X,
  Home,
  Bookmark,
  User,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Separator } from "./ui/separator";
import ClassScrollBar from "./ClassScrollBar";
import { Progress } from "./ui/progress";
import Image from "next/image";
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

  // Generate dates for a week
  useEffect(() => {
    const today = new Date();
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });
    setDates(weekDates);
  }, []);

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

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

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <main className="flex flex-col w-full h-[100dvh] fixed inset-0 overflow-hidden pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-950 px-4 py-3 sticky top-0 z-50">
        <h1 className="text-lg font-bold">ClassConnectLA</h1>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <SearchIcon className="h-4 w-4" />
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

      {/* Date Picker */}
      <div className="px-4 py-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full flex justify-between">
              <span>{formatDate(selectedDate)}</span>
              <Calendar className="ml-2 h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <div className="grid grid-cols-3 gap-2">
              {dates.map((date) => (
                <Button
                  key={date.toISOString()}
                  variant={
                    date.toDateString() === selectedDate.toDateString()
                      ? "default"
                      : "outline"
                  }
                  onClick={() => {
                    handleDateSelect(date);
                  }}
                  className="w-full"
                >
                  {formatDate(date)}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading Indicator */}
      <div className="px-4">
        {isLoading && <Progress value={progress} className="h-1" />}
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2 space-y-2 w-full">
          {studios.map((studio) => (
            <Card key={studio.id} className="overflow-hidden w-full">
              <button
                className="flex w-full items-center justify-between p-3"
                onClick={() =>
                  setOpenStudioId(openStudioId === studio.id ? "" : studio.id)
                }
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={`/${studio.id}.webp`}
                    alt={studio.name}
                    width={30}
                    height={30}
                    className="rounded-sm"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="font-semibold">{studio.name}</span>
                </div>
                {openStudioId === studio.id ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              {openStudioId === studio.id && (
                <>
                  <Separator />
                  <CardContent className="p-0">
                    <div className="py-2">
                      <ClassScrollBar
                        studioName={studio.id}
                        danceClassList={danceClasses[studio.id] || []}
                        isSearchTerm={Boolean(searchTerm?.trim())}
                        isMobile={true}
                      />
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* iOS-style Bottom Navigation */}
      <div className="flex items-center justify-around bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-2 px-4 mt-auto pb-[env(safe-area-inset-bottom)] sticky bottom-0">
        <button className="flex flex-col items-center justify-center p-2 text-primary">
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <Calendar className="h-6 w-6" />
          <span className="text-xs mt-1">Schedule</span>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <Bookmark className="h-6 w-6" />
          <span className="text-xs mt-1">Saved</span>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <MoreHorizontal className="h-6 w-6" />
          <span className="text-xs mt-1">More</span>
        </button>
      </div>
    </main>
  );
};

export default MobileLayout;
