"use client";

import { useEffect, useRef } from "react";
import ArticleSnippetCard from "../_components/ArticleSnippetCard";
import Link from "next/link";

const DECKLED =
  "polygon(0% 2%, 5% 0%, 10% 3%, 15% 1%, 20% 4%, 25% 2%, 30% 5%, 35% 2%, 40% 4%, 45% 1%, 50% 3%, 55% 0%, 60% 4%, 65% 2%, 70% 5%, 75% 2%, 80% 4%, 85% 1%, 90% 3%, 95% 0%, 100% 2%, 100% 98%, 95% 100%, 90% 97%, 85% 99%, 80% 96%, 75% 98%, 70% 95%, 65% 98%, 60% 96%, 55% 100%, 50% 97%, 45% 99%, 40% 96%, 35% 98%, 30% 95%, 25% 98%, 20% 96%, 15% 99%, 10% 97%, 5% 100%, 0% 98%)";

const SNIPPETS = [
  {
    title: "Rural Revitalization",
    publisher: "The Daily Chronicle",
    date: "Jan 2024",
    excerpt:
      "A profile on forgotten artisan villages preserving ancient silk-weaving techniques.",
    icon: "article",
    rotate: "rotate-2",
  },
  {
    title: "Urban Policy Shifts",
    publisher: "Saigon Times",
    date: "Dec 2023",
    excerpt:
      "Investigating the impact of new zoning laws on small street-side businesses.",
    icon: "policy",
    rotate: "-rotate-1",
  },
  {
    title: "Cultural Echoes",
    publisher: "The Reviewer",
    date: "Nov 2023",
    excerpt:
      "The resurgence of vinyl and traditional operatic forms among urban youth.",
    icon: "music_note",
    rotate: "rotate-1",
    hasWashi: true,
  },
];

