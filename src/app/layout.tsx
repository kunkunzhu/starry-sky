import type { Metadata } from "next";
import { Unna } from "next/font/google";
import "./globals.css";


const unna = Unna({
  variable: "--font-unna",
  weight: "400",
  subsets: ["latin"],
})

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
      <body className={`${unna.className} w-screen h-screen overflow-hidden text-star`}>
        {children}
      </body>
    </html >
  );
}
