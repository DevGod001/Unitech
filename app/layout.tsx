import type { Metadata, Viewport } from "next";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource-variable/bricolage-grotesque";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Student Portal | Unitech University, Port Harcourt",
    template: "%s | Unitech University",
  },
  description:
    "Register courses, check results, see fees and view your timetable at Unitech University, Port Harcourt.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#1740c9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NG" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
