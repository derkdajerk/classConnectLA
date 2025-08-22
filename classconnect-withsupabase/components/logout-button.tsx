"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <Button
      variant="outline"
      iconSize="md"
      className="md:flex"
      onClick={logout}
    >
      <LogOut className="h-4 w-4" />
      <span className="md:inline hidden">Logout</span>
    </Button>
  );
}
