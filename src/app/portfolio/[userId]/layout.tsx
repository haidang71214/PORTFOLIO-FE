"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useGetProfileQuery } from "@/store/queries/profile";
import { useGetOwnedTemplatesQuery } from "@/store/queries/templates";
import ThemeJor1Layout from "@/app/ThemesPortfolioCommon/Jonarlist/ThemeJor1/layout";
import { Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function PortfolioDynamicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = (params?.userId as string) || "";
  const queryThemeId = searchParams.get("themeId");

  const { data: profileData, isLoading: profileLoading } = useGetProfileQuery(userId, { skip: !userId });
  const { data: ownedTemplates, isLoading: ownedLoading } = useGetOwnedTemplatesQuery(undefined, { skip: !userId });

  if (profileLoading || ownedLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7ff] dark:bg-[#0b0912]">
        <Loader2 className="animate-spin text-[#630ed4] dark:text-[#c084fc] w-10 h-10" />
      </div>
    );
  }

  const pf = profileData as any;
  const portfolio = pf?.data ?? pf;
  
  // Resolve theme ID: either query param themeId or the user's active theme_id
  const activeThemeId = queryThemeId || portfolio?.theme_id || null;

  // The Inkwell Journalist template ID
  const INKWELL_ID = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";

  let content;
  if (activeThemeId === INKWELL_ID) {
    content = <ThemeJor1Layout>{children}</ThemeJor1Layout>;
  } else {
    content = (
      <div className="min-h-screen bg-[#faf7ff] dark:bg-[#0b0912] text-[#1d1a24] dark:text-[#e8e0f0] flex flex-col justify-between">
        {queryThemeId && (
          <header className="h-16 border-b border-black/10 dark:border-white/10 flex items-center justify-between px-6 bg-white/40 backdrop-blur-md sticky top-0 z-50">
            <Link href="/" className="font-bold text-lg text-[#630ed4] dark:text-[#c084fc]">
              PORTFOLIO Hub
            </Link>
            <Link href="/manager/portfolio" className="text-xs font-semibold bg-[#630ed4] text-white py-1.5 px-3 rounded hover:bg-[#630ed4]/80">
              Quay lại Manager
            </Link>
          </header>
        )}

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 p-8 rounded-2xl shadow-xl text-center backdrop-blur-md">
            <ShieldAlert size={48} className="text-amber-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-2">Chưa chọn Giao diện</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Người dùng này chưa áp dụng theme nào hoặc theme đang chọn không được hỗ trợ.
              {queryThemeId && " Hãy truy cập Manager để chọn và áp dụng giao diện!"}
            </p>
            {queryThemeId && (
              <Link href="/manager/portfolio" className="inline-block w-full bg-[#630ed4] text-white font-semibold py-2 rounded-lg hover:bg-[#630ed4]/80 transition-colors">
                Đi tới Thiết lập Portfolio
              </Link>
            )}
          </div>
        </main>

        <footer className="py-6 text-center border-t border-black/10 dark:border-white/10 text-xs text-zinc-400">
          © 2026 Portfolio Platform. All rights reserved.
        </footer>
      </div>
    );
  }

  return (
    <div className="mt-[-4rem] min-h-[calc(100vh+4rem)] relative z-40 bg-[#fcf8ed] dark:bg-[#0b0912]">
      {content}
    </div>
  );
}
