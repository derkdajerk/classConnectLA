"use client";

import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import type { DayPicker } from "react-day-picker";

interface Calendar08Props {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: React.ComponentProps<typeof DayPicker>["disabled"];
  defaultMonth?: Date;
  className?: string;
}

export default function Calendar08({
  selected,
  onSelect,
  disabled,
  defaultMonth,
  className,
}: Calendar08Props) {
  const [date, setDate] = React.useState<Date | undefined>(
    selected || new Date()
  );

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (onSelect) {
      onSelect(newDate);
    }
  };

  return (
    <Calendar
      mode="single"
      defaultMonth={defaultMonth || date}
      selected={selected || date}
      onSelect={handleDateSelect}
      disabled={disabled}
      className={`rounded-lg border shadow-sm p-4 ${className || ""}`}
      classNames={{
        caption_label: "flex flex-inline text-lg font-semibold",
        nav: "flex items-center gap-1 w-full absolute top-2 inset-x-0 justify-between",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-12 font-normal text-base",
        row: "flex w-full mt-2",
        cell: "h-12 w-12 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 text-base",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
      }}
    />
  );
}
