"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Code,
  Palette,
  Newspaper,
  TrendingUp,
  Layers,
  CheckCircle2,
  ArrowUpRight,
  Mail,
} from "lucide-react";
import { useAuthModal } from "@/context/AuthModalContext";
import { useI18n } from "@/context/I18nContext";
import Typewriter from "@/components/Typewriter";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [selectedMajor, setSelectedMajor] = useState<string>("all");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { openLogin } = useAuthModal();
  const { t } = useI18n();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.04;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.04;
      setMousePos({ x: moveX, y: moveY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const categories = [
    { id: "all",        label: t("cat.all"),         icon: Layers },
    { id: "it",         label: t("cat.it"),          icon: Code },
    { id: "designer",   label: t("cat.designer"),    icon: Palette },
    { id: "journalist", label: t("cat.journalist"),  icon: Newspaper },
    { id: "economics",  label: t("cat.economics"),   icon: TrendingUp },
  ];

  const templates = [
    {
      id: "tpl-1",
      title: "Modern Dev Portfolio",
      major: "it",
      majorLabel: "IT / Dev",
      price: "350.000 ₫",
      tag: "Bán chạy",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ1L4F4q20T7iGxEG0ultDyI8C2-o3wGpyFSGSRxXK8waDzNwQDAfWZB3WW32uKP_vb8uv3bTltt2NYDBhodaCJhJ4-PanK6pILTPf036tWu4Ua2wp35DqX4ROWj-HeMcM7RPR0OFBD56iG6AfG5vB9tsNgf4EMZnXFpORgCE64fOs9DuZuh_CkU2b7N80gyzdSa3ROjqazrNh84ajs7cIaMUTmfC67Uv95hMZnjHuMFyJ3uRsHHJ3kptS8JVNUpvA2pp9uFVa3C4",
    },
    {
      id: "tpl-2",
      title: "Creative Designer Pro",
      major: "designer",
      majorLabel: "Design",
      price: "450.000 ₫",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqiCWvOxyLM-w4JOFrNVUFiO79evn1Is0NjPY8c8inA6_Nn5_MMFIWtxH_jfUjJkZ3ImfQW-SOOd5Boh2HZ3LPXh7OhirxO7LrzcsGX-svpsC6pJ2N6WSngxuYNv-0ac5KLDGL50FSXnWY1rkFvUYHZ5REh2XeE2SIQNT-kvbkm_oBI71SjLqBO4Jo2bzqNDxK2N2SWpo2RrE5h2_JFDHDSHIQ6nwCfeoz5kopFSF9X3tJ4zNcoutBQnaTHfvOIMwxJylEZOIJEks",
    },
    {
      id: "tpl-3",
      title: "Editorial Master",
      major: "journalist",
      majorLabel: "Journalist",
      price: "300.000 ₫",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCl8eA2H8dyxxXpR-YQ85XyuFj2ee6-VNh2DxuzN6TUauNfXojvKr_xonX415aQuICRxHsbwvRknaq4aldCuxW-5xGFz7ZwNN31_R9GLNSJ5_EJ3wai2V-sgj9SXlWEc3D4G-8g8pfnsWmYWNOWN4sSrW3NttU-gKbWoq-o0bIqiWNJhqUIKtO4hlC4bmFO81ngmfrFwVdRWRuS5fIj4rEv60TBTEhTSKxZ_fFBKWa8OpdDymKlsO4vK3GyJiM7WtJXHFFKWSXDkqM",
    },
    {
      id: "tpl-4",
      title: "Data Analyst Hub",
      major: "economics",
      majorLabel: "Economics",
      price: "500.000 ₫",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvVs_Gjn4n-DYtH0YEGqpstHfAYTuB7epyfNzwZ4llwAJDj6LynZZl6DABFz6pfQClsO_WB5YjrPEUNhHwZovOq1t6EPBWaxAkPpA8u7Es3hfritqgT15AkroAo-uYNBfvR5kYsXraEnu_r0YmkXgikbUr1gd046Oe8KGDX1wqNdQisxFqmaD04bkMhkR7oMMaGDUlvU3CZMSEJctkex98bY5Xk0pzX1G7DdgLA7odDPCRTAg1bRWancsi8HANU3__NnOk7cbnk4k",
    },
    {
      id: "tpl-5",
      title: "Minimalist Essential",
      major: "other",
      majorLabel: "All-purpose",
      price: "250.000 ₫",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsjRCub9pCVh0k6VCAYd9lIeoE9LDdNB1ierz6Ho0ke-JPWjb0Gfv2BycS1jwv6RKj9LlpaKoHhCdjiKmECK46zO0Br_7G8YgWYlwVjcDIdm4bg9hJDKeEO5xQmfVkWDRMtpCfXut-sFkTCivfgUupRtOpMKS65xC-XMzT_O7nPIZmoLI_dMb5e9GbsXJIw3gUyTLOr4pD0ZW8Dfrds1enXj65YV6Gf5-BS1Jn5sMCNF6GHMmpkowH5vnurD0wbeTExEmUj0HfBBw",
    },
    {
      id: "tpl-6",
      title: "Agency Showcase",
      major: "other",
      majorLabel: "Agency",
      price: "650.000 ₫",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCkLv00_bYIzslm_Ufcptzw20OfvQDnj43b9KbIT-cFwX_DSxX1L5CzPF99AOOVWVB1AqA5lY0nW0RozNNDfUrFOIJoFsZGneQRhoW7m5upPcWpbDyPm8FJ-IRVDC9qiDmR8KGY31pF02v419e5RfdPGltnTGVoMbgIqQYkFbnNh6b_7kaXNbMqRvISc7TJs7KmUWFK-T40IAZkgZa-MLmJN0EowkFZCllOY7sYXN6Q2IwJh1itwt6abD9Vp9eQNWPB4FBVm4503g",
    },
  ];

  const getMajorLabel = (major: string, fallback: string) => {
    const key = `cat.${major}`;
    const val = t(key);
    return val === key ? fallback : val;
  };

  const filteredTemplates = selectedMajor === "all"
    ? templates
    : templates.filter((t) => t.major === selectedMajor);

  return (
    <div className="min-h-screen bg-[#fef7ff] dark:bg-[#0b0912] text-[#1d1a24] dark:text-[#e8e0f0] font-sans transition-colors duration-300 overflow-x-hidden">

      {/* Subtle Parallax Blobs */}
      <div
        className="fixed z-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.08] bg-[#7c3aed] -top-32 -right-32 blur-[140px]"
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
      />
      <div
        className="fixed z-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.07] bg-[#a200ba] -bottom-20 -left-20 blur-[140px]"
        style={{ transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)` }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6">

        {/* ── HERO (Triggers on load) ── */}
        <section className="pt-28 pb-20 md:pt-36">
          <div className="grid md:grid-cols-[1fr_auto] gap-12 items-end">
            <div>
              {/* Label */}
              <Typewriter 
                texts={[t("hero.label")]} 
                speed={50} 
                deleteSpeed={25} 
                delay={2500} 
                className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[#630ed4] dark:text-[#c084fc] mb-5" 
              />

              {/* Big heading */}
              <h1 className="text-[42px] md:text-[68px] leading-[1.1] font-black tracking-[-0.04em] text-[#1d1a24] dark:text-white max-w-2xl min-h-[140px] md:min-h-[224px]">
                <Typewriter 
                  texts={[t("hero.title")]} 
                  speed={45} 
                  deleteSpeed={20} 
                  delay={3500} 
                />
              </h1>

              {/* Description */}
              <div className="mt-6 text-[16px] leading-[1.7] text-[#6b6378] dark:text-[#9d90b0] max-w-md min-h-[56px] md:min-h-[82px]">
                <Typewriter 
                  texts={[t("hero.desc")]} 
                  speed={20} 
                  deleteSpeed={10} 
                  delay={4000} 
                />
              </div>

              {/* Action Buttons (Slide Up immediately on load) */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                className="flex items-center gap-4 mt-8"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Link
                    href="/templates"
                    className="inline-flex items-center gap-2 bg-[#630ed4] text-white text-sm font-bold px-7 py-3.5 rounded-sm hover:bg-[#5209b2] transition-all shadow-[0_4px_14px_rgba(99,14,212,0.3)] dark:shadow-[0_4px_20px_rgba(192,132,252,0.15)]"
                  >
                    {t("hero.btn.all")} <ArrowUpRight size={16} />
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#1d1a24] dark:text-white border border-[#1d1a24]/20 dark:border-white/20 px-7 py-3.5 rounded-sm hover:bg-[#1d1a24]/5 dark:hover:bg-white/5 transition-all"
                  >
                    {t("hero.btn.custom")} <Mail size={14} />
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Stats block (Slide in from right immediately on load) */}
            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="hidden md:grid grid-cols-2 gap-px bg-[#1d1a24]/10 dark:bg-white/10 border border-[#1d1a24]/10 dark:border-white/10 self-end"
            >
              {[
                { n: "500+", l: t("stats.customers") },
                { n: "20+",  l: t("stats.templates") },
                { n: "4.9",  l: t("stats.rating") },
                { n: "24/7", l: t("stats.support") },
              ].map((s) => (
                <div key={s.l} className="bg-[#fef7ff] dark:bg-[#0b0912] p-6 min-w-[120px]">
                  <p className="text-2xl font-black text-[#630ed4] dark:text-[#c084fc]">{s.n}</p>
                  <p className="text-xs text-[#6b6378] dark:text-[#9d90b0] mt-0.5 font-medium">{s.l}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CATEGORY FILTERS (Scroll triggered, slides in from Left) ── */}
        <motion.section 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="pb-8 border-t border-[#1d1a24]/10 dark:border-white/10"
        >
          <div className="flex items-center gap-1 pt-6 overflow-x-auto no-scrollbar">
            {categories.map((cat) => {
              const active = selectedMajor === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedMajor(cat.id)}
                  className={`relative flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-wide uppercase whitespace-nowrap transition-all rounded-sm ${
                    active
                      ? "text-white"
                      : "text-[#6b6378] dark:text-[#9d90b0] hover:text-[#630ed4] dark:hover:text-[#c084fc]"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-[#630ed4] rounded-sm z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <cat.icon size={13} />
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* ── TEMPLATE GRID (Scroll triggered, cards slide up and fade in with stagger, resets on scroll up) ── */}
        <section className="pb-20">
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((tItem, index) => (
                <motion.div 
                  key={tItem.id} 
                  layout
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group border border-[#1d1a24]/10 dark:border-white/8 hover:border-[#630ed4]/40 transition-all duration-300 bg-white/60 dark:bg-white/[0.03] shadow-sm hover:shadow-md"
                >
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden bg-[#f0eaf8] dark:bg-[#1a1525]">
                    <img
                      src={tItem.image}
                      alt={tItem.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        {tItem.tag && (
                          <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-[#630ed4] dark:text-[#c084fc] mb-1">
                            {tItem.tag === "Bán chạy" ? t("tpl.bestSeller") : tItem.tag}
                          </span>
                        )}
                        <h3 className="font-bold text-[15px] text-[#1d1a24] dark:text-white leading-tight">
                          {tItem.title}
                        </h3>
                        <p className="text-xs text-[#6b6378] dark:text-[#9d90b0] mt-0.5">
                          {getMajorLabel(tItem.major, tItem.majorLabel)}
                        </p>
                      </div>
                      <span className="text-[15px] font-black text-[#630ed4] dark:text-[#c084fc] whitespace-nowrap ml-3 shrink-0">
                        {tItem.price}
                      </span>
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={`/templates/${tItem.id}`}
                        className="block w-full py-2.5 text-center text-xs font-bold tracking-widest uppercase bg-[#1d1a24] dark:bg-white text-white dark:text-[#0b0912] hover:bg-[#630ed4] dark:hover:bg-[#c084fc] dark:hover:text-white transition-colors"
                      >
                        {t("tpl.buy")}
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* ── WHY SECTION (Scroll triggered, left slides from left, right slides from right) ── */}
        <section className="pb-24 border-t border-[#1d1a24]/10 dark:border-white/10 pt-16 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left side (Slide in from Left) */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[#630ed4] dark:text-[#c084fc] mb-4">
                {t("why.label")}
              </p>
              <h2 className="text-[36px] md:text-[48px] font-black tracking-[-0.03em] leading-[1.1] text-[#1d1a24] dark:text-white mb-6">
                {t("why.title1")}
                <br />
                {t("why.title2")}
                <br />
                {t("why.title3")}
              </h2>
              <p className="text-[15px] leading-relaxed text-[#6b6378] dark:text-[#9d90b0] max-w-sm">
                {t("why.desc")}
              </p>
            </motion.div>

            {/* Right side (Slide in items with staggered delay from Right) */}
            <div className="space-y-0 border border-[#1d1a24]/10 dark:border-white/10">
              {[
                { t: t("why.item1.t"),     d: t("why.item1.d") },
                { t: t("why.item2.t"),     d: t("why.item2.d") },
                { t: t("why.item3.t"),     d: t("why.item3.d") },
                { t: t("why.item4.t"),     d: t("why.item4.d") },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                  className="flex gap-4 p-5 border-b border-[#1d1a24]/10 dark:border-white/10 last:border-b-0 group hover:bg-[#630ed4]/[0.03] transition-colors"
                >
                  <CheckCircle2 size={17} className="text-[#630ed4] dark:text-[#c084fc] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-[#1d1a24] dark:text-white">{item.t}</p>
                    <p className="text-xs text-[#6b6378] dark:text-[#9d90b0] mt-1">{item.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA STRIP (Scroll triggered, scale and lift up) ── */}
        <section className="pb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative bg-[#630ed4] overflow-hidden p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          >
            {/* dot grid */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "18px 18px" }}
            />
            <div className="relative z-10">
              <h2 className="text-[28px] md:text-[38px] font-black tracking-[-0.03em] leading-[1.1] text-white">
                {t("cta.title1")}<br />
                <span className="text-[#f5d0ff]">{t("cta.title2")}</span> {t("cta.title3")}
              </h2>
              <p className="mt-3 text-[14px] text-white/70 max-w-md">
                {t("cta.desc")}
              </p>
            </div>
            <div className="relative z-10 flex gap-3 flex-wrap shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-[#630ed4] text-sm font-black px-6 py-3 rounded-sm hover:bg-[#f5d0ff] active:scale-95 transition-all"
                >
                  {t("cta.btn.contact")} <ArrowUpRight size={15} />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={openLogin}
                  className="inline-flex items-center gap-2 border border-white/40 text-white text-sm font-bold px-6 py-3 rounded-sm hover:bg-white/10 active:scale-95 transition-all"
                >
                  {t("nav.login")}
                </button>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* ── FOOTER (Scroll triggered, columns stagger slide up) ── */}
      <footer className="border-t border-[#1d1a24]/10 dark:border-white/10 bg-[#fef7ff] dark:bg-[#0b0912]">
        <div className="max-w-[1280px] mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.5 }}
            className="col-span-2 md:col-span-1"
          >
            <p className="font-black text-[#630ed4] dark:text-[#c084fc] tracking-tight mb-3">
              {t("footer.brand")}
            </p>
            <p className="text-xs text-[#6b6378] dark:text-[#9d90b0] leading-relaxed whitespace-pre-line">
              {t("footer.copyright")}
            </p>
          </motion.div>
          {[
            { title: t("footer.products"), links: [[t("footer.products") === "Products" || t("footer.products") === "Sản phẩm" ? "Marketplace" : "Marketplace", "/templates"], [t("footer.products") === "Products" ? "Design Service" : "Dịch vụ thiết kế", "/contact"], [t("footer.products") === "Products" ? "Free" : "Miễn phí", "/free"]] },
            { title: t("footer.company"),  links: [["Privacy", "/privacy"], ["Terms", "/terms"], ["Careers", "/careers"]] },
            { title: t("footer.support"),  links: [["Support", "/support"], ["Affiliate", "/affiliate"], ["FAQ", "/faq"]] },
          ].map((col, idx) => (
            <motion.div 
              key={col.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.5, delay: (idx + 1) * 0.1 }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[#1d1a24] dark:text-white mb-3">{col.title}</p>
              <nav className="flex flex-col gap-2">
                {col.links.map(([label, href]) => (
                  <Link key={href} href={href} className="text-xs text-[#6b6378] dark:text-[#9d90b0] hover:text-[#630ed4] dark:hover:text-[#c084fc] transition-colors">
                    {label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          ))}
        </div>
      </footer>
    </div>
  );
}
