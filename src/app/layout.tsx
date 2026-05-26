import "./globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import { siteConfig } from "../config/site";
import { fontSans, fontMono } from "../config/fonts";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html suppressHydrationWarning className="!pr-0" lang="en">
      <head />
      <body
        suppressHydrationWarning
        className={clsx(
          "min-h-screen font-sans antialiased bg-background text-foreground",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <Providers>
          <div className="relative flex flex-col min-h-screen">
            <Navbar />
            <main className="w-full flex-grow pt-16">
              {children}
            </main>
          </div>
          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
