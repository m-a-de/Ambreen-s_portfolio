import { DM_Serif_Display, Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: ["400"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ambreen Rashid Khan - Clinical Psychologist",
  description:
    "Professional psychology services - helping you rediscover balance, clarity, and self-compassion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${dmSerif.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}

        <GoogleAnalytics gaId="G-0PE7FFMVGP" />
      </body>
    </html>
  );
}