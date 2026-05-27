interface ArticleSnippetCardProps {
  title: string;
  publisher: string;
  date: string;
  excerpt: string;
  icon: string; // Material Symbol name
  rotate?: string; // e.g. "rotate-2", "-rotate-1"
  hasWashi?: boolean;
}

const DECKLED =
  "polygon(0% 2%, 5% 0%, 10% 3%, 15% 1%, 20% 4%, 25% 2%, 30% 5%, 35% 2%, 40% 4%, 45% 1%, 50% 3%, 55% 0%, 60% 4%, 65% 2%, 70% 5%, 75% 2%, 80% 4%, 85% 1%, 90% 3%, 95% 0%, 100% 2%, 100% 98%, 95% 100%, 90% 97%, 85% 99%, 80% 96%, 75% 98%, 70% 95%, 65% 98%, 60% 96%, 55% 100%, 50% 97%, 45% 99%, 40% 96%, 35% 98%, 30% 95%, 25% 98%, 20% 96%, 15% 99%, 10% 97%, 5% 100%, 0% 98%)";

export default function ArticleSnippetCard({
  title,
  publisher,
  date,
  excerpt,
  icon,
  rotate = "rotate-1",
  hasWashi = false,
}: ArticleSnippetCardProps) {
  return (
    <div
      className={`relative bg-[#f8f9ff] p-6 shadow-sm hover:rotate-0 transition-transform duration-300 ${rotate}`}
      style={{ clipPath: DECKLED }}
    >
      {hasWashi && (
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-4 z-10 opacity-60"
          style={{ background: "rgba(181, 36, 38, 0.2)" }}
        />
      )}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-[#dce9ff] flex items-center justify-center rounded-full flex-shrink-0">
          <span className="material-symbols-outlined text-[#030813] text-xl">
            {icon}
          </span>
        </div>
        <div>
          <h4 className="font-['Playfair_Display'] text-lg font-bold text-[#030813] leading-tight mb-1">
            {title}
          </h4>
          <span className="font-['Source_Serif_4'] text-xs text-[#45474c]">
            {publisher}
          </span>
        </div>
      </div>
      <p className="font-['Source_Serif_4'] text-sm text-[#45474c] mb-4 leading-relaxed">
        {excerpt}
      </p>
      <div className="flex items-center justify-between">
        <span className="font-['Source_Serif_4'] text-xs italic text-[#45474c]">
          {date}
        </span>
        <span className="material-symbols-outlined text-[#b52426] text-xl">
          link
        </span>
      </div>
    </div>
  );
}
