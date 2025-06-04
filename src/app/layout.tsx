import type { Metadata } from "next";
import { Merriweather, Inter, Lora } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import ScrollToTop from "@/components/ScrollToTop";
// Analytics removed - using simple admin system

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pontigram News - Your Trusted Source for News",
  description: "Stay informed with the latest news, insights, and stories from around the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${merriweather.variable} ${inter.variable} ${lora.variable} antialiased`}
      >
        <Providers>
          {children}
          <ScrollToTop />
          {/* Analytics removed - using simple admin system */}
        </Providers>
      </body>
    </html>
  );
}
