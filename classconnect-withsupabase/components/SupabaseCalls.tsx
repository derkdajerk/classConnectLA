import { createClient } from "@supabase/supabase-js";
import { DanceClass } from "../lib/danceclass";

interface TimeRange {
  start: string;
  end: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY ?? null;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchStudioClassesBySearchAndTime = async (
  studioName: string,
  searchTerm: string,
  timeRange: TimeRange
): Promise<DanceClass[]> => {
  try {
    let query = supabase
      .from("danceClassStorage")
      .select("*")
      .eq("studio_name", studioName);

    if (searchTerm && searchTerm.trim() !== "") {
      // Improve search to include more fields and be case insensitive
      query = query.or(
        `classname.ilike.%${searchTerm.trim()}%,` +
          `instructor.ilike.%${searchTerm.trim()}%`
      );
      // Don't filter by date when searching
    } else {
      // If no search term, use current date
      const today = new Date().toLocaleDateString("en-CA");
      query = query.eq("date", today);
    }

    const normalizedStart = timeRange.start ? `${timeRange.start}:00` : "";
    const normalizedEnd = timeRange.end ? `${timeRange.end}:00` : "";

    if (normalizedStart) {
      query = query.gte("time", normalizedStart);
    }
    if (normalizedEnd) {
      query = query.lte("time", normalizedEnd);
    }

    // Always order by date and time for consistency
    query = query
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    const { data, error } = await query;
    if (error) throw error;

    if (!data || data.length === 0) {
      return [
        {
          class_id: "0",
          classname: searchTerm ? "No matches found" : "No classes found",
          instructor: searchTerm
            ? "Try different search terms"
            : "Try another date",
          length: "N/A",
          time: "00:00:00",
          price: 0,
          studio_name: studioName,
          date: "",
        },
      ];
    }

    return data;
  } catch (error) {
    console.error("Query error:", error);
    return [
      {
        class_id: "0",
        classname: "Error loading classes",
        instructor: "Please try again",
        length: "N/A",
        time: "00:00:00",
        price: 0,
        studio_name: studioName,
        date: "",
      },
    ];
  }
};

export const fetchStudioClassesByDateAndTime = async (
  studioName: string,
  date: string,
  timeRange: TimeRange
): Promise<DanceClass[]> => {
  try {
    // console.log(timeRange);

    let query = supabase
      .from("danceClassStorage")
      .select("*")
      .eq("studio_name", studioName)
      .eq("date", date);

    const normalizedStart = timeRange.start ? `${timeRange.start}:00` : "";
    const normalizedEnd = timeRange.end ? `${timeRange.end}:00` : "";

    if (normalizedStart) {
      query = query.gte("time", normalizedStart);
    }
    if (normalizedEnd) {
      query = query.lte("time", normalizedEnd);
    }

    query = query.order("time", { ascending: true });

    const { data, error } = await query;

    if (error) throw error;

    if (!data || data.length === 0) {
      return [
        {
          class_id: "0",
          classname: "No classes found.",
          instructor: "Try a different date.",
          length: "N/A",
          time: "00:00:00",
          price: 0,
          studio_name: "xxx",
          date: "",
        },
      ];
    }
    return data;
  } catch (error) {
    console.error(`Error fetching classes: ${error}`);
    return [
      {
        class_id: "0",
        classname: "Error loading classes.",
        instructor: "Try again later.",
        length: "N/A",
        time: "00:00:00",
        price: 0,
        studio_name: "xxx",
        date: "",
      },
    ];
  }
};
