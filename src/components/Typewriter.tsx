"use client";

import React, { useState, useEffect } from "react";

interface TypewriterProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  delay?: number;
  className?: string;
}

export default function Typewriter({
  texts,
  speed = 40,
  deleteSpeed = 25,
  delay = 2000,
  className = "",
}: TypewriterProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // If the texts list changes, reset
    if (currentTextIndex >= texts.length) {
      setCurrentTextIndex(0);
      setDisplayedText("");
      setIsDeleting(false);
      return;
    }

    let timer: NodeJS.Timeout;
    const currentFullText = texts[currentTextIndex] || "";

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayedText((prev) => prev.slice(0, -1));
      }, deleteSpeed);
    } else {
      timer = setTimeout(() => {
        setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
      }, speed);
    }

    // Check if typing finished
    if (!isDeleting && displayedText === currentFullText) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, delay);
    }

    // Check if deleting finished
    if (isDeleting && displayedText === "") {
      setIsDeleting(false);
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentTextIndex, texts, speed, deleteSpeed, delay]);

  const renderContent = (text: string) => {
    const result: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      const starIndex = remaining.indexOf("*");
      if (starIndex === -1) {
        result.push(<span key={key++}>{remaining}</span>);
        break;
      }

      if (starIndex > 0) {
        result.push(<span key={key++}>{remaining.substring(0, starIndex)}</span>);
      }

      remaining = remaining.substring(starIndex + 1);
      const nextStarIndex = remaining.indexOf("*");

      if (nextStarIndex === -1) {
        result.push(
          <span key={key++} className="text-[#630ed4] dark:text-[#c084fc]">
            {remaining}
          </span>
        );
        break;
      } else {
        result.push(
          <span key={key++} className="text-[#630ed4] dark:text-[#c084fc]">
            {remaining.substring(0, nextStarIndex)}
          </span>
        );
        remaining = remaining.substring(nextStarIndex + 1);
      }
    }
    return result;
  };

  // Find the longest text to act as a layout placeholder to avoid layout shifting
  const longestText = texts.reduce((max, text) => (text.length > max.length ? text : max), "");

  return (
    <div className={`relative ${className}`}>
      {/* Invisible layout placeholder */}
      <div className="opacity-0 pointer-events-none select-none whitespace-pre-wrap">
        {renderContent(longestText)}
      </div>
      {/* Visible typing text */}
      <div className="absolute top-0 left-0 w-full h-full whitespace-pre-wrap">
        {renderContent(displayedText)}
        <span className="inline-block w-[3px] h-[0.8em] bg-[#630ed4] dark:bg-[#c084fc] ml-1 align-middle animate-pulse" />
      </div>
    </div>
  );
}
