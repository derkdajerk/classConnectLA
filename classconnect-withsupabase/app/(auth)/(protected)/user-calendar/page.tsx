"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useMonthEvents, getEndTime } from "@/hooks/useMonthEvents";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  User,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import Calendar31Mobile from "@/components/calendar-31-mobile";
import { MapPin } from "lucide-react";
import Link from "next/link";
import BottomNavBarMobile from "@/components/BottomNavBarMobile";

type ViewType = "month" | "week" | "day";

export default function UserCalendar() {
  const [userId, setUserId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<ViewType>("month");
  const [isMobile, setIsMobile] = useState(false);
  const queryClient = useQueryClient();

  // Get current user
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  // Check if mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keep currentDate in sync with selectedDate when month changes
  useEffect(() => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    if (selectedMonth !== currentMonth || selectedYear !== currentYear) {
      setCurrentDate(new Date(selectedYear, selectedMonth, 1));
    }
  }, [selectedDate, currentDate]);

  const {
    data: events = [],
    isLoading,
    error,
  } = useMonthEvents(userId, currentDate);

  // Helper functions
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const removeFromSchedule = async (classId: string, className: string) => {
    if (!userId) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("user_schedule")
        .delete()
        .eq("user_id", userId)
        .eq("class_id", classId);

      if (error) throw error;

      // Invalidate and refetch calendar data
      queryClient.invalidateQueries({
        queryKey: ["user_schedule", userId],
      });

      toast.success(`${className} removed from calendar`);
    } catch (error) {
      console.error("Failed to remove from schedule:", error);
      toast.error("Failed to remove from calendar");
    }
  };

  // Navigation functions
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      const days = direction === "prev" ? -7 : 7;
      newDate.setDate(prev.getDate() + days);
      return newDate;
    });
  };

  const navigateDay = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      const days = direction === "prev" ? -1 : 1;
      newDate.setDate(prev.getDate() + days);
      return newDate;
    });
  };

  // Get events for specific date
  const getEventsForDate = (date: Date) => {
    // Format date as YYYY-MM-DD in local timezone to match database format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    return events.filter((event) => event.date === dateStr);
  };

  // Get events for current week
  const getEventsForWeek = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const weekEvents = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekEvents.push({
        date,
        events: getEventsForDate(date),
      });
    }
    return weekEvents;
  };

  // Mobile View using Calendar31Mobile
  if (isMobile) {
    return (
      <main className="flex flex-col w-full h-[100dvh] fixed inset-0 overflow-hidden pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
        {/* Header */}
        <div className="flex flex-col items-center justify-between bg-gray-200 dark:bg-gray-950 px-4 py-3 sticky top-0 z-50">
          <Link href={"/"} className="flex items-center">
            <MapPin className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">My Calendar</h1>
          </Link>
          <div className="flex gap-2">
            <div className="text-sm text-muted-foreground">
              {events.length} {events.length === 1 ? "class" : "classes"}
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your calendar...</p>
            </div>
          </div>
        )}

        {/* Calendar Content - Full Screen */}
        <div className="flex-1 overflow-y-auto p-4">
          <Calendar31Mobile
            selectedDate={selectedDate}
            onDateSelect={(date) => date && setSelectedDate(date)}
            events={events}
            onRemoveEvent={removeFromSchedule}
            formatTime={formatTime}
            getEndTime={getEndTime}
          />
        </div>

        {/* Bottom Navigation */}
        <BottomNavBarMobile />
      </main>
    );
  }

  // Desktop View
  const renderMonthView = () => {
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const firstDayOfGrid = new Date(firstDayOfMonth);
    firstDayOfGrid.setDate(firstDayOfGrid.getDate() - firstDayOfGrid.getDay());

    const days = [];
    const currentGridDate = new Date(firstDayOfGrid);

    for (let i = 0; i < 42; i++) {
      // 6 weeks * 7 days
      const dayEvents = getEventsForDate(currentGridDate);
      const isCurrentMonth =
        currentGridDate.getMonth() === currentDate.getMonth();
      const isToday =
        currentGridDate.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={currentGridDate.toISOString()}
          className={`min-h-[120px] border p-2 ${
            !isCurrentMonth
              ? "bg-muted/20 text-muted-foreground"
              : "bg-background"
          } ${isToday ? "bg-primary/5 border-primary" : ""}`}
        >
          <div
            className={`text-sm font-medium mb-1 ${
              isToday ? "text-primary" : ""
            }`}
          >
            {currentGridDate.getDate()}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map((event) => (
              <div
                key={event.class_id}
                className="text-xs p-1 bg-primary/10 text-primary rounded truncate"
                title={`${event.classname} - ${formatTime(event.time)}`}
              >
                {formatTime(event.time)} {event.classname}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
      currentGridDate.setDate(currentGridDate.getDate() + 1);
    }

    return (
      <div className="grid grid-cols-7 gap-0 border">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-3 text-center font-medium bg-muted border-b"
          >
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekEvents = getEventsForWeek();

    return (
      <div className="grid grid-cols-7 gap-4">
        {weekEvents.map(({ date, events: dayEvents }) => (
          <div key={date.toISOString()} className="space-y-2">
            <div className="text-center">
              <div className="font-medium">
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div
                className={`text-sm ${
                  date.toDateString() === new Date().toDateString()
                    ? "text-primary font-bold"
                    : "text-muted-foreground"
                }`}
              >
                {date.getDate()}
              </div>
            </div>
            <div className="space-y-1 min-h-[200px]">
              {dayEvents.map((event) => (
                <Card key={event.class_id} className="p-2">
                  <div className="text-xs font-medium truncate">
                    {event.classname}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {event.studio_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTime(event.time)}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate).sort((a, b) =>
      a.time.localeCompare(b.time)
    );

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h2>
        </div>

        {dayEvents.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No classes scheduled
              </h3>
              <p className="text-muted-foreground">
                You don&apos;t have any classes scheduled for this day.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 max-w-2xl mx-auto">
            {dayEvents.map((event) => (
              <Card key={event.class_id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {event.studio_name}
                      </Badge>
                      <CardTitle className="text-xl">
                        {event.classname}
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        removeFromSchedule(event.class_id, event.classname)
                      }
                      className="text-rose-600 hover:text-rose-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{event.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatTime(event.time)} -{" "}
                      {formatTime(
                        getEndTime(event.time, event.length || "60 min")
                      )}
                      {event.length && ` (${event.length})`}
                    </span>
                  </div>
                  {event.price && (
                    <div className="text-xl font-semibold text-primary">
                      {event.price}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Calendar</h1>
          <p className="text-muted-foreground">
            {events.length} {events.length === 1 ? "class" : "classes"} this
            month
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* View Selector */}
          <Select
            value={viewType}
            onValueChange={(value: ViewType) => setViewType(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={() => {
            if (viewType === "month") navigateMonth("prev");
            else if (viewType === "week") navigateWeek("prev");
            else navigateDay("prev");
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h2 className="text-xl font-semibold">
          {viewType === "month" &&
            currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          {viewType === "week" &&
            `Week of ${currentDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}`}
          {viewType === "day" &&
            currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
        </h2>

        <Button
          variant="outline"
          onClick={() => {
            if (viewType === "month") navigateMonth("next");
            else if (viewType === "week") navigateWeek("next");
            else navigateDay("next");
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your calendar...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="text-center py-12 border-destructive">
          <CardContent>
            <p className="text-destructive">Failed to load calendar events</p>
          </CardContent>
        </Card>
      )}

      {/* Calendar Views */}
      {!isLoading && !error && (
        <>
          {viewType === "month" && renderMonthView()}
          {viewType === "week" && renderWeekView()}
          {viewType === "day" && renderDayView()}
        </>
      )}
    </div>
  );
}
