"use client";

import React, { useState, useEffect } from "react";

export const CountdownTimer = ({ expiresAt }: { expiresAt: string | null }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!expiresAt) {
      setTimeLeft("Vĩnh viễn");
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const distance = expiry - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft("Đã hết hạn");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!timeLeft) return <span className="text-gray-400 text-xs">Loading...</span>;

  const isExpired = timeLeft === "Đã hết hạn";
  const isLifetime = timeLeft === "Vĩnh viễn";

  return (
    <div className={`font-semibold text-[10px] py-0.5 px-2 rounded-full inline-block ${
      isLifetime ? "bg-green-100 text-green-700" :
      isExpired ? "bg-red-100 text-red-700" :
      "bg-orange-100 text-orange-700"
    }`}>
      {timeLeft}
    </div>
  );
};