export default function ArticlesPage() {
  const feat1Ref = useRef<HTMLElement>(null);
  const feat2Ref = useRef<HTMLElement>(null);

  // Subtle mouse parallax on featured cards
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const mx = (e.clientX - window.innerWidth / 2) / 120;
      const my = (e.clientY - window.innerHeight / 2) / 120;
      if (feat1Ref.current)
        feat1Ref.current.style.transform = `translate(${mx * 1.2}px, ${my * 1.2}px) rotate(1deg)`;
      if (feat2Ref.current)
        feat2Ref.current.style.transform = `translate(${mx * 0.8}px, ${my * 0.8}px) rotate(-1deg)`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* ── HEADER ── */}
      <header className="relative">
        <div
          className="absolute -top-6 -left-4 w-32 h-7 -rotate-[15deg] z-20"
          style={{ background: "rgba(181,36,38,0.2)" }}
        />
        <div
          className="bg-[#eff4ff] p-8 md:p-12 rotate-1"
          style={{ clipPath: DECKLED }}
        >
          <h2 className="font-['Playfair_Display'] text-[36px] md:text-[52px] font-black text-[#030813] mb-4 leading-tight">
            The Ledger:{" "}
            <span className="italic font-light">Published Works</span>
          </h2>
          <div className="flex items-center gap-4 border-y-2 border-dashed border-[#c6c6cc] py-4 max-w-lg">
            <span className="font-['Bricolage_Grotesque'] text-sm uppercase tracking-widest text-[#45474c]">
              Selected Bibliography
            </span>
            <span className="flex-1 h-[2px] bg-[#c6c6cc]" />
            <span className="font-['Bricolage_Grotesque'] text-sm">
              Vol. 2024
            </span>
          </div>
        </div>
      </header>

      {/* ── FEATURED ARTICLES BENTO ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Featured 1 — Environment Beat (8/12 cols) */}
        <article
          ref={feat1Ref}
          className="lg:col-span-8 group relative transition-transform duration-200"
        >
          {/* Ink stamp */}
          <div className="absolute -top-3 -right-3 z-30 border-[3px] double border-[#b52426] text-[#b52426] px-3 py-0.5 font-['Bricolage_Grotesque'] text-sm font-black uppercase tracking-widest -rotate-[15deg] opacity-80 mix-blend-multiply">
            Published
          </div>

          <div
            className="bg-[#f8f9ff] p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:rotate-1 transition-all duration-300"
            style={{ clipPath: DECKLED }}
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Text */}
              <div className="flex-1">
                <div
                  className="inline-block px-4 py-1 mb-4"
                  style={{ background: "rgba(181,36,38,0.2)" }}
                >
                  <span className="font-['Bricolage_Grotesque'] text-sm text-[#b52426] font-bold">
                    Environment Beat
                  </span>
                </div>
                <h3 className="font-['Playfair_Display'] text-[28px] md:text-[32px] font-bold text-[#030813] mb-4 leading-tight">
                  Hành trình giải cứu những dòng sông đang 'chết'
                </h3>
                <p className="font-['Source_Serif_4'] text-[15px] text-[#45474c] mb-6 line-clamp-3 leading-relaxed">
                  An in-depth investigative report for Báo Tuổi Trẻ detailing
                  systemic efforts to revive dying river ecosystems across the
                  Mekong Delta, uncovering illegal industrial runoff and the
                  resilient communities fighting for their water sources.
                </p>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex flex-col">
                    <span className="font-['Bricolage_Grotesque'] text-[#030813] text-sm font-semibold">
                      Báo Tuổi Trẻ
                    </span>
                    <span className="font-['Source_Serif_4'] text-xs text-[#45474c] italic">
                      October 14, 2023
                    </span>
                  </div>
                  <Link
                    href="#"
                    className="flex items-center gap-2 font-['Bricolage_Grotesque'] text-sm text-[#b52426] font-bold hover:underline underline-offset-4 group"
                  >
                    Read Full Script{" "}
                    <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                      arrow_right_alt
                    </span>
                  </Link>
                </div>
              </div>

              {/* Polaroid image */}
              <div className="md:w-1/3 flex-shrink-0">
                <div className="bg-white p-2 shadow-[2px_2px_0_0_rgba(0,0,0,0.15)] -rotate-2">
                  <img
                    alt="River journey"
                    className="w-full aspect-square object-cover grayscale-[0.3] contrast-125"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxIAxo4RxuuJG9xZR6Q0c4ijBk7aS-zy_d3XmkaWq8JMnzZQJwfX_1qkl6GHhmrerLWzsPBsfty5mCB6QPKjPuu_5UHHvUn7w9_16v1NrJ5-oY2OWU6s9x9mNXSMb-W_-xNJQcZWDjMX3uKUtc-Vtp7UGqUqkt4Z4Tq0YsL2xjyeqoCB_v7vqC7D1jqNowinRxHw1D_dcFG6sfqDGPrInTOKsz4XuQ1043qQTGAgwFpgo0_VizXb4O7Pyf7s2NO5mR4gUKQQmLpg"
                  />
                  <div className="h-8 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#c6c6cc] text-base">
                      photo_camera
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Featured 2 — Tech & Media (4/12 cols) */}
        <article
          ref={feat2Ref}
          className="lg:col-span-4 group relative transition-transform duration-200"
        >
          <div
            className="bg-[#dce9ff] p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] h-full flex flex-col -rotate-1 hover:rotate-0 transition-transform duration-300"
            style={{ clipPath: DECKLED }}
          >
            <div className="mb-5">
              <div
                className="inline-block px-4 py-1 mb-4"
                style={{ background: "rgba(35,32,21,0.1)" }}
              >
                <span className="font-['Bricolage_Grotesque'] text-sm text-[#030813] font-bold">
                  Tech &amp; Media
                </span>
              </div>
              <h3 className="font-['Playfair_Display'] text-[24px] font-bold text-[#030813] leading-tight">
                Chuyển đổi số trong báo chí truyền thông
              </h3>
            </div>

            {/* Polaroid */}
            <div className="bg-white p-1.5 shadow-[2px_2px_0_0_rgba(0,0,0,0.15)] rotate-3 mb-5">
              <img
                alt="Digital transformation"
                className="w-full aspect-video object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkWdzpoJSA-gRWJbVccTE6Nu6ATUkYBbHU73auBujDg11TDAwcUo0qU5V3VOr9jOj2AieaeKUpGLsRUpqn4SiawlnqatKuh7uzxG9vYdVYijMgqSjlzNhupsjzDvT98OxTV6fZ_WcVqjr8DSL_CFLMz_ynFEkuySs4ODl50e3RRzl6qlmBgvmpFxvE2Ft1GHnqcMKOHP7qi3EBSNrZhfhhcT-5j0QpDsju6h10d4w_KN6A4YRLG111trq_gCeHh4ZEA-Wp7aZ9nw"
              />
            </div>

            <p className="font-['Source_Serif_4'] text-[15px] text-[#45474c] mb-6 flex-1 leading-relaxed">
              Analyzing the seismic shift from print to digital for Zing News,
              focusing on AI-driven newsrooms and the future of ethical
              journalism in a hyper-connected age.
            </p>

            <div className="mt-auto">
              <span className="block font-['Bricolage_Grotesque'] text-[#030813] text-sm font-semibold">
                Zing News
              </span>
              <span className="block font-['Source_Serif_4'] text-xs text-[#45474c] italic mb-4">
                March 02, 2024
              </span>
              <div className="h-[2px] bg-[#c6c6cc] w-full mb-4" />
              <Link
                href="#"
                className="font-['Bricolage_Grotesque'] text-sm text-[#b52426] font-bold hover:underline"
              >
                View Digital Ledger
              </Link>
            </div>
          </div>
        </article>

        {/* ── SNIPPET CARDS ── */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {SNIPPETS.map((s) => (
            <ArticleSnippetCard key={s.title} {...s} hasWashi={s.hasWashi} />
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t-2 border-dashed border-[#c6c6cc] bg-[#ccdbf4] flex flex-col items-center justify-center gap-4 text-center px-10 py-10 rounded-xl mt-10">
        <span className="font-['Playfair_Display'] text-[32px] italic text-[#4a4739]">
          The Lead
        </span>
        <div className="flex flex-wrap justify-center gap-8">
          {["Ethics Policy", "Newsletter", "Contact"].map((l) => (
            <a
              key={l}
              href="#"
              className="font-['Bricolage_Grotesque'] text-sm text-[#45474c] hover:text-[#030813] transition-all hover:scale-105"
            >
              {l}
            </a>
          ))}
        </div>
        <p className="font-['Bricolage_Grotesque'] text-sm text-[#0d1c2e] opacity-70">
          © 2024 Handwritten Newsroom. Pressed in Ink.
        </p>
      </footer>
    </div>
  );
}
