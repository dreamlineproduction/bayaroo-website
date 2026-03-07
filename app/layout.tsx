import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bayaroo.com"),
  title: {
    default: "Bayaroo — India's Rural & Off-Beat Travel Super App",
    template: "%s | Bayaroo",
  },
  description:
    "Discover authentic homestays, villas, resorts, and off-beat destinations across India. Book rooms, plan custom trips with AI, and experience rural India like never before.",
  keywords: [
    "rural travel india",
    "offbeat travel india",
    "homestay booking",
    "india travel app",
    "bayaroo",
    "off-beat destinations",
    "resort booking india",
    "villa booking india",
    "tour packages india",
    "ai trip planner india",
  ],
  authors: [{ name: "Bayaroo Space Private Limited" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Bayaroo",
    title: "Bayaroo — India's Rural & Off-Beat Travel Super App",
    description:
      "Book authentic homestays, off-beat resorts, and unique properties across India. AI-powered tour planning. Real destinations. Real experiences.",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(geist.variable, jakarta.variable)}>
      <body>{children}</body>
    </html>
  );
}
