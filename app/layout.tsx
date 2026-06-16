import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { GSAPProvider } from "@/components/providers/GSAPProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import ScrollProgress from "@/components/ui/ScrollProgress";
import EasterEgg from "@/components/ui/EasterEgg";
import HudFrame from "@/components/ui/HudFrame";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohith Raagesh B — Full Stack Developer",
  description:
    "Full Stack Developer with expertise in Node.js, React.js, Next.js, Flutter, and MongoDB. Based in Chennai, India.",
  keywords: ["Full Stack Developer", "React", "Node.js", "Next.js", "Flutter", "Chennai"],
  authors: [{ name: "Mohith Raagesh B" }],
  openGraph: {
    title: "Mohith Raagesh B — Full Stack Developer",
    description: "Building premium web and mobile experiences.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="antialiased bg-base text-white overflow-x-hidden">
        <LenisProvider>
          <GSAPProvider>
            <CustomCursor />
            <NoiseOverlay />
            <ScrollProgress />
            <HudFrame />
            <EasterEgg />
            {children}
          </GSAPProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
