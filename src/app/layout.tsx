import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recall",
  description: "Cada conversa guarda tesouros. O Recall os revela",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
