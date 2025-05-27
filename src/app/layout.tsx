import type { Metadata } from "next";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";



export const metadata: Metadata = {
  title: "Course Platform",
  description: "Platform for learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <ClerkProvider >
      <html lang="en">
        <body
          className={`antialiased`}
        >
          {children}
          <Toaster richColors/>
        </body>
      </html>
    // </ClerkProvider>
  );
}
