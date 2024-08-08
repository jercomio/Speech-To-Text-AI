import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Voice Transcript",
  description: "Speech To Text with Whisper Recognize",
  keywords: "voice, transcript, openai, ai, speech-to-text"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-[100vh] bg-zinc-950">
      <body className={cn(inter.className, "")}> 
        {children}
      </body>
    </html>
  );
}
