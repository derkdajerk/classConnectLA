import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getUser();

  const user = data?.user;
  const displayName = user?.user_metadata.display_name || user?.email;

  return user ? (
    <div className="flex flex-col w-full md:flex-row md:items-center gap-2 text-sm">
      {/* Desktop greeting */}
      <span className="whitespace-nowrap md:inline hidden">
        Hey, {displayName}!
      </span>

      {/* Mobile greeting - centered below app name */}
      <span className="whitespace-nowrap w-full text-center md:hidden">
        Hey, {displayName}!
      </span>

      {/* Button row - shown below greeting on mobile, inline on desktop */}
      <div className="flex gap-2 items-center w-full md:w-auto justify-center md:justify-start md:mt-0">
        <LogoutButton />
        <Link href={"/schedule"}>
          <Button size="sm">Schedule</Button>
        </Link>
        <Link href="/">
          <Button size="sm" className="md:flex">
            <span className="md:inline hidden">Home</span>
            <span className="inline md:hidden">🏠︎</span>
          </Button>
        </Link>
      </div>
    </div>
  ) : (
    <div className="flex gap-2 mt-2 mb-2 w-full justify-center">
      <Button asChild size="md" variant={"outline"}>
        <Link href="/login">Sign in</Link>
      </Button>
      <Button asChild size="md" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
