"use client";
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "./ui/separator";
import { cn } from "../lib/utils";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [savedClasses, setSavedClasses] = useState<Record<string, boolean>>({});
  const [scheduledClasses, setScheduledClasses] = useState<
    Record<string, boolean>
  >({});
  const [notifiedClasses, setNotifiedClasses] = useState<
    Record<string, boolean>
  >({});

  // In the future, we could use useEffect to fetch saved classes from Supabase
  // useEffect(() => {
  //   const fetchUserBookmarks = async () => {
  //     // This is where you would call your Supabase function once implemented
  //     const userId = "current-user-id"; // You'll need to get this from your auth context
  //     const bookmarkedClassIds = await fetchBookmarkedClasses(userId);
  //
  //     const bookmarksMap: Record<string, boolean> = {};
  //     bookmarkedClassIds.forEach(id => {
  //       bookmarksMap[id] = true;
  //     });
  //
  //     setSavedClasses(bookmarksMap);
  //   };
  //
  //   fetchUserBookmarks();
  // }, []);

  const toggleSaved = (classId: string) => {
    setSavedClasses((prev) => {
      const newState = {
        ...prev,
        [classId]: !prev[classId],
      };

      // Future Supabase integration
      // const userId = "current-user-id";
      // if (newState[classId]) {
      //   saveClassToBookmarks(userId, classId);
      // } else {
      //   removeClassFromBookmarks(userId, classId);
      // }

      return newState;
    });
  };

  const toggleScheduled = (classId: string) => {
    setScheduledClasses((prev) => {
      const newState = {
        ...prev,
        [classId]: !prev[classId],
      };

      // Future Supabase integration
      // const userId = "current-user-id";
      // if (newState[classId]) {
      //   addClassToSchedule(userId, classId);
      // }

      return newState;
    });
  };

  const toggleNotification = (classId: string) => {
    setNotifiedClasses((prev) => {
      const newState = {
        ...prev,
        [classId]: !prev[classId],
      };

      // Future Supabase integration
      // const userId = "current-user-id";
      // if (newState[classId]) {
      //   setClassNotification(userId, classId);
      // }

      return newState;
    });
  };

  const handlePlaceholder = (danceClass: DanceClass) => {
    console.log("Placeholder action:", danceClass);
    // Will be implemented later
  };

  return (
    <ScrollArea className="w-[300px] rounded-lg border overflow-hidden">
      <div className="pt-4 pb-4">
        <h4 className="text-sm font-medium leading-none text-center flex items-center justify-center">
          <Image
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
          <DropdownMenu key={danceClass.class_id}>
            <DropdownMenuTrigger asChild>
              <div
                className="relative cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md p-2"
                id="class-item"
              >
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
                <div className="flex gap-2 justify-end">
                  {savedClasses[danceClass.class_id] && (
                    <span title="Saved to bookmarks">❤️</span>
                  )}
                  {scheduledClasses[danceClass.class_id] && (
                    <span title="Added to schedule">📅</span>
                  )}
                  {notifiedClasses[danceClass.class_id] && (
                    <span title="Notifications enabled">🔔</span>
                  )}
                </div>
              </div>
            </DropdownMenuTrigger>
            <Separator className=" mt-2 mb-2" />
            <DropdownMenuContent align="end" side="bottom">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaved(danceClass.class_id);
                }}
                className="cursor-pointer"
              >
                <span className="mr-2">
                  {savedClasses[danceClass.class_id] ? "❤️" : "🖤"}
                </span>
                {savedClasses[danceClass.class_id] ? "Saved" : "Save"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  toggleScheduled(danceClass.class_id);
                }}
                className="cursor-pointer"
              >
                <span className="mr-2">📅</span>
                {scheduledClasses[danceClass.class_id]
                  ? "Added to Schedule"
                  : "Add to Schedule"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNotification(danceClass.class_id);
                }}
                className="cursor-pointer"
              >
                <span className="mr-2">🔔</span>
                {notifiedClasses[danceClass.class_id]
                  ? "Notifications On"
                  : "Notify"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlaceholder(danceClass);
                }}
                className="cursor-pointer"
              >
                <span className="mr-2">⚠</span>
                Action
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ClassScrollBar;
