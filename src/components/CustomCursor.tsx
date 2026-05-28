"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";

// ══════════════════════════════════════════════════════
//  Types
// ══════════════════════════════════════════════════════
type CursorVariant = "default" | "hover" | "click" | "text";

// ══════════════════════════════════════════════════════
//  Component
// ══════════════════════════════════════════════════════
export default function CustomCursor() {
  const [mounted, setMounted]     = useState(false);
  const [variant,   setVariant]   = useState<CursorVariant>("default");
  const [isVisible, setIsVisible] = useState(false);
  const { resolvedTheme }         = useTheme();
  const isLight                   = resolvedTheme === "light";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Position
  const dotX = useMotionValue(-200);
  const dotY = useMotionValue(-200);

  // Spotlight
  const spotX = useSpring(dotX, { damping: 35, stiffness: 120, mass: 1.2 });
  const spotY = useSpring(dotY, { damping: 35, stiffness: 120, mass: 1.2 });
  const spotlightBg = useMotionTemplate`radial-gradient(
    circle 360px at ${spotX}px ${spotY}px,
    ${isLight ? "rgba(99, 14, 212, 0.22)" : "rgba(99, 14, 212, 0.13)"}   0%,
    ${isLight ? "rgba(162, 0, 186, 0.12)" : "rgba(162, 0, 186, 0.07)"}  35%,
    ${isLight ? "rgba(192, 132, 252, 0.05)" : "rgba(192, 132, 252, 0.03)"} 60%,
    transparent               80%
  )`;

  // Text tilt
  const rotateRaw  = useMotionValue(0);
  const textRotate = useSpring(rotateRaw, { damping: 18, stiffness: 280, mass: 0.4 });

  const textColor: Record<CursorVariant, string> = {
    default: "#ffffff", hover: "#ffffff", click: "#ffffff", text: "#ffffff",
  };
  const textFontSize: Record<CursorVariant, string> = {
    default: "10px", hover: "18px", click: "16px", text: "8px",
  };

  // Refs
  const mouseRef      = useRef({ x: -200, y: -200 });
  const prevMouseRef  = useRef({ x: -200, y: -200, t: 0 });
  const variantRef    = useRef<CursorVariant>("default");
  useEffect(() => { variantRef.current = variant; }, [variant]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const dx  = e.clientX - prevMouseRef.current.x;
      const dy  = e.clientY - prevMouseRef.current.y;
      const dt  = (now - prevMouseRef.current.t) || 16;

      rotateRaw.set(Math.max(-22, Math.min(22, (dx / dt) * 120)));

      dotX.set(e.clientX);
      dotY.set(e.clientY);

      mouseRef.current     = { x: e.clientX, y: e.clientY };
      prevMouseRef.current = { x: e.clientX, y: e.clientY, t: now };
      setIsVisible(true);
    };

    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);

    const onDown = () => {
      setVariant("click");
    };

    const onUp = () => {
      const el  = document.elementFromPoint(mouseRef.current.x, mouseRef.current.y) as HTMLElement | null;
      if (!el)  return setVariant("default");
      const tag = el.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea") setVariant("text");
      else if (tag === "a" || tag === "button" || !!el.closest("a, button")) setVariant("hover");
      else setVariant("default");
    };

    const onPointerOver = (e: PointerEvent) => {
      const el   = e.target as HTMLElement; if (!el) return;
      const tag  = el.tagName.toLowerCase();
      const role = el.getAttribute("role");
      if (tag === "input" || tag === "textarea") setVariant("text");
      else if (tag === "a" || tag === "button" || role === "button" || !!el.closest("a, button"))
        setVariant("hover");
      else setVariant("default");
    };

    document.addEventListener("mousemove",   onMove);
    document.addEventListener("mouseleave",  onLeave);
    document.addEventListener("mouseenter",  onEnter);
    document.addEventListener("mousedown",   onDown);
    document.addEventListener("mouseup",     onUp);
    document.addEventListener("pointerover", onPointerOver);

    return () => {
      document.removeEventListener("mousemove",   onMove);
      document.removeEventListener("mouseleave",  onLeave);
      document.removeEventListener("mouseenter",  onEnter);
      document.removeEventListener("mousedown",   onDown);
      document.removeEventListener("mouseup",     onUp);
      document.removeEventListener("pointerover", onPointerOver);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const opacity = isVisible ? 1 : 0;

  if (!mounted) return null;

  return (
    <>
      {/* Spotlight */}
      <motion.div className="fixed inset-0 pointer-events-none"
        style={{
          background: spotlightBg,
          opacity,
          zIndex: 9,
          mixBlendMode: isLight ? "multiply" : "screen",
          transition: "opacity 0.4s ease"
        }}
      />



      {/* Text label </> — no permanent ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none select-none"
        style={{
          x: dotX, y: dotY, rotate: textRotate,
          translateX: "-50%", translateY: "-50%",
          opacity, zIndex: 2147483647, // Maximum 32-bit z-index to stay above portals/popovers
          fontFamily: '"Menlo", "Fira Code", monospace',
          fontWeight: 700,
          letterSpacing: variant === "default" ? "-0.04em" : "0.01em",
          whiteSpace: "nowrap", lineHeight: 1,
          mixBlendMode: "difference",
        }}
        animate={{
          color:    textColor[variant],
          fontSize: textFontSize[variant],
          scale: variant === "hover" ? 1.15 : variant === "click" ? 0.85 : 1,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        initial={false}
      >
        {variant === "default" ? "</>" : variant === "hover" ? "↗" : variant === "click" ? "✦" : "TYPE"}
      </motion.div>
    </>
  );
}
