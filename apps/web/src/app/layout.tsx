import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { SiteHeader } from "@/components/app-launch-kit/site-header";
import "./globals.css";

const headingFont = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AppLaunchKit | App Store Launch Kits",
  description:
    "Generate App Store listing copy, screenshot captions, privacy guidance, and launch messaging from one app idea.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
