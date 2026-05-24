import "./globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import { siteConfig } from "../config/site";
import { fontSans, fontMono } from "../config/fonts";

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
          "min-h-screen font-sans antialiased bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <Providers>
          {children}
          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
