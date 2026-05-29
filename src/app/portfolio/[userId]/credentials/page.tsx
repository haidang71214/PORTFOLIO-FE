"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useGetProfileQuery } from "@/store/queries/profile";
import ThemeJor1CredentialsPage from "@/app/ThemesPortfolioCommon/Jonarlist/ThemeJor1/credentials/page";
import { Loader2 } from "lucide-react";

export default function PortfolioDynamicCredentialsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = (params?.userId as string) || "";
  const queryThemeId = searchParams.get("themeId");

  const { data: profileData, isLoading } = useGetProfileQuery(userId, { skip: !userId });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#630ed4] dark:text-[#c084fc] w-10 h-10" />
      </div>
    );
  }

  const pf = profileData as any;
  const portfolio = pf?.data ?? pf;
  const activeThemeId = queryThemeId || portfolio?.theme_id || null;

  const INKWELL_ID = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";

  if (activeThemeId === INKWELL_ID) {
    return <ThemeJor1CredentialsPage />;
  }

  return (
    <div className="text-center py-10 font-medium">
      Giao diện chưa được thiết lập.
    </div>
  );
}
