"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";

interface BookmarkButtonProps {
  classId: string;
}

export default function BookmarkButton({ classId }: BookmarkButtonProps) {
  const supabase = createClient();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Check bookmark status on mount
  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      setUserId(user.id);

      const { data } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", user.id)
        .eq("class_id", classId)
        .maybeSingle();

      setIsBookmarked(!!data);
    };

    fetchBookmarkStatus();
  }, [classId, supabase]);

  const toggleBookmark = async () => {
    if (!userId) {
      alert("Please log in to bookmark classes.");
      return;
    }

    if (isBookmarked) {
      await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", userId)
        .eq("class_id", classId);
      setIsBookmarked(false);
    } else {
      await supabase.from("bookmarks").insert([
        {
          user_id: userId,
          class_id: classId,
        },
      ]);
      setIsBookmarked(true);
    }
  };

  return (
    <Button onClick={toggleBookmark} variant="ghost" size="xsm">
      {isBookmarked ? "❤️" : "🖤"}
    </Button>
  );
}
