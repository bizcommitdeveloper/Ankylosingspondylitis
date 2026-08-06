import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { NavBar } from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Ankylosing Spondylitis",
  description:
    "Track Ankylosing Spondylitis disease activity (BASDAI) and function (BASFI) over time.",
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavBar />
          <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
