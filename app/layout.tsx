import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AssessmentProvider } from "@/contexts/AssessmentContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Leadership Consulting",
  description: "Revolutionizing Leadership Development for the 21st Century",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AssessmentProvider>{children}</AssessmentProvider>
      </body>
    </html>
  );
}
