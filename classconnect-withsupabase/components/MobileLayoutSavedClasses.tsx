/* eslint-disable @typescript-eslint/no-unused-vars */
import { MapPin, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Clock } from "lucide-react";
import { CalendarDaysIcon } from "lucide-react";
import Calendar08 from "./calendar-08";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import Link from "next/link";
import BottomNavBarMobile from "./BottomNavBarMobile";

interface MobileLayoutSavedClassesProps {
  children: React.ReactNode;
}

const MobileLayoutSavedClasses = ({
  children,
}: MobileLayoutSavedClassesProps) => {
  return (
    <main className="flex flex-col w-full h-[100dvh] fixed inset-0 overflow-hidden pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-200 dark:bg-gray-950 px-4 py-3 sticky top-0 z-50">
        <Link href={"/"} className="flex items-center">
          <MapPin className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">ClassConnectLA</h1>
        </Link>
        <div className="flex gap-2"></div>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">{children}</div>

      <BottomNavBarMobile />
    </main>
  );
};

export default MobileLayoutSavedClasses;
