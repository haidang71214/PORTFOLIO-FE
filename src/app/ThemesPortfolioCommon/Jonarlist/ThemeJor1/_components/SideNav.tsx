"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BASE = "/ThemesPortfolioCommon/Jonarlist/ThemeJor1";

const navItems = [
  {
    href: BASE,
    label: "Profile",
    icon: "edit_note",
  },
  {
    href: `${BASE}/articles`,
    label: "Articles",
    icon: "auto_stories",
  },
  {
    href: `${BASE}/credentials`,
    label: "Credentials",
    icon: "military_tech",
  },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="jor1-sidenav fixed left-0 top-16 h-[calc(100vh-64px)] z-40 flex-col py-10 bg-[#eef2fb] shadow-[4px_0px_0px_0px_rgba(3,8,19,0.08)] w-64 border-r-2 border-[#030813]/10 hidden md:flex">
      {/* Brand */}
      <div className="px-8 mb-12">
        <h1 className="font-['Playfair_Display'] text-[28px] font-black text-[#030813] leading-tight">
          The Inkwell
        </h1>
        <p className="font-['Bricolage_Grotesque'] text-[13px] text-[#030813]/50 tracking-wide mt-1">
          Vol. 2026 — Press Journal
        </p>
      </div>

      {/* Nav Links */}
      <div className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === BASE
              ? pathname === BASE || pathname === BASE + "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-8 py-4 transition-all font-['Bricolage_Grotesque'] text-[16px] ${
                isActive
                  ? "-mr-0.5 rounded-l-lg border-y-2 border-l-2 border-[#b52426]/25 bg-[#b52426]/10 text-[#b52426] font-bold"
                  : "text-[#45474c] hover:text-[#030813] hover:bg-[#d4e4fc]/50"
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Contact Button */}
      <div className="px-8 mt-auto">
        <button className="w-full py-3.5 text-[#b52426] font-bold font-['Bricolage_Grotesque'] text-sm tracking-widest uppercase border border-[#b52426]/30 bg-[#b52426]/10 hover:bg-[#b52426]/20 hover:scale-105 transition-all">
          Contact Desk
        </button>
      </div>
    </nav>
  );
}
