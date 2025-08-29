"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { DanceClass } from "@/types/danceClass";
import { useEffect } from "react";

interface CalendarEvent extends DanceClass {
  scheduled_at?: string;
}

export function useMonthEvents(userId: string | null, month: Date) {
  const queryClient = useQueryClient();

  // Format month for query key (YYYY-MM)
  const monthKey = month.toISOString().slice(0, 7);

  // Calculate month boundaries
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 1);

  const query = useQuery({
    queryKey: ["user_schedule", userId, monthKey],
    queryFn: async (): Promise<CalendarEvent[]> => {
      if (!userId) return [];

      const supabase = createClient();

      // Get user's scheduled classes for the month
      const { data: scheduleData, error: scheduleError } = await supabase
        .from("user_schedule")
        .select("class_id, created_at")
        .eq("user_id", userId);

      if (scheduleError) throw scheduleError;
      if (!scheduleData || scheduleData.length === 0) return [];

      // Get full class details for scheduled classes
      const classIds = scheduleData.map((item) => item.class_id);
      const { data: classData, error: classError } = await supabase
        .from("danceClassStorage")
        .select("*")
        .in("class_id", classIds)
        .gte("date", monthStart.toISOString().split("T")[0])
        .lt("date", monthEnd.toISOString().split("T")[0]);

      if (classError) throw classError;

      // Combine schedule data with class data
      const events: CalendarEvent[] = (classData || []).map((classItem) => {
        const schedule = scheduleData.find(
          (s) => s.class_id === classItem.class_id
        );
        return {
          ...classItem,
          scheduled_at: schedule?.created_at,
        };
      });

      return events;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Prefetch previous and next months
  useEffect(() => {
    if (!userId) return;

    const prefetchMonth = (targetMonth: Date) => {
      const targetMonthKey = targetMonth.toISOString().slice(0, 7);
      const targetMonthStart = new Date(
        targetMonth.getFullYear(),
        targetMonth.getMonth(),
        1
      );
      const targetMonthEnd = new Date(
        targetMonth.getFullYear(),
        targetMonth.getMonth() + 1,
        1
      );

      queryClient.prefetchQuery({
        queryKey: ["user_schedule", userId, targetMonthKey],
        queryFn: async (): Promise<CalendarEvent[]> => {
          const supabase = createClient();

          const { data: scheduleData, error: scheduleError } = await supabase
            .from("user_schedule")
            .select("class_id, created_at")
            .eq("user_id", userId);

          if (scheduleError) throw scheduleError;
          if (!scheduleData || scheduleData.length === 0) return [];

          const classIds = scheduleData.map((item) => item.class_id);
          const { data: classData, error: classError } = await supabase
            .from("danceClassStorage")
            .select("*")
            .in("class_id", classIds)
            .gte("date", targetMonthStart.toISOString().split("T")[0])
            .lt("date", targetMonthEnd.toISOString().split("T")[0]);

          if (classError) throw classError;

          const events: CalendarEvent[] = (classData || []).map((classItem) => {
            const schedule = scheduleData.find(
              (s) => s.class_id === classItem.class_id
            );
            return {
              ...classItem,
              scheduled_at: schedule?.created_at,
            };
          });

          return events;
        },
        staleTime: 5 * 60 * 1000,
      });
    };

    // Prefetch previous month
    const prevMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1);
    prefetchMonth(prevMonth);

    // Prefetch next month
    const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
    prefetchMonth(nextMonth);
  }, [userId, month, queryClient]);

  return query;
}

// Helper function to parse duration from length string
export function parseDuration(lengthStr: string): number {
  if (!lengthStr) return 60; // default to 60 minutes
  const match = lengthStr.match(/^\d+/);
  return match ? parseInt(match[0], 10) : 60;
}

// Helper function to calculate end time
export function getEndTime(startTime: string, lengthStr: string): string {
  const duration = parseDuration(lengthStr);
  const [hours, minutes] = startTime.split(":").map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);

  const endDate = new Date(startDate.getTime() + duration * 60 * 1000);
  return endDate.toTimeString().slice(0, 5); // HH:MM format
}
