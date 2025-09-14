/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Pagination } from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import DateNavigation from "./DateNavigation";
import ClassContent from "./ClassContent";
import {
  fetchStudioClassesBySearchAndTime,
  fetchStudioClassesByDateAndTime,
} from "./SupabaseCalls";
import ClassCheckBoxs from "./ClassCheckBoxs";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { DanceClass } from "../lib/danceclass";

interface AllPageContentProps {
  searchTerm: string;
}

interface TimeRange {
  start: string;
  end: string;
}

interface StudioVisibility {
  MDC: boolean;
  TMILLY: boolean;
  ML: boolean;
  PLAYGROUND: boolean;
  EIGHTYEIGHT: boolean;
  THESIX: boolean;
}

const AllPageContent = ({ searchTerm }: AllPageContentProps) => {
  const today = new Date();
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + 6);

  // State declarations with proper types
  const [dates, setDates] = useState<Date[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState<Date>(today);
  const [currentWeekEndDate, setCurrentWeekEndDate] = useState<Date>(endOfWeek);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [danceClassMDC, setDanceClassMDC] = useState<DanceClass[]>([]);
  const [danceClassTMILLY, setDanceClassTMILLY] = useState<DanceClass[]>([]);
  const [danceClassML, setDanceClassML] = useState<DanceClass[]>([]);
  const [danceClassEIGHTYEIGHT, setDanceClassEIGHTYEIGHT] = useState<
    DanceClass[]
  >([]);
  const [danceClassPLAYGROUND, setDanceClassPLAYGROUND] = useState<
    DanceClass[]
  >([]);
  const [danceClassTHESIX, setDanceClassTHESIX] = useState<DanceClass[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>({ start: "", end: "" });
  const [studioVisibility, setStudioVisibility] = useState<StudioVisibility>({
    MDC: true,
    TMILLY: true,
    ML: true,
    PLAYGROUND: false,
    EIGHTYEIGHT: false,
    THESIX: false,
  });
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);

  const weekDates = useMemo<Date[]>(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentWeekStartDate);
      date.setDate(currentWeekStartDate.getDate() + i);
      return date;
    });
  }, [currentWeekStartDate]);

  useEffect(() => {
    setDates(weekDates);
  }, [weekDates]);

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

  // Add this after other useEffects
  useEffect(() => {
    if (dates.length > 0) {
      const formattedDate = formatDate(dates[selectedIndex]);
      loadClassesByDateAndTime(formattedDate);
    }
  }, [dates]); // This will load initial data when dates are set

  useEffect(() => {
    if (dates[selectedIndex]) {
      const formattedDate = formatDate(dates[selectedIndex]);
      loadClassesByDateAndTime(formattedDate);
    }
  }, [selectedIndex, dates]); // Add this useEffect to handle date changes

  useEffect(() => {
    if (searchTerm.trim()) {
      loadClassesBySearchAndTime(searchTerm);
    } else {
      // If search is cleared, load classes for current selected date
      if (dates[selectedIndex]) {
        const formattedDate = formatDate(dates[selectedIndex]);
        loadClassesByDateAndTime(formattedDate);
      }
    }
  }, [searchTerm]); // Add searchTerm as dependency

  const formatDate = (date: Date): string => {
    const localDate = new Date(date);
    return localDate.toLocaleDateString("en-CA");
  };

  const handleDateClick = (index: number): void => {
    setSelectedIndex(index);
    if (!searchTerm.trim()) {
      // Only load date-specific classes if there's no search term
      const formattedDate = formatDate(dates[index]);
      loadClassesByDateAndTime(formattedDate);
    }
  };

  const handlePreviousClick = (): void => {
    const newStart = new Date(currentWeekStartDate);
    newStart.setDate(currentWeekStartDate.getDate() - 7);
    const newEnd = new Date(currentWeekEndDate);
    newEnd.setDate(currentWeekEndDate.getDate() - 7);

    setCurrentWeekStartDate(newStart);
    setCurrentWeekEndDate(newEnd);
    setSelectedIndex(0);
  };

  const handleNextClick = (): void => {
    const newStart = new Date(currentWeekStartDate);
    newStart.setDate(currentWeekStartDate.getDate() + 7);
    const newEnd = new Date(currentWeekEndDate);
    newEnd.setDate(currentWeekEndDate.getDate() + 7);

    setCurrentWeekStartDate(newStart);
    setCurrentWeekEndDate(newEnd);
    setSelectedIndex(0);
  };

  const isPreviousDisabled = useCallback((): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekStartDate = new Date(currentWeekStartDate);
    weekStartDate.setHours(0, 0, 0, 0);

    return weekStartDate.getTime() <= today.getTime();
  }, [currentWeekStartDate]);

  const isNextDisabled = useCallback((): boolean => {
    const threeWeeksFromToday = new Date(today);
    threeWeeksFromToday.setDate(today.getDate() + 14);

    return currentWeekEndDate.getTime() >= threeWeeksFromToday.getTime();
  }, [currentWeekEndDate]);

  const loadClassesBySearchAndTime = async (
    searchTerm: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const [
        mdcClasses,
        tmillyClasses,
        mlClasses,
        eightyeightClasses,
        playgroundClasses,
        thesixClasses,
      ] = await Promise.all([
        fetchStudioClassesBySearchAndTime("MDC", searchTerm, timeRange),
        fetchStudioClassesBySearchAndTime("TMILLY", searchTerm, timeRange),
        fetchStudioClassesBySearchAndTime("ML", searchTerm, timeRange),
        fetchStudioClassesBySearchAndTime("EIGHTYEIGHT", searchTerm, timeRange),
        fetchStudioClassesBySearchAndTime("PLAYGROUND", searchTerm, timeRange),
        fetchStudioClassesBySearchAndTime("THESIX", searchTerm, timeRange),
      ]);
      setDanceClassMDC(mdcClasses);
      setDanceClassTMILLY(tmillyClasses);
      setDanceClassML(mlClasses);
      setDanceClassEIGHTYEIGHT(eightyeightClasses);
      setDanceClassPLAYGROUND(playgroundClasses);
      setDanceClassTHESIX(thesixClasses);
    } catch (error) {
      console.error(`Error finding teacher: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadClassesByDateAndTime = async (date: string): Promise<void> => {
    setIsLoading(true);
    // console.log(`loadclassesbydateandtime: ${timeRange.start}`);
    try {
      const [
        mdcClasses,
        tmillyClasses,
        mlClasses,
        eightyeightClasses,
        playgroundClasses,
        thesixClasses,
      ] = await Promise.all([
        fetchStudioClassesByDateAndTime("MDC", date, timeRange),
        fetchStudioClassesByDateAndTime("TMILLY", date, timeRange),
        fetchStudioClassesByDateAndTime("ML", date, timeRange),
        fetchStudioClassesByDateAndTime("EIGHTYEIGHT", date, timeRange),
        fetchStudioClassesByDateAndTime("PLAYGROUND", date, timeRange),
        fetchStudioClassesByDateAndTime("THESIX", date, timeRange),
      ]);
      setDanceClassMDC(mdcClasses);
      setDanceClassTMILLY(tmillyClasses);
      setDanceClassML(mlClasses);
      setDanceClassEIGHTYEIGHT(eightyeightClasses);
      setDanceClassPLAYGROUND(playgroundClasses);
      setDanceClassTHESIX(thesixClasses);
    } catch (error) {
      console.error(`Error fetching classes: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadClassesByDateAndTimeWithRange = async (
    date: string,
    timeRange: TimeRange
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const [
        mdcClasses,
        tmillyClasses,
        mlClasses,
        eightyeightClasses,
        playgroundClasses,
        thesixClasses,
      ] = await Promise.all([
        fetchStudioClassesByDateAndTime("MDC", date, timeRange),
        fetchStudioClassesByDateAndTime("TMILLY", date, timeRange),
        fetchStudioClassesByDateAndTime("ML", date, timeRange),
        fetchStudioClassesByDateAndTime("EIGHTYEIGHT", date, timeRange),
        fetchStudioClassesByDateAndTime("PLAYGROUND", date, timeRange),
        fetchStudioClassesByDateAndTime("THESIX", date, timeRange),
      ]);
      setDanceClassMDC(mdcClasses);
      setDanceClassTMILLY(tmillyClasses);
      setDanceClassML(mlClasses);
      setDanceClassEIGHTYEIGHT(eightyeightClasses);
      setDanceClassPLAYGROUND(playgroundClasses);
      setDanceClassTHESIX(thesixClasses);
    } catch (error) {
      console.error(`Error fetching classes: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadClassesBySearchAndTimeWithRange = async (
    searchTerm: string,
    timeRange: TimeRange
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const [
        mdcClasses,
        tmillyClasses,
        mlClasses,
        eightyeightClasses,
        playgroundClasses,
        thesixClasses,
      ] = await Promise.all([
        fetchStudioClassesBySearchAndTime("MDC", searchTerm, timeRange),
        fetchStudioClassesBySearchAndTime("TMILLY", searchTerm, timeRange),
        fetchStudioClassesBySearchAndTime("ML", searchTerm, timeRange),
        fetchStudioClassesBySearchAndTime("EIGHTYEIGHT", searchTerm, timeRange),
        fetchStudioClassesBySearchAndTime("PLAYGROUND", searchTerm, timeRange),
        fetchStudioClassesBySearchAndTime("THESIX", searchTerm, timeRange),
      ]);
      setDanceClassMDC(mdcClasses);
      setDanceClassTMILLY(tmillyClasses);
      setDanceClassML(mlClasses);
      setDanceClassEIGHTYEIGHT(eightyeightClasses);
      setDanceClassPLAYGROUND(playgroundClasses);
      setDanceClassTHESIX(thesixClasses);
    } catch (error) {
      console.error(`Error finding teacher: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeChange = ({ start, end }: TimeRange): void => {
    setTimeRange({ start, end });

    const newTimeRange = { start, end };

    if (searchTerm.trim()) {
      loadClassesBySearchAndTimeWithRange(searchTerm, newTimeRange);
    } else {
      const formattedDate = formatDate(dates[selectedIndex]);
      loadClassesByDateAndTimeWithRange(formattedDate, newTimeRange);
    }
  };

  // Month calendar selection handler (reused from Mobile)
  const handleCalendarDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // start of week (Sunday)

    setCurrentWeekStartDate(weekStart);
    setCurrentWeekEndDate(() => {
      const end = new Date(weekStart);
      end.setDate(weekStart.getDate() + 6);
      return end;
    });
    setSelectedIndex(date.getDay());
    setCalendarOpen(false);
  };

  const getDisabledDates = () => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return { before: t };
  };

  const handleVisibilityChange = (
    studioName: keyof StudioVisibility,
    isVisible: boolean
  ): void => {
    setStudioVisibility((prev) => ({
      ...prev,
      [studioName]: isVisible,
    }));
  };

  return (
    <div className="flex flex-col items-center w-full mx-auto px-4 max-md:px-2">
      <ClassCheckBoxs onVisibilityChange={handleVisibilityChange} />
      <Pagination className="mt-5">
        <DateNavigation
          dates={dates}
          selectedIndex={selectedIndex}
          onDateClick={handleDateClick}
          onPrevious={handlePreviousClick}
          onNext={handleNextClick}
          isPreviousDisabled={isPreviousDisabled}
          isNextDisabled={isNextDisabled}
        />
      </Pagination>
      <div
        id="timeboxes"
        className="mt-4 w-full flex flex-col items-center justify-between gap-3"
      >
        <TimeRangeSelector onTimeChange={handleTimeChange} value={timeRange} />
      </div>

      <div className="flex justify-center w-full mb-2 mt-2">
        {isLoading && <Progress value={progress} />}
      </div>

      <ClassContent
        danceClassMDC={danceClassMDC}
        danceClassTMILLY={danceClassTMILLY}
        danceClassML={danceClassML}
        danceClassEIGHTYEIGHT={danceClassEIGHTYEIGHT}
        danceClassPLAYGROUND={danceClassPLAYGROUND}
        danceClassTHESIX={danceClassTHESIX}
        studioVisibility={studioVisibility}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default AllPageContent;
