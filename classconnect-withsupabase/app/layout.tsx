import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "ClassConnect Web App | v3.2.0",
  description: "All your dance classes, all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col items-center overflow-x-hidden w-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="w-full">{children}</div>
          <Toaster
            richColors
            expand={false}
            closeButton={true}
            position="bottom-right"
            duration={3000}
          />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
