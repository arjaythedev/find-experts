import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const bureauSans = localFont({
  src: [
    { path: "../fonts/STKBureauSans-Book.ttf", weight: "400", style: "normal" },
    { path: "../fonts/STKBureauSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/STKBureauSans-SemiBold.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-bureau-sans",
});

const bureauSerif = localFont({
  src: [
    { path: "../fonts/STKBureauSerif-Book.ttf", weight: "300", style: "normal" },
  ],
  variable: "--font-bureau-serif",
});

export const metadata: Metadata = {
  title: "Find Your Experts | Maven",
  description:
    "Learn from humans. Find the top experts in your niche on Maven.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${bureauSans.variable} ${bureauSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
