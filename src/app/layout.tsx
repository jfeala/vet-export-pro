import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "VetExport Pro — EU Pet Travel Health Certificate",
  description:
    "Simplify USDA APHIS international health certificates for pet travel to the EU. Guided form wizard generates a correctly completed EN-ES 2019-1293 certificate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
