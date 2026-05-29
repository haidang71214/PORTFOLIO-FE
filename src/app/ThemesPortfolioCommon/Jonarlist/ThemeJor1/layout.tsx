"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

function ThemeJor1Nav({ userId }: { userId: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const themeId = searchParams.get("themeId") || "";

  return (
    <>
      {/* Desktop Sidenav */}
      <aside className="jor1-sidenav fixed top-0 left-0 bottom-0 w-64 bg-[#fcf8ed] border-r-4 border-double border-[#030813]/20 flex flex-col p-6 z-30 justify-between shadow-md">
        <div className="space-y-8">
          {/* Brand */}
          <div className="border-b-2 border-dashed border-[#030813]/20 pb-4 text-center">
            <h1 className="font-['Playfair_Display'] text-3xl font-black tracking-tight text-[#030813]">
              THE LEDGER
            </h1>
            <p className="font-['Bricolage_Grotesque'] text-[10px] uppercase tracking-widest text-[#b52426] mt-1">
              Truth in Press
            </p>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-4">
            {[
              { label: "Bio / Field Notes", icon: "badge", path: "" },
              { label: "Published Works", icon: "newspaper", path: "/articles" },
              { label: "Credentials", icon: "verified", path: "/credentials" },
            ].map((item) => {
              const active = item.path === ""
                ? pathname === `/portfolio/${userId}`
                : pathname === `/portfolio/${userId}${item.path}`;

              return (
                <Link
                  key={item.label}
                  href={`/portfolio/${userId}${item.path}${themeId ? `?themeId=${themeId}` : ""}`}
                  className={`flex items-center gap-3 px-3 py-2.5 transition-all font-['Bricolage_Grotesque'] font-semibold text-sm ${
                    active
                      ? "bg-[#b52426] text-white -rotate-1 shadow-sm"
                      : "text-[#45474c] hover:bg-[#b52426]/5 hover:text-[#b52426]"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidenav Footer */}
        {themeId && (
          <div className="border-t border-[#030813]/10 pt-4 text-center">
            <Link
              href="/manager/portfolio"
              className="inline-flex items-center gap-1.5 font-['Bricolage_Grotesque'] text-xs text-[#b52426] hover:underline"
            >
              <span className="material-symbols-outlined text-xs">arrow_back</span>
              Back to Manager
            </Link>
          </div>
        )}
      </aside>

      {/* Mobile Top Navbar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#fcf8ed] border-b-2 border-[#030813]/10 z-30 flex items-center justify-between px-4 shadow-sm">
        <h1 className="font-['Playfair_Display'] text-xl font-black text-[#030813]">
          THE LEDGER
        </h1>
        <div className="flex gap-2">
          {[
            { icon: "badge", path: "" },
            { icon: "newspaper", path: "/articles" },
            { icon: "verified", path: "/credentials" },
          ].map((item) => {
            const active = item.path === ""
              ? pathname === `/portfolio/${userId}`
              : pathname === `/portfolio/${userId}${item.path}`;

            return (
              <Link
                key={item.icon}
                href={`/portfolio/${userId}${item.path}${themeId ? `?themeId=${themeId}` : ""}`}
                className={`p-2 rounded transition-all ${
                  active ? "text-[#b52426]" : "text-[#45474c] hover:text-[#b52426]"
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
              </Link>
            );
          })}
        </div>
      </header>
    </>
  );
}

export default function ThemeJor1Layout({
  children,
}: {
  children: React.ReactNode;  
}) {
  const params = useParams();
  const userId = (params?.userId as string) || "";

  return (
    <>
      {/* Google Fonts for this theme */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Bricolage+Grotesque:wght@300;400;700&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />

      {/* Global decorative background for the theme */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(#dce9ff 1px, transparent 1px), linear-gradient(to bottom, #f8f9ff, #e5eeff)",
          backgroundSize: "24px 24px, 100% 100%",
          backgroundColor: "#f8f9ff",
        }}
      />

      {/* Floating ink pen decoration */}
      <div
        className="fixed top-24 left-10 opacity-[0.12] pointer-events-none z-0 animate-[jor1float_6s_ease-in-out_infinite]"
        style={{ animationDelay: "1s" }}
      >
        <span className="material-symbols-outlined text-[100px] text-[#030813] rotate-12 block">
          ink_pen
        </span>
      </div>
      {/* Floating coffee cup decoration */}
      <div className="fixed bottom-20 right-20 opacity-[0.07] pointer-events-none z-0 animate-[jor1float_7s_ease-in-out_infinite]">
        <span className="material-symbols-outlined text-[160px] text-[#a200ba] -rotate-12 block">
          coffee
        </span>
      </div>
      {/* Ink splats */}
      <div className="fixed top-1/2 left-1/4 w-4 h-4 rounded-full bg-[#030813] opacity-30 pointer-events-none z-0 blur-[0.5px]" />
      <div className="fixed top-3/4 right-1/4 w-6 h-6 rounded-full bg-[#a200ba] opacity-15 pointer-events-none z-0 blur-[0.5px]" />

      <style>{`
        @keyframes jor1float {
          0%   { transform: translate(0, 0px) rotate(0deg); }
          50%  { transform: translate(0, -15px) rotate(2deg); }
          100% { transform: translate(0, 0px) rotate(0deg); }
        }
        .jor1-sidenav { display: none; }
        @media (min-width: 768px) { .jor1-sidenav { display: flex; } }
        .material-symbols-outlined {
          font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
        }
      `}</style>

      <Suspense fallback={
        <div className="fixed top-0 left-0 bottom-0 w-64 bg-[#fcf8ed] border-r-4 border-double border-[#030813]/20 flex items-center justify-center z-30">
          <Loader2 className="animate-spin text-[#b52426] w-6 h-6" />
        </div>
      }>
        <ThemeJor1Nav userId={userId} />
      </Suspense>

      {/* Page content — offset from sidebar on md+ */}
      <div className="md:ml-64 relative z-10 min-h-screen px-6 md:px-10 pt-20 md:pt-10 pb-10 overflow-x-hidden">
        {children}
      </div>
    </>
  );
}
