import * as React from "react";
import { JSX, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

export function TimeRangeSelector({
  onTimeChange,
  value,
}: TimeRangeSelectorProps): JSX.Element {
  const [startOpen, setStartOpen] = React.useState<boolean>(false);
  const [endOpen, setEndOpen] = React.useState<boolean>(false);
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
    setStartOpen(false);
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
    setEndOpen(false);
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
        <Popover open={startOpen} onOpenChange={setStartOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={startOpen}
              className="w-full justify-between overflow-hidden px-3"
            >
              <span className="truncate">
                {startValue
                  ? timeOptions.find((time) => time.value === startValue)?.label
                  : "Select start time..."}
              </span>
              <ChevronsUpDown className="opacity-50 ml-2 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search times..." className="h-9" />
              <CommandList>
                <CommandEmpty>No time found.</CommandEmpty>
                <CommandGroup>
                  {timeOptions.map(({ value, label }) => (
                    <CommandItem
                      key={value}
                      value={value}
                      onSelect={(label) => {
                        handleStartTimeSelect(label);
                      }}
                    >
                      {label}
                      <Check
                        className={cn(
                          "ml-auto",
                          startValue === value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* End Time Selector */}
        <Popover open={endOpen} onOpenChange={setEndOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={startOpen}
              className="w-full justify-between overflow-hidden px-3"
            >
              <span className="truncate">
                {endValue
                  ? timeOptions.find((time) => time.value === endValue)?.label
                  : "Select end time..."}
              </span>
              <ChevronsUpDown className="opacity-50 ml-2 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search times..." className="h-9" />
              <CommandList>
                <CommandEmpty>No time found.</CommandEmpty>
                <CommandGroup>
                  {timeOptions.map(({ value, label }) => (
                    <CommandItem
                      key={value}
                      value={value}
                      onSelect={(label) => {
                        handleEndTimeSelect(label);
                      }}
                    >
                      {label}
                      <Check
                        className={cn(
                          "ml-auto",
                          endValue === value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
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
