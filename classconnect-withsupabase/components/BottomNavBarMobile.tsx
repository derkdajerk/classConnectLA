import { Calendar, Home, Bookmark, User, CalendarDays } from "lucide-react";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BottomNavBarMobile = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex items-center justify-around bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-2 px-4 mt-auto pb-[env(safe-area-inset-bottom)] sticky bottom-0">
      <Link
        href="/"
        className={`flex flex-col items-center justify-center p-2 ${
          isActive("/") ? "text-primary" : ""
        }`}
      >
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      <Link
        href="/schedule"
        className={`flex flex-col items-center justify-center p-2 ${
          isActive("/schedule") ? "text-primary" : ""
        }`}
      >
        <Calendar className="h-5 w-5" />
        <span className="text-xs mt-1">Schedules</span>
      </Link>
      <Link
        href="/bookmarks"
        className={`flex flex-col items-center justify-center p-2 ${
          isActive("/bookmarks") ? "text-primary" : ""
        }`}
      >
        <Bookmark className="h-5 w-5" />
        <span className="text-xs mt-1">Saved</span>
      </Link>
      <Link
        href="/user-calendar"
        className={`flex flex-col items-center justify-center p-2 ${
          isActive("/user-calendar") ? "text-primary" : ""
        }`}
      >
        <CalendarDays className="h-5 w-5" />
        <span className="text-xs mt-1">Calendar</span>
      </Link>
      <Link
        href="/profile"
        className={`flex flex-col items-center justify-center p-2 ${
          isActive("/profile") ? "text-primary" : ""
        }`}
      >
        <User className="h-5 w-5" />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </div>
  );
};

export default BottomNavBarMobile;
