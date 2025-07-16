"use client";
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "./ui/separator";
import { cn } from "../lib/utils";

interface DanceClass {
  class_id: string;
  classname: string;
  instructor: string;
  time: string;
  date: string;
  length: string;
}

interface ClassScrollBarProps {
  studioName: string;
  danceClassList: DanceClass[];
  isSearchTerm: boolean;
}

const formatTime = (time: string): string => {
  const hours = parseInt(time.slice(0, 2));
  return hours > 12
    ? `${hours - 12}${time.slice(2, 5)} PM`
    : hours === 12
    ? `${hours}${time.slice(2, 5)} PM`
    : hours < 10
    ? `${hours}${time.slice(2, 5)} AM`
    : `${hours}${time.slice(2, 5)} AM`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString + "T00:00:00");
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const ClassScrollBar: React.FC<ClassScrollBarProps> = ({
  studioName,
  danceClassList,
  isSearchTerm,
}) => {
  const [imgError, setImgError] = useState<boolean>(false);

  return (
    <ScrollArea className="w-75 rounded-lg border overflow-hidden">
      <div className="pt-4 pb-4">
        <h4 className="text-sm font-medium leading-none text-center flex items-center justify-center">
          <img
            src={`/${studioName}.webp`}
            alt={studioName}
            width={50}
            height={50}
            className="mx-2"
            onError={() => {
              if (!imgError) {
                setImgError(true);
              }
            }}
          />
          {studioName}
        </h4>
      </div>
      <Separator className="w-full" />
      <div className="p-4">
        {danceClassList?.map((danceClass) => (
          <div key={danceClass.class_id} className="relative mb-4">
            <div className="text-sm grid grid-cols-3 gap-4 mb-4">
              <div className="text-left">{formatTime(danceClass.time)}</div>
              <div className="text-right font-medium col-start-2 col-span-3">
                {danceClass.classname}
              </div>
            </div>
            <div className="text-sm grid grid-cols-3 gap-2">
              <div className="text-gray-500">{danceClass.length}</div>
              {isSearchTerm ? (
                <div className="text-center text-gray-500">
                  {formatDate(danceClass.date)}
                </div>
              ) : (
                ""
              )}
              <div
                className={cn(
                  "flex justify-end text-right font-semibold text-gray-600",
                  isSearchTerm
                    ? "col-start-3 col-span-1"
                    : "col-start-2 col-span-2"
                )}
              >
                {danceClass.instructor}
              </div>
            </div>
            <Separator key={danceClass.class_id} className="mt-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ClassScrollBar;
