import "./globals.css";
import type { Metadata, Viewport } from "next";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = { title: "day by day ♡", description: "Жеке даму күнделігі" };
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kk">
      <body className="min-h-screen font-sans text-violet-950 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
