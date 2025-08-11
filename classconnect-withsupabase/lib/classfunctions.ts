import { createClient } from "@/lib/supabase/client";

// Use the browser client that has access to session cookies
const getSupabaseClient = () => createClient();

// Bookmark functions
export const saveClassToBookmarks = async (userId: string, classId: string) => {
  try {
    const supabase = getSupabaseClient();

    // Check if already bookmarked
    const { data: existing } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", userId)
      .eq("class_id", classId)
      .single();

    if (existing) {
      throw new Error("Class is already bookmarked");
    }

    // Insert new bookmark
    const { data, error } = await supabase
      .from("bookmarks")
      .insert({
        user_id: userId,
        class_id: classId,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Failed to save class to bookmarks");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Bookmark save error:", error);
    throw error;
  }
};

export const removeClassFromBookmarks = async (
  userId: string,
  classId: string
) => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("class_id", classId)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Failed to remove class from bookmarks");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Bookmark remove error:", error);
    throw error;
  }
};

// Schedule functions
export const addClassToSchedule = async (userId: string, classId: string) => {
  try {
    const supabase = getSupabaseClient();

    // Check if already scheduled
    const { data: existing } = await supabase
      .from("user_schedule")
      .select("id")
      .eq("user_id", userId)
      .eq("class_id", classId)
      .single();

    if (existing) {
      throw new Error("Class is already scheduled");
    }

    // Insert new schedule entry
    const { data, error } = await supabase
      .from("user_schedule")
      .insert({
        user_id: userId,
        class_id: classId,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Failed to add class to schedule");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Schedule add error:", error);
    throw error;
  }
};

export const removeClassFromSchedule = async (
  userId: string,
  classId: string
) => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("user_schedule")
      .delete()
      .eq("user_id", userId)
      .eq("class_id", classId)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Failed to remove class from schedule");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Schedule remove error:", error);
    throw error;
  }
};

// Fetch functions for initial state
export const fetchBookmarkedClasses = async (
  userId: string
): Promise<string[]> => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("bookmarks")
      .select("class_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Failed to fetch bookmarked classes");
    }

    return data?.map((item) => item.class_id) || [];
  } catch (error) {
    console.error("Fetch bookmarks error:", error);
    throw error;
  }
};

export const fetchScheduledClasses = async (
  userId: string
): Promise<string[]> => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("user_schedule")
      .select("class_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Failed to fetch scheduled classes");
    }

    return data?.map((item) => item.class_id) || [];
  } catch (error) {
    console.error("Fetch schedule error:", error);
    throw error;
  }
};

// Notification functions (placeholder for now)
export const setClassNotification = async (userId: string, classId: string) => {
  console.log(`Setting notification for class ${classId} for user ${userId}`);
  return { success: true };
};

export const deleteClassNotification = async (
  userId: string,
  classId: string
) => {
  console.log(`Deleting notification for class ${classId} for user ${userId}`);
  return { success: true };
};
