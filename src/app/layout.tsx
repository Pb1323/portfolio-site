import type { Metadata } from "next";
import { Familjen_Grotesk, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";

// Swapped from Geist (flagged as an overused "safe default" face) for something with more
// character — a confident, slightly warm geometric-grotesk in the same family as the display
// sans Anthropic uses on claude.ai (Styrene A). That exact face is commercially licensed and
// can't be bundled here without a license, so this is a distinctive freely-licensed stand-in,
// not a literal copy.
const primarySans = Familjen_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

const title = "Pranav Bonagiri — Software Engineer";
const description =
  "Portfolio of Pranav Bonagiri, a self-taught software engineer who builds full-stack products end-to-end, solo — including Summit Tuition (£6k ARR in 3 weeks) and QuickDraw AI.";

// Set NEXT_PUBLIC_SITE_URL once this is deployed so relative OG/twitter assets resolve correctly.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "Pranav Bonagiri",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${primarySans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-canvas text-ink">
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
