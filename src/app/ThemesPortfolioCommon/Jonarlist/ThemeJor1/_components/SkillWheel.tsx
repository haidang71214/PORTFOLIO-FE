"use client";

interface SkillWheelProps {
  label: string;
  percent: number; // 0–100
  colSpan?: "1" | "2";
}

// SVG donut: radius=24, circumference=2π*24 ≈ 150.8
const CIRCUMFERENCE = 150.8;

export default function SkillWheel({
  label,
  percent,
  colSpan = "1",
}: SkillWheelProps) {
  const offset = CIRCUMFERENCE * (1 - percent / 100);

  return (
    <div
      className={`bg-white/60 p-4 border border-[#c6c6cc]/30 flex flex-col items-center ${
        colSpan === "2" ? "col-span-2" : ""
      }`}
      style={{
        clipPath:
          "polygon(0% 2%, 5% 0%, 10% 3%, 15% 1%, 20% 4%, 25% 2%, 30% 5%, 35% 2%, 40% 4%, 45% 1%, 50% 3%, 55% 0%, 60% 4%, 65% 2%, 70% 5%, 75% 2%, 80% 4%, 85% 1%, 90% 3%, 95% 0%, 100% 2%, 100% 98%, 95% 100%, 90% 97%, 85% 99%, 80% 96%, 75% 98%, 70% 95%, 65% 98%, 60% 96%, 55% 100%, 50% 97%, 45% 99%, 40% 96%, 35% 98%, 30% 95%, 25% 98%, 20% 96%, 15% 99%, 10% 97%, 5% 100%, 0% 98%)",
      }}
    >
      <div className="relative w-14 h-14 mb-2">
        <svg className="w-full h-full -rotate-90">
          <circle
            className="text-[#d4e4fc]"
            cx="28"
            cy="28"
            fill="transparent"
            r="24"
            stroke="currentColor"
            strokeWidth="4"
          />
          <circle
            className="text-[#b52426]"
            cx="28"
            cy="28"
            fill="transparent"
            r="24"
            stroke="currentColor"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeWidth="4"
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-['Bricolage_Grotesque'] text-[10px] font-bold text-[#030813]">
          {percent}%
        </div>
      </div>
      <span className="font-['Bricolage_Grotesque'] text-xs text-center text-[#030813]/80">
        {label}
      </span>
    </div>
  );
}
