import { GalleryVerticalEnd } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import Link from "next/link";

export default async function LoginPage() {
  // Check if user is already logged in
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If session exists, redirect to schedule
  if (session) {
    redirect("/schedule");
  }
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          ClassConnectLA
        </Link>

        <LoginForm />
      </div>
    </div>
  );
}
