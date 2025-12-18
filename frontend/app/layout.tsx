import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "Calendar Buddy",
  description: "A simple calendar application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        suppressHydrationWarning
        className={`${inter.className} ${caveat.variable} min-h-screen bg-background text-foreground`}
      >
        <main className="flex min-h-screen flex-col items-center justify-between">
          {children}
        </main>
      </body>
    </html>
  );
}
