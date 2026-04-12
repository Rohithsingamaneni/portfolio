import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rohith Singamaneni | Systems Architect",
  description:
    "Backend Software Engineer specializing in Distributed Systems & AI Infrastructure.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#020202] antialiased selection:bg-blue-500/30">
        {children}
      </body>
    </html>
  );
}
