import type { Metadata } from "next";
import "./globals.css";
import { Manrope } from "next/font/google";

export const metadata: Metadata = {
  title: "Recall",
  description: "Cada conversa guarda tesouros. O Recall os revela",
};

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={manrope.className}>{children}</body>
    </html>
  );
}
