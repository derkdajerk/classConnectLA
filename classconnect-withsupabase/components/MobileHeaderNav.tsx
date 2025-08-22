"use client";

import React from "react";
import Link from "next/link";
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
  X,
  MapPin,
  SlidersHorizontal,
  CalendarDaysIcon,
  Clock,
} from "lucide-react";
import { MobileTimeSelector } from "./MobileTimeSelector";
import Calendar08 from "./calendar-08";

interface TimeRange {
  start: string;
  end: string;
}

interface MobileHeaderNavProps {
  // Search functionality
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  // Time filtering
  timeRange: TimeRange;
  onTimeChange: (range: TimeRange) => void;

  // Calendar functionality
  selectedDate: Date;
  onCalendarDateSelect: (date: Date | undefined) => void;
  getDisabledDates: () => { before: Date };
  calendarOpen: boolean;
  setCalendarOpen: (open: boolean) => void;

  // Optional customization
  title?: string;
  showSearch?: boolean;
  showTimeFilter?: boolean;
  showCalendar?: boolean;
}

const MobileHeaderNav: React.FC<MobileHeaderNavProps> = ({
  searchTerm,
  setSearchTerm,
  timeRange,
  onTimeChange,
  selectedDate,
  onCalendarDateSelect,
  getDisabledDates,
  calendarOpen,
  setCalendarOpen,
  title = "ClassConnectLA",
  showSearch = true,
  showTimeFilter = true,
  showCalendar = true,
}) => {
  return (
    <div className="flex items-center justify-between bg-gray-200 dark:bg-gray-950 px-4 py-3 sticky top-0 z-50">
      <Link href={"/"} className="flex items-center">
        <MapPin className="h-6 w-6 mr-2" />
        <h1 className="text-xl font-bold">{title}</h1>
      </Link>

      <div className="flex gap-2">
        {/* Time Filter */}
        {showTimeFilter && (
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
                    onTimeChange={onTimeChange}
                    value={timeRange}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Calendar */}
        {showCalendar && (
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
                  onSelect={onCalendarDateSelect}
                  disabled={getDisabledDates()}
                  defaultMonth={selectedDate}
                  className="rounded-3xl border shadow-sm bg-background"
                />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Search */}
        {showSearch && (
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
        )}
      </div>
    </div>
  );
};

export default MobileHeaderNav;
