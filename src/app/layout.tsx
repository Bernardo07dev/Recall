import type { Metadata } from "next";
import "./globals.css";
import { Manrope, Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "Recall",
  description: "Cada conversa guarda tesouros. O Recall os revela",
};

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${manrope.className} ${inter.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}