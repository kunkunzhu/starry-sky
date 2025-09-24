import type { Metadata } from "next";
import { Fragment_Mono } from "next/font/google";
import "./globals.css";

const fragmentMono = Fragment_Mono({
  variable: "--font-fragment",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "starry sky",
  description: "this vast night sky does not feel so barren because you were here, once.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fragmentMono.className} w-screen h-screen overflow-hidden text-star bg-night`}>
        {children}
      </body>
    </html >
  );
}
