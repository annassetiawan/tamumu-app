import type { Metadata } from "next";
import "./globals.css";
import { ToasterProvider } from "@/components/toaster-provider";

export const metadata: Metadata = {
  title: "Mitra Undangan - Wedding Invitation Platform",
  description: "B2B wedding invitation platform for Wedding Organizers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
