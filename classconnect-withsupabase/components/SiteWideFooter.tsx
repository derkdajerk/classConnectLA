import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

interface SiteWideFooterProps {
  hideOnMobile?: boolean;
}

export function SiteWideFooter({ hideOnMobile = false }: SiteWideFooterProps) {
  const baseClasses =
    "w-full flex items-center justify-center border-t mx-auto text-center text-muted-foreground text-sm gap-2 md:gap-8 py-4 mt-auto";
  const visibilityClasses = hideOnMobile ? "hidden md:flex" : "flex";

  return (
    <footer className={`${baseClasses} ${visibilityClasses}`}>
      <div className="flex md:flex-row items-center gap-2 md:gap-8">
        <p>
          Contact:{" "}
          <a href="mailto:derek@derektrauner.com" className="hover:underline">
            derek@derektrauner.com
          </a>
          <br />© 2025 Traunico, LLC. All rights reserved.
          <br />
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          &nbsp;|&nbsp;
          <Link href="/terms" className="hover:underline">
            Terms & Conditions
          </Link>
        </p>
      </div>

      <ThemeSwitcher />
    </footer>
  );
}
