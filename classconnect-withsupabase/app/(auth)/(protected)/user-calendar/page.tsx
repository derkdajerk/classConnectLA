"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function UserCalendar() {
  const router = useRouter();
  return (
    <div className="w-full">
      <h1>User Calendar</h1>
      <Button onClick={() => router.push("/")}>home</Button>
    </div>
  );
}
