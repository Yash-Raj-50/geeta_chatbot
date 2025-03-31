import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gita Core",
  description: "AWS Bedrock based Chatbot for Gita",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <header className="h-[7.5vh]">
        <Navbar />
      </header>
      <main className="h-[92.5vh]">
        {children}
      </main>
      </body>
    </html>
  );
}
