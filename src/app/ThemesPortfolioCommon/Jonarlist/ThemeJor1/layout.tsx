import type { Metadata } from "next";
import SideNav from "./_components/SideNav";

export const metadata: Metadata = {
  title: "The Inkwell | Journalist Portfolio",
  description:
    "A premium journalist portfolio theme — investigative reportage, urban culture, and socio-political storytelling.",
};

export default function ThemeJor1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <span className="material-symbols-outlined text-[160px] text-[#b52426] -rotate-12 block">
          coffee
        </span>
      </div>
      {/* Ink splats */}
      <div className="fixed top-1/2 left-1/4 w-4 h-4 rounded-full bg-[#030813] opacity-30 pointer-events-none z-0 blur-[0.5px]" />
      <div className="fixed top-3/4 right-1/4 w-6 h-6 rounded-full bg-[#b52426] opacity-15 pointer-events-none z-0 blur-[0.5px]" />

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

      {/* Side Navigation */}
      <SideNav />

      {/* Page content — offset from sidebar on md+ */}
      <div className="md:ml-64 relative z-10 min-h-screen px-6 md:px-10 py-10 overflow-x-hidden">
        {children}
      </div>
    </>
  );
}
