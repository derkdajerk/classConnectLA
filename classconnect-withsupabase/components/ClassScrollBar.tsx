/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Heart,
  CalendarPlus,
  Bell,
  TriangleAlert,
  HeartOff,
  CalendarOff,
  BellOff,
} from "lucide-react";
import {
  saveClassToBookmarks,
  removeClassFromBookmarks,
  addClassToSchedule,
  removeClassFromSchedule,
  fetchBookmarkedClasses,
  fetchScheduledClasses,
} from "@/lib/classfunctions";
import { createClient } from "@/lib/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "./ui/separator";
import { cn } from "../lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSwipeable } from "react-swipeable";

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
  isMobile?: boolean;
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
  isMobile = false,
}) => {
  const [imgError, setImgError] = useState<boolean>(false);
  const [savedClasses, setSavedClasses] = useState<Record<string, boolean>>({});
  const [scheduledClasses, setScheduledClasses] = useState<
    Record<string, boolean>
  >({});
  const [notifiedClasses, setNotifiedClasses] = useState<
    Record<string, boolean>
  >({});
  const [userId, setUserId] = useState<string | null>(null);
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const [bookmarkedIds, scheduledIds] = await Promise.all([
          fetchBookmarkedClasses(userId),
          fetchScheduledClasses(userId),
        ]);

        const bookmarkedRecord = bookmarkedIds.reduce((acc, id) => {
          acc[id] = true;
          return acc;
        }, {} as Record<string, boolean>);

        const scheduledRecord = scheduledIds.reduce((acc, id) => {
          acc[id] = true;
          return acc;
        }, {} as Record<string, boolean>);

        setSavedClasses(bookmarkedRecord);
        setScheduledClasses(scheduledRecord);
      } catch (error) {
        console.error("Failed to load user data:", error);
        toast.error("Failed to load your saved classes");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  const toggleSaved = async (classId: string, className: string) => {
    if (!userId) {
      toast.info("Sign in to save classes");
      return;
    }

    const wasSaved = !!savedClasses[classId];
    setSavedClasses((prev) => ({ ...prev, [classId]: !wasSaved }));

    try {
      if (wasSaved) {
        await removeClassFromBookmarks(userId, classId);
        toast.info(`${className} removed from bookmarks`);
      } else {
        await saveClassToBookmarks(userId, classId);
        toast.success(`${className} saved to bookmarks`);
      }
    } catch (error: unknown) {
      setSavedClasses((prev) => ({ ...prev, [classId]: wasSaved }));
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update bookmarks";
      if (errorMessage === "Class is already bookmarked") {
        toast.error("This class is already saved");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const toggleScheduled = async (classId: string, className: string) => {
    if (!userId) {
      toast.info("Sign in to add to schedule");
      return;
    }

    const wasScheduled = !!scheduledClasses[classId];
    setScheduledClasses((prev) => ({ ...prev, [classId]: !wasScheduled }));

    try {
      if (wasScheduled) {
        await removeClassFromSchedule(userId, classId);
        toast.info(`${className} removed from schedule`);
      } else {
        await addClassToSchedule(userId, classId);
        toast.success(`${className} added to schedule`);
      }

      queryClient.invalidateQueries({
        queryKey: ["user_schedule", userId],
      });
    } catch (error: unknown) {
      setScheduledClasses((prev) => ({ ...prev, [classId]: wasScheduled }));
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update schedule";
      if (errorMessage === "Class is already scheduled") {
        toast.error("This class is already scheduled");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const toggleNotification = (classId: string, className: string) => {
    const isCurrentlyNotified = notifiedClasses[classId];

    setNotifiedClasses((prev) => ({
      ...prev,
      [classId]: !isCurrentlyNotified,
    }));

    if (!isCurrentlyNotified) {
      toast.success(`Notifications enabled for ${className}`);
    } else {
      toast.info(`Notifications disabled for ${className}`);
    }
  };

  const handlePlaceholder = (danceClass: DanceClass) => {
    toast(`Action performed on ${danceClass.classname}`, {
      icon: "⚠",
    });
  };

  // New SwipeRow with react-swipeable
  function SwipeRow({
    danceClass,
    isSaved,
    isScheduled,
    onSaveToggle,
    onScheduleToggle,
    onNotify,
    onAction,
    isOpen,
    setOpenFor,
    isSearchTerm,
  }: {
    danceClass: DanceClass;
    isSaved: boolean;
    isScheduled: boolean;
    onSaveToggle: () => void;
    onScheduleToggle: () => void;
    onNotify: () => void;
    onAction: () => void;
    isOpen: boolean;
    setOpenFor: (id: string | null) => void;
    isSearchTerm: boolean;
  }) {
    const rightWidth = 160; // 2 buttons * 80px

    const handlers = useSwipeable({
      onSwipedLeft: () => {
        setOpenFor(danceClass.class_id);
      },
      onSwipedRight: () => {
        setOpenFor(null);
      },
      preventScrollOnSwipe: false,
      trackMouse: true,
      delta: 10,
    });

    return (
      <div
        {...handlers}
        className="relative overflow-hidden bg-gray-100"
        style={{ touchAction: "pan-y" }} // allow vertical scroll
      >
        {/* Right actions */}
        <div
          className="absolute inset-y-0 right-0 flex items-stretch z-10"
          style={{ width: rightWidth }}
        >
          <button
            className="bg-rose-600 text-white flex flex-col items-center justify-center text-xs font-medium"
            style={{ width: 80 }}
            onClick={(e) => {
              e.stopPropagation();
              onSaveToggle();
              setOpenFor(null);
            }}
          >
            {isSaved ? (
              <HeartOff className="h-5 w-5 mb-1" />
            ) : (
              <Heart className="h-5 w-5 mb-1" />
            )}
            <span>{isSaved ? "Unsave" : "Save"}</span>
          </button>
          <button
            className="bg-green-600 text-white flex flex-col items-center justify-center text-xs font-medium"
            style={{ width: 80 }}
            onClick={(e) => {
              e.stopPropagation();
              onScheduleToggle();
              setOpenFor(null);
            }}
          >
            <CalendarPlus className="h-5 w-5 mb-1" />
            <span>{isScheduled ? "Remove" : "Add to calendar"}</span>
          </button>
        </div>

        {/* Foreground row */}
        <div
          className="relative bg-white dark:bg-gray-950 rounded-md p-2 transition-transform duration-200 ease-out z-20"
          style={{
            transform: isOpen
              ? `translateX(-${rightWidth}px)`
              : "translateX(0)",
            transition: "transform 700ms ease-out",
          }}
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
            ) : null}
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
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="w-[300px] rounded-lg border overflow-hidden max-md:w-full">
      {!isMobile && (
        <>
          <div className="pt-4 pb-4">
            <h4 className="text-sm font-medium leading-none text-center flex items-center justify-center min-h-16">
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
        </>
      )}
      <div className="p-4" onClick={() => openRowId && setOpenRowId(null)}>
        {danceClassList?.map((danceClass) =>
          isMobile ? (
            <div key={danceClass.class_id}>
              <SwipeRow
                danceClass={danceClass}
                isSaved={!!savedClasses[danceClass.class_id]}
                isScheduled={!!scheduledClasses[danceClass.class_id]}
                onSaveToggle={() =>
                  toggleSaved(danceClass.class_id, danceClass.classname)
                }
                onScheduleToggle={() =>
                  toggleScheduled(danceClass.class_id, danceClass.classname)
                }
                onNotify={() =>
                  toggleNotification(danceClass.class_id, danceClass.classname)
                }
                onAction={() => handlePlaceholder(danceClass)}
                isOpen={openRowId === danceClass.class_id}
                setOpenFor={setOpenRowId}
                isSearchTerm={isSearchTerm}
              />
              <Separator className="mt-2 mb-2" />
            </div>
          ) : (
            <DropdownMenu key={danceClass.class_id}>
              <DropdownMenuTrigger asChild>
                <div
                  className="relative cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md p-2"
                  id="class-item"
                >
                  <div className="text-sm grid grid-cols-3 gap-4 mb-4">
                    <div className="text-left">
                      {formatTime(danceClass.time)}
                    </div>
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
                    ) : null}
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
                </div>
              </DropdownMenuTrigger>
              <Separator className="mt-2 mb-2" />
              <DropdownMenuContent align="end" side="bottom">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaved(danceClass.class_id, danceClass.classname);
                  }}
                  className="cursor-pointer"
                >
                  {savedClasses[danceClass.class_id] ? (
                    <HeartOff className="mr-2 h-4 w-4 text-rose-600" />
                  ) : (
                    <Heart className="mr-2 h-4 w-4 text-rose-600" />
                  )}
                  {savedClasses[danceClass.class_id] ? "Unsave" : "Save"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleScheduled(danceClass.class_id, danceClass.classname);
                  }}
                  className="cursor-pointer"
                >
                  {scheduledClasses[danceClass.class_id] ? (
                    <CalendarOff className="mr-2 h-4 w-4 text-green-600" />
                  ) : (
                    <CalendarPlus className="mr-2 h-4 w-4 text-green-600" />
                  )}
                  {scheduledClasses[danceClass.class_id]
                    ? "Remove from calendar"
                    : "Add to calendar"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        )}
      </div>
    </ScrollArea>
  );
};

export default ClassScrollBar;
