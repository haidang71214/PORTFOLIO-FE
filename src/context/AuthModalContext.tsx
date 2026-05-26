"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import LoginModal from "@/app/auth/_components/LoginModal";
import RegisterModal from "@/app/auth/_components/RegisterModal";
import ForgotPasswordModal from "@/app/auth/_components/ForgotPasswordModal";

type ModalType = "login" | "register" | "forgot" | null;

interface AuthModalContextValue {
  openLogin: () => void;
  openRegister: () => void;
  openForgot: () => void;
  closeAll: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue>({
  openLogin: () => {},
  openRegister: () => {},
  openForgot: () => {},
  closeAll: () => {},
});

export const useAuthModal = () => useContext(AuthModalContext);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<ModalType>(null);

  const openLogin    = useCallback(() => setActive("login"), []);
  const openRegister = useCallback(() => setActive("register"), []);
  const openForgot   = useCallback(() => setActive("forgot"), []);
  const closeAll     = useCallback(() => setActive(null), []);

  return (
    <AuthModalContext.Provider value={{ openLogin, openRegister, openForgot, closeAll }}>
      {children}

      {active === "login" && (
        <LoginModal
          onClose={closeAll}
          onSwitchToRegister={openRegister}
          onSwitchToForgot={openForgot}
        />
      )}
      {active === "register" && (
        <RegisterModal
          onClose={closeAll}
          onSwitchToForgot={openForgot}
        />
      )}
      {active === "forgot" && (
        <ForgotPasswordModal onClose={closeAll} />
      )}
    </AuthModalContext.Provider>
  );
}
