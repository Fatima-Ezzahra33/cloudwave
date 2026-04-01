import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/Providers";
import { QueryProvider } from "@/components/QueryProvider";

export const metadata: Metadata = {
  title: "Cloudwave - Music Streaming",
  description: "Your favorite music, any time, any where.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white antialiased">
        <AuthProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
