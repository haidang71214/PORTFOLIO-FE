"use client";

const CREDENTIALS = [
  {
    icon: "description",
    title: "Advanced Investigative Journalism",
    subtitle: "Certification of Excellence in High-Stakes Reporting",
    stamp: "CERTIFIED",
    rotate: "-rotate-[2deg]",
  },
  {
    icon: "workspace_premium",
    title: "Excellent City Journalism Award 2025",
    subtitle: "Recognized for 'Impactful Urban Reporting'",
    stamp: "AWARDED",
    rotate: "rotate-[2deg]",
  },
  {
    icon: "verified",
    title: "Reuters Journalism Fellowship",
    subtitle: "International Reporting Excellence Program",
    stamp: "FELLOWSHIP",
    rotate: "-rotate-[1deg]",
  },
  {
    icon: "star",
    title: "Best Investigative Report — VJA 2024",
    subtitle: "Vietnam Journalists Association — Annual Awards",
    stamp: "WINNER",
    rotate: "rotate-[1deg]",
  },
];

const TIMELINE = [
  { year: "2025", event: "Excellent City Journalism Award" },
  { year: "2024", event: "VJA Best Investigative Report" },
  { year: "2023", event: "Reuters Fellowship — London" },
  { year: "2022", event: "Joined Báo Tuổi Trẻ Investigations Desk" },
  { year: "2021", event: "Zing News Digital Editor" },
];

export default function CredentialsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-20">
      {/* ── HEADER ── */}
      <header className="text-center relative">
        {/* Washi tape top accent */}
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-40 h-7 z-10"
          style={{ background: "rgba(181, 36, 38, 0.18)" }}
        />
        <div className="pt-6">
          <p className="font-['Bricolage_Grotesque'] text-xs uppercase tracking-[0.25em] text-[#b52426] mb-3">
            The Official Record
          </p>
          <h2 className="font-['Playfair_Display'] text-[40px] md:text-[56px] font-black text-[#030813] italic leading-tight">
            Credentials &amp; Honors
          </h2>
          <div className="h-[3px] w-24 bg-[#b52426] mx-auto mt-5 opacity-60" />
        </div>
      </header>

      {/* ── CREDENTIALS GRID ── */}
      <section
        className="bg-[#dce9ff] p-8 md:p-12 rounded-xl border-2 border-dashed border-[#030813]/20 relative shadow-inner"
      >
        {/* Corner decoration */}
        <div className="absolute -top-8 -right-8 opacity-[0.06] pointer-events-none">
          <span className="material-symbols-outlined text-[120px]">verified</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {CREDENTIALS.map((cred) => (
            <div
              key={cred.title}
              className={`relative bg-white p-7 shadow-md border border-[#c6c6cc] flex flex-col items-center text-center hover:scale-[1.03] transition-transform duration-300 ${cred.rotate}`}
            >
              {/* Icon */}
              <span className="material-symbols-outlined text-[#b52426] text-[52px] mb-4">
                {cred.icon}
              </span>
              <h5 className="font-['Playfair_Display'] text-xl font-bold text-[#030813] mb-2 leading-tight">
                {cred.title}
              </h5>
              <p className="font-['Source_Serif_4'] text-sm text-[#45474c] opacity-80 mb-6">
                {cred.subtitle}
              </p>

              {/* Ink stamp */}
              <div
                className="mt-auto border-[3px] double border-[#b52426] text-[#b52426] px-4 py-1 font-['Bricolage_Grotesque'] text-sm font-black uppercase tracking-[0.2em] opacity-75"
                style={{ transform: "rotate(-15deg)" }}
              >
                {cred.stamp}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section>
        <h3
          className="font-['Playfair_Display'] text-[32px] font-bold text-[#030813] mb-10 rotate-[1deg] inline-block"
          style={{ textDecoration: "underline wavy rgba(181,36,38,0.4)" }}
        >
          Career Timeline
        </h3>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[28px] top-0 bottom-0 w-[2px] bg-[#b52426]/20" />

          <div className="space-y-8">
            {TIMELINE.map((item, i) => (
              <div key={item.year} className="relative flex gap-8 items-start">
                {/* Dot */}
                <div
                  className="relative z-10 w-14 h-14 rounded-full bg-white border-[3px] border-[#b52426] flex items-center justify-center shadow-md flex-shrink-0"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                  }}
                >
                  <span className="font-['Bricolage_Grotesque'] text-[10px] font-bold text-[#b52426] text-center leading-tight">
                    {item.year}
                  </span>
                </div>

                {/* Content */}
                <div
                  className={`bg-white p-5 shadow-sm border border-[#c6c6cc]/40 flex-1 mt-1 ${
                    i % 2 === 0 ? "rotate-[0.5deg]" : "-rotate-[0.5deg]"
                  } hover:rotate-0 transition-transform duration-300`}
                >
                  <p className="font-['Playfair_Display'] text-lg font-bold text-[#030813]">
                    {item.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRESS QUOTE ── */}
      <section className="relative">
        {/* Washi decoration */}
        <div
          className="absolute -top-4 left-8 w-28 h-6 -rotate-[8deg]"
          style={{ background: "rgba(181,36,38,0.2)" }}
        />
        <blockquote
          className="bg-[#fcf8ed] p-10 md:p-14 shadow-[6px_6px_0_0_rgba(0,0,0,0.08)] -rotate-1"
          style={{
            clipPath:
              "polygon(0% 2%, 100% 0%, 100% 98%, 0% 100%)",
          }}
        >
          <span className="material-symbols-outlined text-[#b52426] text-[48px] opacity-30 block mb-4">
            format_quote
          </span>
          <p className="font-['Playfair_Display'] text-[22px] md:text-[28px] italic text-[#030813] leading-relaxed">
            "Journalism is not just a job. It is the ink that writes the first
            draft of history — and Hai Dang writes it with courage."
          </p>
          <footer className="mt-6 font-['Bricolage_Grotesque'] text-sm text-[#45474c]">
            — Vietnam Journalists Association, 2025
          </footer>
        </blockquote>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#d4e4fc] rounded-t-[40px] mt-10 border-t-4 border-double border-[#030813]/20 px-10 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="font-['Bricolage_Grotesque'] text-[#b52426] mb-1">
            The Ledger
          </p>
          <p className="font-['Source_Serif_4'] text-sm text-[#45474c]">
            © 2024–2026 Hai Dang Journal. All rights reserved.
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
