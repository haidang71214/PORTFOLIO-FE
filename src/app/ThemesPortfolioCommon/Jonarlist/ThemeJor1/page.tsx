"use client";

import { useEffect, useRef } from "react";
import SkillWheel from "./_components/SkillWheel";

const DECKLED_LARGE =
  "polygon(0% 0%, 5% 1%, 10% 0%, 15% 2%, 20% 0%, 25% 1%, 30% 0%, 35% 2%, 40% 0%, 45% 1%, 50% 0%, 55% 2%, 60% 0%, 65% 1%, 70% 0%, 75% 2%, 80% 0%, 85% 1%, 90% 0%, 95% 2%, 100% 0%, 99% 5%, 100% 10%, 98% 15%, 100% 20%, 99% 25%, 100% 30%, 98% 35%, 100% 40%, 99% 45%, 100% 50%, 98% 55%, 100% 60%, 99% 65%, 100% 70%, 98% 75%, 100% 80%, 99% 85%, 100% 90%, 98% 95%, 100% 100%, 95% 99%, 90% 100%, 85% 98%, 80% 100%, 75% 99%, 70% 100%, 65% 98%, 60% 100%, 55% 99%, 50% 100%, 45% 98%, 40% 100%, 35% 99%, 30% 100%, 25% 98%, 20% 100%, 15% 99%, 10% 100%, 5% 98%, 0% 100%, 1% 95%, 0% 90%, 2% 85%, 0% 80%, 1% 75%, 0% 70%, 2% 65%, 0% 60%, 1% 55%, 0% 50%, 2% 45%, 0% 40%, 1% 35%, 0% 30%, 2% 25%, 0% 20%, 1% 15%, 0% 10%, 2% 5%)";

const SKILLS = [
  { label: "Interview", percent: 95 },
  { label: "Investigative", percent: 90 },
  { label: "Editing", percent: 85 },
  { label: "Photojournalism", percent: 80 },
  { label: "CMS", percent: 75, colSpan: "2" as const },
];

const EXPERIENCES = [
  {
    org: "Báo Tuổi Trẻ",
    period: "2023 — Hiện tại",
    desc: "Phóng viên mảng Xã hội & Điều tra. Thực hiện các tuyến bài dài kỳ về đô thị và các vấn đề dân sinh cấp thiết tại TP.HCM.",
    tags: ["#Investigative", "#UrbanPlanning"],
    rotate: "-rotate-1",
    washibottom: false,
  },
  {
    org: "Zing News",
    period: "2021 — 2023",
    desc: "Biên tập viên Đời sống. Phụ trách nội dung số, tối ưu hóa hiển thị bài viết trên nền tảng di động và mạng xã hội.",
    tags: ["#DigitalNews", "#Editing"],
    rotate: "rotate-1",
    washibottom: true,
  },
];

