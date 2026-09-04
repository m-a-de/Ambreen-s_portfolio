import { DM_Serif_Display, Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import BackToTop from "../components/BackToTop";
import SmoothScroll from "../components/SmoothScroll";
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
  metadataBase: new URL("https://www.ambreenrashidkhan.com"),

  title: "Clinical Psychologist in Lahore | Ambreen Rashid Khan",

  description:
    "Ambreen Rashid Khan is a clinical psychologist in Lahore offering compassionate, evidence-based therapy for anxiety, depression, trauma, relationships and personal growth.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Clinical Psychologist in Lahore | Ambreen Rashid Khan",
    description:
      "Compassionate, evidence-based therapy for anxiety, depression, trauma, relationships and personal growth.",
    url: "https://www.ambreenrashidkhan.com",
    siteName: "Ambreen Rashid Khan",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${dmSerif.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}

        <SmoothScroll />
        <BackToTop />
        <GoogleAnalytics gaId="G-0PE7FFMVGP" />
      </body>
    </html>
  );
}