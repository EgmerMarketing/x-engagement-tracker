import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "X Engagement Tracker | Egmer Marketing",
  description: "Track outbound X/Twitter engagement for audience growth",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#1a1a2e] text-white min-h-screen`}>
        <nav className="bg-[#16213e] border-b border-[#0f3460] px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-[#00ADEE] font-bold text-lg">
              📊 X Engagement Tracker
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="hover:text-[#00ADEE] transition">Dashboard</Link>
              <Link href="/targets" className="hover:text-[#00ADEE] transition">Targets</Link>
              <Link href="/log" className="hover:text-[#00ADEE] transition">Log</Link>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
