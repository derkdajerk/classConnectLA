/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { JSX, useMemo } from "react";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TimeOption {
  value: string;
  label: string;
}

interface TimeRange {
  start: string;
  end: string;
}

interface TimeRangeSelectorProps {
  onTimeChange: (timeRange: TimeRange) => void;
  value?: TimeRange;
}

const generateTimes = (): TimeOption[] => {
  const timesList: TimeOption[] = [];
  for (let i = 15; i < 47; i++) {
    const hour = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    const militaryTime = `${hour.toString().padStart(2, "0")}:${minutes}`;

    const amPm = hour < 12 ? "AM" : "PM";
    const displayHour = hour === 0 || hour === 12 ? 12 : hour % 12;
    const displayTime = `${displayHour}:${minutes} ${amPm}`;

    timesList.push({
      value: militaryTime,
      label: displayTime,
    });
  }
  return timesList;
};

const isValidTimeRange = (start: string, end: string): boolean => {
  if (!start || !end) return true;
  return start < end;
};

export function MobileTimeSelector({
  onTimeChange,
  value,
}: TimeRangeSelectorProps): JSX.Element {
  const [startValue, setStartValue] = React.useState<string>("");
  const [endValue, setEndValue] = React.useState<string>("");

  const timeOptions = useMemo<TimeOption[]>(() => generateTimes(), []);

  // Sync internal state with controlled value when provided
  React.useEffect(() => {
    if (value) {
      setStartValue(value.start ?? "");
      setEndValue(value.end ?? "");
    }
  }, [value]);

  const handleStartTimeSelect = (currentValue: string): void => {
    const newStartValue = currentValue === startValue ? "" : currentValue;

    // If both are present and invalid, block
    if (
      endValue &&
      newStartValue &&
      !isValidTimeRange(newStartValue, endValue)
    ) {
      toast.error("Start time must be before end time");
      return;
    }

    setStartValue(newStartValue);
    // Always propagate, supporting partial selection
    onTimeChange({ start: newStartValue, end: endValue });
  };

  const handleEndTimeSelect = (currentValue: string): void => {
    const newEndValue = currentValue === endValue ? "" : currentValue;

    // If both are present and invalid, block
    if (
      startValue &&
      newEndValue &&
      !isValidTimeRange(startValue, newEndValue)
    ) {
      toast.error("End time must be after start time");
      return;
    }

    setEndValue(newEndValue);
    // Always propagate, supporting partial selection
    onTimeChange({ start: startValue, end: newEndValue });
  };

  const clearTimeRange = (): void => {
    setStartValue("");
    setEndValue("");
    // Immediately trigger with empty values
    onTimeChange({ start: "", end: "" });
  };

  return (
    <>
      <div className="grid w-full max-w-[420px] mx-auto grid-cols-2 gap-3 items-center">
        {/* Start Time Selector */}
        <div className="relative">
          <select
            value={startValue}
            onChange={(e) => handleStartTimeSelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select start time...</option>
            {timeOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronsUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {/* End Time Selector */}
        <div className="relative">
          <select
            value={endValue}
            onChange={(e) => handleEndTimeSelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select end time...</option>
            {timeOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronsUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
      <div className="flex gap-4 justify-center mt-2">
        <Button
          variant="secondary"
          className="bg-gray-400 hover:bg-gray-500 hover:font-bold cursor-pointer"
          onClick={clearTimeRange}
        >
          Clear
        </Button>
      </div>
    </>
  );
}
