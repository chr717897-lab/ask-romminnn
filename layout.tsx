import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASK ROMAN — A space to ask",
  description: "Questions, conversations and a little curiosity.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}