export default function ThemeJor1ProfilePage() {
  const cardRef = useRef<HTMLDivElement>(null);

  // Parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      if (cardRef.current) {
        const yPos = -(window.scrollY * 0.04);
        cardRef.current.style.transform = `translateY(${yPos}px) rotate(1deg)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-24">
      {/* ── PROFILE CARD ── */}
      <section id="bio" className="relative pt-4">
        {/* Washi tape accents */}
        <div
          className="absolute -top-6 -left-4 w-28 h-7 z-20 -rotate-[15deg]"
          style={{ background: "rgba(181, 36, 38, 0.2)", maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
        />
        <div
          className="absolute -bottom-4 -right-6 w-36 h-8 z-20 rotate-[10deg]"
          style={{ background: "rgba(181, 36, 38, 0.2)", maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
        />

        <div
          ref={cardRef}
          className="bg-[#fcf8ed] shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] p-8 md:p-14 relative rotate-[1deg]"
          style={{ clipPath: DECKLED_LARGE }}
        >
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left: info */}
            <div>
              <div className="inline-block px-4 py-1 bg-[#b52426] text-white font-['Bricolage_Grotesque'] text-sm -rotate-2 mb-6">
                PRESS PASS #712
              </div>
              <h2 className="font-['Playfair_Display'] text-[52px] md:text-[64px] font-black text-[#030813] leading-none mb-2">
                Hai Dang
              </h2>
              <p className="font-['Bricolage_Grotesque'] text-[#b52426] mb-6 text-lg tracking-wide">
                Chuyên ngành: Journalist
              </p>
              <p className="font-['Source_Serif_4'] text-[18px] text-[#0d1c2e] mb-8 italic leading-relaxed">
                "Finding the narrative threads in the chaos of the modern world.
                An investigative storyteller specializing in urban culture and
                socio-political shifts."
              </p>

              <div className="space-y-4 border-t border-[#030813]/10 pt-6">
                {[
                  { icon: "calendar_today", text: "Ngày tham gia: 26/05/2026" },
                  { icon: "alternate_email", text: "haidang71214@gmail.com" },
                  { icon: "location_on", text: "Saigon, Vietnam" },
                ].map((item) => (
                  <div key={item.icon} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#b52426] text-xl">
                      {item.icon}
                    </span>
                    <span className="font-['Source_Serif_4'] text-[16px] text-[#0d1c2e]">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: photo + skills */}
            <div className="relative space-y-8">
              {/* Polaroid photo */}
              <div className="bg-white p-3 shadow-lg -rotate-3 border-2 border-[#030813]/05">
                <img
                  alt="Hai Dang"
                  className="w-full grayscale contrast-125 object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuArVH90KvP8yeNk1KGtiAR2vb4h1Uo-K2mcOAyCNC6XFPPui_ZX4XRBbVGm1kgZ82tS0xCHebsurCJRsvDstYDa3pC8KWk3nFxron08IBIGC-Or6jldEtrABF3csS5tQ7k02JRrQsdfwNjkwzoA2L2de3ZXEIsLOvhy8RMi8Jk9M9TnbfEQbnoZaWxS0CI6NNlR9lNEAz_EkcfK-dGh2qqHos49T1w2iX6HQo6lD7gTMFRK4eRRb6IWb2TALOQjz8oABceeYwcDvQ"
                />
              </div>

              {/* Skills grid */}
              <div className="grid grid-cols-2 gap-3">
                {SKILLS.map((s) => (
                  <SkillWheel
                    key={s.label}
                    label={s.label}
                    percent={s.percent}
                    colSpan={s.colSpan ?? "1"}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE SECTION ── */}
      <section id="experience">
        <h3
          className="font-['Playfair_Display'] text-[36px] font-bold text-[#030813] mb-10 rotate-[1deg] inline-block"
          style={{ textDecoration: "underline wavy rgba(181,36,38,0.4)" }}
        >
          Field Notes: Experience
        </h3>

        <div className="space-y-10">
          {EXPERIENCES.map((exp) => (
            <div key={exp.org} className="relative group">
              {/* Washi tape */}
              <div
                className={`absolute z-10 w-24 h-7 opacity-60 ${
                  exp.washibottom
                    ? "-bottom-4 right-10 rotate-12"
                    : "-top-4 left-10"
                }`}
                style={{ background: "rgba(181, 36, 38, 0.2)" }}
              />
              <div
                className={`bg-white p-8 md:p-10 shadow-lg border border-[#c6c6cc]/40 transition-transform duration-300 ${exp.rotate} group-hover:rotate-0`}
              >
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <h4 className="font-['Playfair_Display'] text-2xl font-bold text-[#b52426]">
                    {exp.org}
                  </h4>
                  <span className="font-['Bricolage_Grotesque'] text-[#45474c] opacity-70 text-sm">
                    {exp.period}
                  </span>
                </div>
                <p className="font-['Source_Serif_4'] text-[16px] text-[#0d1c2e] mb-4 leading-relaxed">
                  {exp.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-['Bricolage_Grotesque'] px-2 py-1 bg-[#e5eeff] rounded italic"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#d4e4fc] rounded-t-[40px] mt-10 border-t-4 border-double border-[#030813]/20 px-10 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="font-['Bricolage_Grotesque'] text-[#b52426] mb-1">
            The Ledger
          </p>
          <p className="font-['Source_Serif_4'] text-sm text-[#45474c]">
            © 2024–2026 Hai Dang Journal. All rights reserved. Hand-pressed in
            Saigon.
          </p>
        </div>
        <div className="flex gap-6">
          <a
            href="#"
            className="font-['Source_Serif_4'] text-sm text-[#45474c] hover:text-[#b52426] transition-colors"
          >
            Editorial Ethics
          </a>
          <a
            href="#"
            className="font-['Source_Serif_4'] text-sm text-[#45474c] hover:text-[#b52426] transition-colors"
          >
            Contact Bureau
          </a>
        </div>
      </footer>
    </div>
  );
}
