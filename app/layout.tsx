import type { Metadata } from "next";
import { Inter_Tight, Outfit } from "next/font/google";
import "./globals.css";

const hostGrotesk = Inter_Tight({
  variable: "--font-host-grotesk",
  subsets: ["latin"],
  // weight: "400",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bantuin: Marketplace Jasa Mahasiswa UIN Suska Riau",
  description:
    "Platform marketplace jasa yang menghubungkan mahasiswa UIN Suska Riau dengan peluang kerja freelance dan proyek akademik.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${hostGrotesk.variable} ${outfit.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
