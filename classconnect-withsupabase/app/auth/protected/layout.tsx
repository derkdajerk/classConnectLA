import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col overflow-x-hidden w-full">
      <div className="flex-1 w-full flex flex-col">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 min-h-16">
          <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between p-2 px-3 md:px-5 text-sm">
            {/* Mobile: ClassConnect on its own row at top */}
            {/* <div className="font-semibold text-lg w-full text-center mb-1 md:hidden">
              <Link href={"/"}>ClassConnect</Link>
            </div> */}

            {/* Desktop: Regular row layout */}
            <div className="flex w-full justify-between items-center">
              <div className="font-semibold text-2xl hidden md:block">
                <Link href={"/"}>ClassConnect</Link>
              </div>

              {/* Auth content */}
              <div className="w-full md:w-auto">
                {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
              </div>
            </div>
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 min-h-[1500px] mt-1 w-full max-w-none">
          {children}
        </div>
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
