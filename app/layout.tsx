import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner"

import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newYork = localFont({
  src: "../public/fonts/new-york/selawik.semilight.ttf",
  display: "swap",
  variable: "--font-new-york",
});

export const metadata: Metadata = {
  title: "WeSchedule — Smarter Group Scheduling",
  description: "Modern When2Meet clone with calendar sync, smart time suggestions, chat, and a sleek Neobrutalist UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${newYork.className} ${newYork.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />

      </body>
    </html>
  );
}
