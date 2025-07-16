import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";
import { cn } from "../lib/utils";

interface DateNavigationProps {
  dates: Date[];
  selectedIndex: number;
  onDateClick: (index: number, date: Date) => void;
  onPrevious: () => void;
  onNext: () => void;
  isPreviousDisabled: () => boolean;
  isNextDisabled: () => boolean;
}

const DateNavigation: React.FC<DateNavigationProps> = ({
  dates,
  selectedIndex,
  onDateClick,
  onPrevious,
  onNext,
  isPreviousDisabled,
  isNextDisabled,
}) => (
  <Pagination className="">
    <PaginationContent className="gap-4 max-md:gap-2 bg-gray-300/20 rounded-3xl overflow-x-auto">
      <PaginationPrevious
        onClick={() => !isPreviousDisabled() && onPrevious()}
        className={cn(
          "transition-all",
          !isPreviousDisabled() && "hover:cursor-pointer hover:bg-accent",
          isPreviousDisabled() && "pointer-events-none opacity-50"
        )}
      />
      {dates.map((date, index) => (
        <PaginationItem key={date.toISOString()} className="w-25">
          <PaginationLink
            href="#"
            className={cn(
              "w-25 max-md:text-xs whitespace-nowrap",
              "px-4 max-md:px-2"
            )}
            isActive={index === selectedIndex}
            onClick={() => onDateClick(index, date)}
          >
            {date.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationNext
        onClick={() => !isNextDisabled() && onNext()}
        className={cn(
          "transition-all",
          !isNextDisabled() && "hover:cursor-pointer hover:bg-accent",
          isNextDisabled() && "pointer-events-none opacity-50"
        )}
      />
    </PaginationContent>
  </Pagination>
);

export default DateNavigation;
