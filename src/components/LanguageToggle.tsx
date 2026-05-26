"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { useI18n } from "@/context/I18nContext";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button isIconOnly variant="light" className="text-[#4B6382] dark:text-[#A0AEC0]">
        <div className="w-6 h-6 flex items-center justify-center font-bold text-xs">VI</div>
      </Button>
    );
  }

  const toggleLanguage = () => {
    setLocale(locale === "vi" ? "en" : "vi");
  };

  return (
    <Button
      isIconOnly
      aria-label="Toggle Language"
      className="text-[#4B6382] dark:text-[#A0AEC0] hover:text-[#630ed4] dark:hover:text-[#c084fc] transition-colors border border-zinc-200/40 dark:border-zinc-800/40 rounded-lg bg-zinc-100/50 dark:bg-zinc-800/20"
      onPress={toggleLanguage}
      variant="light"
      size="sm"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={locale}
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 5, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex items-center justify-center gap-1 font-mono font-bold text-xs"
        >
          <Globe size={12} className="opacity-70" />
          <span>{locale.toUpperCase()}</span>
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}
