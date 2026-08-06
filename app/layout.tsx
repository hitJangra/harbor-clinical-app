import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "Harbor | Clinical Annotation",
  description: "Clinical Annotation Web Platform",
};

import { Toaster } from 'sonner';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b] text-neutral-400 min-h-screen overflow-x-hidden`}
      >
        {/* Background depth shapes */}
        <div className="pointer-events-none fixed top-1/4 left-1/4 h-96 w-96 rounded-full bg-white/5 blur-[120px] z-0"></div>
        <div className="pointer-events-none fixed bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-white/[0.03] blur-[150px] z-0"></div>

        <div className="relative z-10 flex min-h-screen flex-col">
          {children}
        </div>
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
