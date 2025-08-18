import { Calendar, Home, Bookmark, User, MoreHorizontal } from "lucide-react";
import React from "react";

const BottomNavBarMobile = () => {
  return (
    <div className="flex items-center justify-around bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-2 px-4 mt-auto pb-[env(safe-area-inset-bottom)] sticky bottom-0">
      <button className="flex flex-col items-center justify-center p-2 text-primary">
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">Home</span>
      </button>
      <button className="flex flex-col items-center justify-center p-2">
        <Calendar className="h-5 w-5" />
        <span className="text-xs mt-1">Schedule</span>
      </button>
      <button className="flex flex-col items-center justify-center p-2">
        <Bookmark className="h-5 w-5" />
        <span className="text-xs mt-1">Saved</span>
      </button>
      <button className="flex flex-col items-center justify-center p-2">
        <User className="h-5 w-5" />
        <span className="text-xs mt-1">Profile</span>
      </button>
      <button className="flex flex-col items-center justify-center p-2">
        <MoreHorizontal className="h-5 w-5" />
        <span className="text-xs mt-1">More</span>
      </button>
    </div>
  );
};

export default BottomNavBarMobile;
