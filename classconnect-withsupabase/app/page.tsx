import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>ClassConnect</Link>
              <div className="flex items-center gap-2"></div>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        <main className="min-h-screen flex flex-col items-center px-4 py-8 bg-background text-foreground">
          {/* Hero */}
          <section className="flex flex-col items-center text-center mt-20 mb-12 space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              ClassConnect
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              All your dance classes, all in one place. TEST
            </p>
          </section>
          {/* Call-to-action Buttons */}
          <section className="flex gap-4 flex-wrap justify-center">
            <Button variant="outline">Learn More</Button>
            <Button variant="outline">Contact</Button>
          </section>
        </main>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-muted-foreground text-sm gap-8 py-16">
          <p>
            Contact:{" "}
            <a href="mailto:derek@derektrauner.com" className="">
              derek@derektrauner.com
            </a>
            <br />© 2025 Derk Inc. All rights reserved.
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
