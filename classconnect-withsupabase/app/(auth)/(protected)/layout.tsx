import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { SiteWideFooter } from "@/components/SiteWideFooter";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col overflow-x-hidden w-full flex-1">
      <div className="w-full flex flex-col min-h-screen">
        <nav className="w-full hidden md:flex justify-center border-b border-b-foreground/10 min-h-16">
          <div className="w-full max-w-5xl flex flex-col md:flex-row p-2 px-3 md:px-5 text-sm">
            {/* Desktop: Regular row layout */}
            <div className="flex w-full items-center justify-between">
              <div className="font-semibold text-2xl hidden md:block">
                <Link href={"/"}>ClassConnectLA</Link>
              </div>

              {/* Auth content */}
              <div className="w-full md:w-auto max-md:hidden">
                {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
              </div>
            </div>
          </div>
        </nav>
        <div className="flex-grow flex flex-col w-full max-w-none">
          {children}
        </div>
        <SiteWideFooter hideOnMobile />
      </div>
    </main>
  );
}
