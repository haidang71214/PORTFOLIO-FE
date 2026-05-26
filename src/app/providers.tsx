"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { AuthModalProvider } from "@/context/AuthModalContext";
import { I18nProvider } from "@/context/I18nContext";
import "@/app/auth/auth.css";

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: Readonly<ProvidersProps>) {
  const router = useRouter();
  return (
    <Provider store={store}>
      <HeroUIProvider navigate={router.push}>
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
          <I18nProvider>
            <AuthModalProvider>
              {children}
            </AuthModalProvider>
          </I18nProvider>
        </NextThemesProvider>
      </HeroUIProvider>
    </Provider>
  );
}

