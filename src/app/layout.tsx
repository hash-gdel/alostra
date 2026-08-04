import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import "./globals.css";

/* Content: headings, titles, reading, quotations.
   `opsz` is requested so that `font-optical-sizing: auto` can drive it.
   SOFT and WONK are left at their defaults and deliberately not downloaded. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

/* Interface: navigation, controls, labels, metadata. */
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alostra",
  description:
    "A private reading corner for your books, articles, highlights and notes.",
};

export const viewport: Viewport = {
  // Dark mode tokens exist but the experience is not built yet, so the
  // document stays light until it is.
  colorScheme: "light",
  themeColor: "#f6f0e7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
