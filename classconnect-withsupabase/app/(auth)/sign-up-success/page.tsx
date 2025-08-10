import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Thank you for signing up!
              </CardTitle>
              <CardDescription>Check your email to confirm</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You&apos;ve successfully signed up. Please check your email to
                confirm your account before signing in.
              </p>
            </CardContent>
            <CardContent className="flex justify-center gap-2">
              <Link href="/" legacyBehavior>
                <Button variant={"outline"}>Home</Button>
              </Link>
<<<<<<< Updated upstream:classconnect-withsupabase/app/(auth)/sign-up-success/page.tsx
              <Link href="/login">
=======
              <Link href="/auth/login" legacyBehavior>
>>>>>>> Stashed changes:classconnect-withsupabase/app/auth/sign-up-success/page.tsx
                <Button variant={"outline"}>Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
