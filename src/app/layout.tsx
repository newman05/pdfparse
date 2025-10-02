import type { Metadata } from "next";
import { cn, constructMetadata } from "@/lib/utils";
import { Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import 'react-loading-skeleton/dist/skeleton.css';
import "simplebar-react/dist/simplebar.min.css" 

import { Toaster } from "sonner";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = constructMetadata() 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <Providers>
        <body className={`${cn('min-h-screen font-sains antialiased grainy', inter.className)} ${geistMono.variable}`}>
          <Toaster />
          <Navbar />
          {children}
        </body>
      </Providers>
    </html>
  );
}
