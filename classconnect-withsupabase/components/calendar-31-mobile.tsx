"use client";

import * as React from "react";
import { Trash2, User, Clock, Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DanceClass } from "@/types/danceClass";

interface CalendarEvent extends DanceClass {
  scheduled_at?: string;
}

interface Calendar31MobileProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date | undefined) => void;
  events: CalendarEvent[];
  onRemoveEvent?: (classId: string, className: string) => void;
  formatTime: (time: string) => string;
  getEndTime: (startTime: string, lengthStr: string) => string;
}

export default function Calendar31Mobile({
  selectedDate,
  onDateSelect,
  events = [],
  onRemoveEvent,
  formatTime,
  getEndTime,
}: Calendar31MobileProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    selectedDate || new Date()
  );

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (onDateSelect) {
      onDateSelect(newDate);
    }
  };

  // Get events for the selected date
  const selectedDateEvents = React.useMemo(() => {
    if (!date) return [];
    // Format date as YYYY-MM-DD in local timezone to match database format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const filteredEvents = events.filter((event) => event.date === dateStr);
    return filteredEvents;
  }, [date, events]);

  React.useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, [selectedDate]);

  return (
    <>
      <div className="flex flex-col w-full max-w-full">
        {/* Calendar Section - Fixed Height */}
        <Card className="flex-shrink-0 w-full">
          <CardContent className="px-2 pt-4 sm:px-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="bg-transparent p-0 w-full mx-auto [&_table]:w-full [&_td]:text-center [&_th]:text-center [&_.rdp-cell]:min-h-[2.5rem] [&_.rdp-cell]:flex [&_.rdp-cell]:items-center [&_.rdp-cell]:justify-center"
              required
            />
          </CardContent>
        </Card>

        {/* Events Section - Scrollable */}
        <div className="mt-4">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium">
                {date?.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedDateEvents.length}{" "}
                {selectedDateEvents.length === 1 ? "class" : "classes"}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    No classes scheduled for this day
                  </p>
                </div>
              ) : (
                selectedDateEvents.map((event) => (
                  <div
                    key={event.class_id}
                    className="bg-muted after:bg-primary/70 relative rounded-md p-3 pl-6 after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <Badge variant="default" className="mb-2 bg-gray-400">
                          {event.studio_name}
                        </Badge>
                        <div className="font-medium text-base mb-2">
                          {event.classname}
                        </div>
                        <div className="text-muted-foreground text-sm flex items-center gap-2 mb-1">
                          <User className="h-4 w-4" />
                          <span>{event.instructor}</span>
                        </div>
                        <div className="text-muted-foreground text-sm flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {formatTime(event.time)} -{" "}
                            {formatTime(
                              getEndTime(event.time, event.length || "60 min")
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          {event.price && (
                            <div className="text-lg font-semibold text-primary">
                              {event.price}
                            </div>
                          )}
                        </div>
                      </div>
                      {onRemoveEvent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onRemoveEvent(event.class_id, event.classname)
                          }
                          className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 ml-3 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
