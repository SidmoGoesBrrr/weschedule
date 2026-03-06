import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WeSchedule",
  description: "Group scheduling app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}