"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/login?modal=forgot-password");
  }, [router]);

  return (
    <div className="bg-auth-main min-h-screen flex items-center justify-center text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="btn-spinner" />
        <p className="font-body-md text-on-surface-variant opacity-75">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
