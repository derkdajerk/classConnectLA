"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";

export default function Page() {
  const [countdown, setCountdown] = useState(4);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/schedule");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleSkip = () => {
    router.push("/schedule");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card className="border-none shadow-xl bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Welcome to ClassConnectLA!
              </CardTitle>
              <CardDescription className="text-base">
                Account created successfully
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center space-y-6">
              <p className="text-sm text-muted-foreground">
                You&apos;re all set! Please check your email to confirm your
                account.
              </p>

              <div className="space-y-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>
                      Redirecting to schedule in {countdown} seconds...
                    </span>
                  </div>

                  <div className="w-full bg-secondary/30 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${((4 - countdown) / 4) * 100}%` }}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSkip}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group"
                  size="lg"
                >
                  <span>Skip and go to schedule now</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>

                <p className="text-xs text-muted-foreground/70 italic">
                  Click above to skip the wait and start exploring classes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
