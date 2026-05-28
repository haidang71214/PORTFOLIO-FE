"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/utils/redux";
import { useUpdateMeMutation, useGetMeQuery } from "@/store/queries/auth";
import { useAuthModal } from "@/context/AuthModalContext";
import { useI18n } from "@/context/I18nContext";
import webStorageClient from "@/utils/webStorageClient";
import { useTheme } from "next-themes";
import {
  User as UserIcon,
  Shield,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useI18n();
  const { openLogin } = useAuthModal();
  const { user, isAuthenticatedAccount } = useAppSelector((state) => state.auth);
  const { resolvedTheme } = useTheme();

  const floatingShapes = [
    { text: "✦", size: "text-7xl", color: "text-[#630ed4]/10 dark:text-[#c084fc]/10", top: "10%", left: "5%", rotateSpeed: 12 },
    { text: "▲", size: "text-6xl", color: "text-[#a200ba]/8 dark:text-[#f5d0ff]/8", top: "20%", left: "85%", rotateSpeed: -15 },
    { text: "</>", size: "text-7xl font-mono", color: "text-[#630ed4]/10 dark:text-[#c084fc]/10", top: "45%", left: "8%", rotateSpeed: 9 },
    { text: "✚", size: "text-6xl", color: "text-zinc-400/10 dark:text-zinc-600/10", top: "75%", left: "88%", rotateSpeed: 14 },
    { text: "⚙️", size: "text-7xl", color: "text-zinc-400/8 dark:text-zinc-600/8", top: "60%", left: "82%", rotateSpeed: -11 },
  ];

  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [major, setMajor] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // Custom states
  const [showPassword, setShowPassword] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "> Initializing protocol...",
  ]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check token existence
  const hasToken = typeof window !== "undefined" && !!webStorageClient.getToken();
  // Fetch/Revalidate user on page mount/reload
  const { isFetching } = useGetMeQuery(undefined, { skip: !hasToken });

  // Mutation
  const [updateMe, { isLoading }] = useUpdateMeMutation();

  // Populate form with current user data
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setMajor(user.major || "other");
      setRole(user.role || "user");
      setAvatarPreview(user.images_url || null);
    }
  }, [user]);

  // If not authenticated, prompt login (only if not currently checking the token)
  useEffect(() => {
    if (!isFetching && !isAuthenticatedAccount) {
      if (!hasToken) {
        toast.error("Vui lòng đăng nhập để chỉnh sửa thông tin cá nhân!");
        openLogin();
      }
    }
  }, [isAuthenticatedAccount, isFetching, hasToken, openLogin]);

  // System terminal feed simulation
  useEffect(() => {
    const logsList = [
      "> Localizing terminal interface...",
      "> Loading editorial assets...",
      "> Verifying credentials...",
      "> [SUCCESS] Welcome back, Writer.",
      "> Syncing with global archives...",
      "> Analyzing stylistic variance...",
      "> Cache optimized for high-velocity prose.",
      "> Warning: Ink levels critical in Sector 7.",
      "> Auto-save protocol engaged.",
      "> Processing profile metadata...",
    ];
    let logIndex = 0;
    const interval = setInterval(() => {
      setTerminalLogs((prev) => {
        const nextLogs = [...prev, logsList[logIndex % logsList.length]];
        if (nextLogs.length > 5) {
          nextLogs.shift();
        }
        return nextLogs;
      });
      logIndex++;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Particle background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    const initParticles = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < 25; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: Math.random() * 0.4 - 0.2,
          speedY: Math.random() * 0.4 - 0.2,
          opacity: Math.random() * 0.4,
        });
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const color = resolvedTheme === "dark" ? "192, 132, 252" : "99, 14, 212";
        ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animateParticles);
    };

    const handleResize = () => {
      initParticles();
    };

    window.addEventListener("resize", handleResize);
    initParticles();
    animateParticles();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh tối đa là 5MB!");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticatedAccount) {
      toast.error("Bạn chưa đăng nhập!");
      openLogin();
      return;
    }

    if (!username.trim()) {
      toast.error("Tên hiển thị không được để trống!");
      return;
    }

    try {
      const payload: any = {
        username: username.trim(),
        email: email.trim(),
        major,
        role,
      };

      if (password) {
        payload.password = password;
      }
      if (avatarFile) {
        payload.images = avatarFile;
      }

      await updateMe(payload).unwrap();
      toast.success("Cập nhật thông tin cá nhân thành công!");
      setPassword(""); // Clear password field
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Đã xảy ra lỗi khi cập nhật thông tin!");
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 bg-[#fef7ff] dark:bg-[#0b0912] transition-colors duration-300">
        <Loader2 className="animate-spin text-[var(--circuit-color)] w-12 h-12" />
        <p className="mt-4 font-mono text-xs text-[#6b6378] dark:text-zinc-400">Verifying credentials...</p>
      </div>
    );
  }

  if (isFetching && !isAuthenticatedAccount) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 bg-[#fef7ff] dark:bg-[#0b0912] transition-colors duration-300">
        <Loader2 className="animate-spin text-[var(--circuit-color)] w-12 h-12" />
        <p className="mt-4 font-mono text-xs text-[#6b6378] dark:text-zinc-400">Verifying credentials...</p>
      </div>
    );
  }

  if (!isAuthenticatedAccount) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 bg-[#fef7ff] dark:bg-[#0b0912] transition-colors duration-300">
        <style>{`
          .glass-panel-unauth {
            backdrop-filter: blur(8px);
            background: rgba(255, 255, 255, 0.4);
            border: 1px solid rgba(3, 8, 13, 0.1);
          }
          .dark .glass-panel-unauth {
            background: rgba(22, 20, 38, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.08);
          }
        `}</style>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-md glass-panel-unauth p-8 shadow-xl rounded-xl">
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-16 h-16 rounded-full bg-[#630ed4]/10 dark:bg-[#c084fc]/10 flex items-center justify-center text-[#630ed4] dark:text-[#c084fc] mb-2">
                <Shield size={32} />
              </div>
              <h2 className="text-xl font-bold text-[#030813] dark:text-zinc-100 font-headline-lg transition-colors">{t("profile.unauth.title")}</h2>
              <p className="text-sm text-[#45474c] dark:text-zinc-300 font-body-md transition-colors">
                {t("profile.unauth.desc")}
              </p>
              <button
                onClick={openLogin}
                className="mt-6 w-full bg-[#630ed4] hover:bg-[#5209b2] text-white font-semibold py-3 rounded-lg transition-all"
              >
                {t("profile.unauth.btn")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const majorOptions = [
    { key: "journalist", title: "Phóng sự điều tra", desc: "Investigative Journalism" },
    { key: "it", title: "Phát triển phần mềm", desc: "Software Development / IT" },
    { key: "designer", title: "Thiết kế sáng tạo", desc: "Creative Design" },
    { key: "economics", title: "Phân tích kinh tế", desc: "Economic Analysis" },
    { key: "other", title: "Ký sự hiện trường / Khác", desc: "Field Reporting / Other" },
  ];

  return (
    <div className="min-h-screen bg-[#fef7ff] dark:bg-[#0b0912] text-[#1d1a24] dark:text-[#e8e0f0] transition-colors duration-300 overflow-x-hidden selection:bg-[#ff5a55] selection:text-white relative">
      {/* Dynamic Styling */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Source+Serif+4:ital,wght@0,400;0,700;1,400&family=Bricolage+Grotesque:wght@300;400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        :root {
          --grid-color: rgba(3, 8, 19, 0.05);
          --deckled-bg: #ffffff;
          --deckled-border: rgba(3, 8, 13, 0.05);
          --deckled-shadow: rgba(3, 8, 13, 0.1);
          --washi-bg: rgba(99, 14, 212, 0.12);
          --washi-text: #630ed4;
          --avatar-ring-color: #630ed4;
          --avatar-ring-glow: rgba(99, 14, 212, 0.5);
          --circuit-color: #630ed4;
          --circuit-glow: rgba(99, 14, 212, 0.4);
        }
        .dark {
          --grid-color: rgba(255, 255, 255, 0.03);
          --deckled-bg: #161426;
          --deckled-border: rgba(255, 255, 255, 0.1);
          --deckled-shadow: rgba(0, 0, 0, 0.4);
          --washi-bg: rgba(192, 132, 252, 0.15);
          --washi-text: #c084fc;
          --avatar-ring-color: #c084fc;
          --avatar-ring-glow: rgba(192, 132, 252, 0.5);
          --circuit-color: #c084fc;
          --circuit-glow: rgba(192, 132, 252, 0.4);
        }

        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .deckled-edge {
          background-color: var(--deckled-bg);
          border: 1px solid var(--deckled-border);
          box-shadow: 4px 4px 0px 0px var(--deckled-shadow);
          clip-path: polygon(0% 0%, 100% 0%, 100% 98%, 99% 99%, 98% 98%, 97% 100%, 96% 98%, 95% 99%, 94% 98%, 93% 100%, 92% 98%, 91% 99%, 90% 98%, 89% 100%, 88% 98%, 87% 99%, 86% 98%, 85% 100%, 0% 100%);
        }
        .washi-tape {
          background-color: var(--washi-bg);
          color: var(--washi-text);
          backdrop-filter: blur(2px);
          transform: rotate(-1deg);
        }
        .scanning-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--circuit-color);
          box-shadow: 0 0 15px var(--circuit-color);
          animation: scan 3s linear infinite;
        }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        
        .data-stream {
          background-image: 
            linear-gradient(var(--grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: grid-drift 20s linear infinite;
        }
        @keyframes grid-drift {
          from { background-position: 0 0; }
          to { background-position: 40px 40px; }
        }

        .glass-panel {
          backdrop-filter: blur(8px);
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(3, 8, 13, 0.1);
        }
        .dark .glass-panel {
          background: rgba(22, 20, 38, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .avatar-ring {
          position: absolute;
          inset: -4px;
          border: 2px solid transparent;
          border-top-color: var(--avatar-ring-color);
          border-radius: 50%;
          animation: spin-glow 4s linear infinite;
          filter: drop-shadow(0 0 5px var(--avatar-ring-glow));
        }
        @keyframes spin-glow {
          0% { transform: rotate(0deg); opacity: 0.5; }
          50% { opacity: 1; }
          100% { transform: rotate(360deg); opacity: 0.5; }
        }

        @keyframes fade-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-entrance {
          animation: fade-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }

        .glitch-hover:hover {
          animation: glitch-pulse 0.3s infinite;
        }
        @keyframes glitch-pulse {
          0% { transform: translate(0); text-shadow: none; }
          20% { transform: translate(-2px, 1px); text-shadow: 2px 0 #e879f9; }
          40% { transform: translate(2px, -1px); text-shadow: -2px 0 #eff4ff; }
          60% { transform: translate(-1px, -1px); }
          100% { transform: translate(0); }
        }

        .circuit-border {
          position: relative;
          transition: all 0.3s ease;
        }
        .circuit-border::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--circuit-color);
          transition: width 0.4s ease;
          box-shadow: 0 0 8px var(--circuit-glow);
        }
        .circuit-border:focus-within::before {
          width: 100%;
        }
        .circuit-border::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 2px;
          height: 0;
          background: var(--circuit-color);
          transition: height 0.2s ease 0.3s;
        }
        .circuit-border:focus-within::after {
          height: 12px;
        }

        .particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .font-headline-lg {
          font-family: 'Playfair Display', serif;
        }
        .font-body-md {
          font-family: 'Source Serif 4', serif;
        }
        .font-label-handwritten {
          font-family: 'Bricolage Grotesque', sans-serif;
        }
      `}</style>

      {/* Decorative Ambient Background & Parallax Blobs */}
      <div className="fixed inset-0 data-stream pointer-events-none z-0"></div>
      <div className="fixed z-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.06] bg-[#7c3aed] -top-32 -right-32 blur-[120px]" />
      <div className="fixed z-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.05] bg-[#a200ba] -bottom-20 -left-20 blur-[120px]" />
      <canvas ref={canvasRef} className="particles" id="particles-canvas"></canvas>

      {/* Floating Tech 2D Shapes */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {floatingShapes.map((shape, idx) => (
          <motion.div
            key={idx}
            className={`absolute ${shape.size} ${shape.color} font-bold select-none`}
            style={{
              top: shape.top,
              left: shape.left,
            }}
            animate={{
              y: [120, -120],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              y: {
                duration: 10 + (idx % 3) * 4,
                repeat: Infinity,
                ease: "linear",
              },
              opacity: {
                duration: 10 + (idx % 3) * 4,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.2, 0.8, 1],
              }
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.abs(shape.rotateSpeed),
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {shape.text}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="min-h-screen relative z-10 px-6 md:px-10 py-12 max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 relative"
        >
          <div className="absolute -top-6 -left-6 opacity-10 font-mono text-[10px] leading-tight">
            SYS_STATUS: ACTIVE<br />ENCRYPTION: AES-256<br />LOG_ID: 99x-EDITORIAL
          </div>
          <h2 className="font-headline-lg text-3xl md:text-4xl text-[#030813] dark:text-white mb-2 font-bold transition-colors">{t("profile.title")}</h2>
          <div className="flex items-center gap-4">
            <span className="px-2 py-0.5 washi-tape font-label-handwritten text-sm">{t("profile.subTitle")}</span>
            <code className="font-mono text-xs bg-[var(--circuit-color)]/5 text-[var(--circuit-color)] px-2 py-0.5 rounded transition-colors">/settings/user-identity</code>
          </div>
          <div className="w-full h-[2px] bg-gradient-to-r from-[var(--circuit-color)]/40 via-transparent to-transparent mt-6"></div>
        </motion.header>
 
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Left Column: Avatar & System Metadata */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            {/* Profile Paper Sheet */}
            <motion.div
              initial={{ opacity: 0, x: -60, scale: 0.95, rotate: -5 }}
              animate={{ opacity: 1, x: 0, scale: 1, rotate: -0.5 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="deckled-edge p-8 rotate-[-0.5deg] relative"
            >
              <div className="absolute top-2 right-2 flex gap-1">
                <div className="w-1.5 h-1.5 bg-[var(--circuit-color)] rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-[var(--circuit-color)]/30 rounded-full"></div>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                  <div className="avatar-ring"></div>
                  <div className="w-40 h-40 rounded-full border-4 border-dashed border-[var(--circuit-color)]/20 p-2 mb-6 transition-transform group-hover:rotate-12 duration-500">
                    <div className="w-full h-full rounded-full overflow-hidden relative scanning-effect bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      {avatarPreview ? (
                        <img className="w-full h-full object-cover" alt={username} src={avatarPreview} />
                      ) : (
                        <UserIcon className="w-16 h-16 text-zinc-400" />
                      )}
                    </div>
                  </div>
                  <button className="absolute bottom-6 right-2 bg-[#030813] text-white p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center border-2 border-white/20 z-20">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
 
                <p className="font-label-handwritten text-[var(--circuit-color)] font-bold text-lg transition-colors">
                  {role === "admin" ? t("profile.role.admin") : t("profile.role.user")}
                </p>
                <p className="font-mono text-xs text-[#45474c] dark:text-zinc-400 opacity-50 uppercase tracking-widest mt-1">
                  ID: {user?.id ? user.id.substring(0, 8).toUpperCase() : "SCRIBBLE"}
                </p>
              </div>
 
              <div className="mt-8 pt-6 border-t border-dashed border-[#c6c6cc] dark:border-zinc-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-[#45474c] dark:text-zinc-400">{t("profile.uptime")}</span>
                  <span className="text-xs font-mono text-[var(--circuit-color)]">99.8%</span>
                </div>
                <div className="w-full h-1 bg-[#d4e4fc] dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="w-[99.8%] h-full bg-[var(--circuit-color)]"></div>
                </div>
              </div>
            </motion.div>
 
            {/* Technical Snippet Card / System Feed */}
            <motion.div
              initial={{ opacity: 0, y: 50, x: -30 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
              className="bg-[#030813] p-6 text-white rounded-lg shadow-xl relative overflow-hidden h-40"
              id="system-terminal"
            >
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:10px_10px]"></div>
              <h4 className="font-mono text-[10px] text-[var(--circuit-color)] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--circuit-color)] animate-pulse rounded-full"></span> {t("profile.systemFeed")}
              </h4>
              <div className="font-mono text-[11px] leading-relaxed text-zinc-300" id="terminal-content">
                {terminalLogs.map((log, idx) => {
                  const isSuccess = log.includes("[SUCCESS]");
                  const isWarning = log.includes("Warning");
                  let colorClass = "text-zinc-400";
                  if (isSuccess) colorClass = "text-green-400";
                  else if (isWarning) colorClass = "text-fuchsia-400";
                  else if (log.startsWith("> ")) colorClass = "text-[var(--circuit-color)]";
 
                  return (
                    <div key={idx} className={colorClass}>
                      {log}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
 
          {/* Right Column: Settings Form */}
          <motion.section
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="col-span-12 lg:col-span-8 flex flex-col gap-6"
          >
            {/* Main Form Section */}
            <div className="glass-panel p-8 md:p-10 rounded-xl relative overflow-hidden transition-colors">
              <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-[#76777c] dark:text-zinc-500 pointer-events-none text-right">
                FORM_VER: 2.0.4<br />SECURE_SHELL: ON
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Username Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                    className="space-y-2"
                  >
                    <label className="font-label-handwritten text-[#030813] dark:text-zinc-100 flex items-center gap-2 font-bold transition-colors">
                      <span className="material-symbols-outlined text-sm">person</span>
                      {t("profile.form.username")}
                    </label>
                    <div className="relative group circuit-border">
                      <input
                        className="w-full bg-white/30 dark:bg-white/5 border-b-2 border-[#030813]/10 dark:border-white/10 text-[#0d1c2e] dark:text-[#e8e0f0] focus:border-transparent focus:ring-0 transition-all font-body-md py-3 px-4 outline-none focus:outline-none"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </motion.div>
 
                  {/* Email Field */}
                  <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
                    className="space-y-2"
                  >
                    <label className="font-label-handwritten text-[#030813] dark:text-zinc-100 flex items-center gap-2 font-bold transition-colors">
                      <span className="material-symbols-outlined text-sm">alternate_email</span>
                      {t("profile.form.email")}
                    </label>
                    <div className="relative group circuit-border">
                      <input
                        className="w-full bg-white/30 dark:bg-white/5 border-b-2 border-[#030813]/10 dark:border-white/10 text-[#0d1c2e] dark:text-[#e8e0f0] focus:border-transparent focus:ring-0 transition-all font-body-md py-3 px-4 outline-none focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                        type="email"
                        value={email}
                        disabled
                      />
                    </div>
                  </motion.div>
 
                  {/* Password Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.6 }}
                    className="space-y-2 md:col-span-2"
                  >
                    <label className="font-label-handwritten text-[#030813] dark:text-zinc-100 flex items-center gap-2 font-bold transition-colors">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      {t("profile.form.password")}
                    </label>
                    <div className="relative group circuit-border">
                      <input
                        className="w-full bg-white/30 dark:bg-white/5 border-b-2 border-[#030813]/10 dark:border-white/10 text-[#0d1c2e] dark:text-[#e8e0f0] focus:border-transparent focus:ring-0 transition-all font-body-md py-3 px-4 pr-12 outline-none focus:outline-none"
                        placeholder="••••••••••••"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#45474c] dark:text-zinc-400 cursor-pointer hover:text-[var(--circuit-color)] z-10 select-none transition-colors"
                      >
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </div>
                  </motion.div>
                </div>
 
                {/* Selector Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                  {/* Specialty */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.7 }}
                    className="space-y-4"
                  >
                    <label className="font-label-handwritten text-[#030813] dark:text-zinc-100 font-bold block transition-colors">{t("profile.form.major")}</label>
                    <div className="grid grid-cols-1 gap-3 max-h-[320px] overflow-y-auto pr-2 no-scrollbar">
                      {majorOptions.map((opt, optIdx) => {
                        const isSelected = major === opt.key;
                        
                        let initialPos = {};
                        if (optIdx % 2 === 0) {
                          initialPos = { x: -30, opacity: 0 };
                        } else if (optIdx === 4) {
                          initialPos = { y: 30, opacity: 0 };
                        } else {
                          initialPos = { x: 30, opacity: 0 };
                        }

                        return (
                          <motion.label
                            key={opt.key}
                            initial={initialPos}
                            animate={{ x: 0, y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 + optIdx * 0.08, ease: "easeOut" }}
                            onClick={() => setMajor(opt.key)}
                            className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all group ${
                              isSelected ? "border-[var(--circuit-color)]/30 bg-white dark:bg-zinc-900" : "border-[#030813]/5 dark:border-white/5 bg-white/50 dark:bg-white/5 hover:border-[var(--circuit-color)]/20"
                            }`}
                          >
                            <div className="flex-1">
                              <p className="font-bold text-[#030813] dark:text-zinc-100 transition-colors">
                                {t(`profile.major.${opt.key}.title`)}
                              </p>
                              <p className="text-xs text-[#45474c] dark:text-zinc-400 transition-colors">
                                {t(`profile.major.${opt.key}.desc`)}
                              </p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center p-1 ${
                              isSelected ? "border-[var(--circuit-color)]" : "border-[#c6c6cc] dark:border-zinc-700 group-hover:border-[var(--circuit-color)]"
                            }`}>
                              <div className={`w-full h-full bg-[var(--circuit-color)] rounded-full transition-opacity duration-200 ${
                                isSelected ? "opacity-100" : "opacity-0"
                              }`} />
                            </div>
                          </motion.label>
                        );
                      })}
                    </div>
                  </motion.div>
 
                  {/* Role */}
                  <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.85 }}
                    className="space-y-4"
                  >
                    <label className="font-label-handwritten text-[#030813] dark:text-zinc-100 font-bold block transition-colors">{t("profile.form.roleLabel")}</label>
                    <div className="bg-[#dce9ff] dark:bg-violet-950/20 rounded-xl p-6 border-2 border-dashed border-[#030813]/10 dark:border-white/10 relative overflow-hidden transition-colors">
                      <div className="absolute -top-1 -left-1 w-8 h-8 washi-tape"></div>
                      <div className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-[var(--circuit-color)] transition-colors">verified</span>
                        <div>
                          <p className="font-headline-lg text-lg text-[#030813] dark:text-zinc-100 leading-tight transition-colors">
                            {role === "admin" ? t("profile.role.admin") : t("profile.role.user")}
                          </p>
                          <p className="text-body-md text-sm mt-2 opacity-80 text-[#45474c] dark:text-zinc-300 transition-colors">
                            {role === "admin"
                              ? t("profile.role.desc.admin")
                              : t("profile.role.desc.user")}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {role === "admin" ? (
                          <>
                            <span className="px-2 py-1 bg-[#030813]/10 dark:bg-white/10 rounded font-mono text-[10px] uppercase text-[#030813] dark:text-zinc-300">#Publish</span>
                            <span className="px-2 py-1 bg-[#030813]/10 dark:bg-white/10 rounded font-mono text-[10px] uppercase text-[#030813] dark:text-zinc-300">#Delete</span>
                            <span className="px-2 py-1 bg-[#030813]/10 dark:bg-white/10 rounded font-mono text-[10px] uppercase text-[#030813] dark:text-zinc-300">#Override</span>
                          </>
                        ) : (
                          <>
                            <span className="px-2 py-1 bg-[#030813]/10 dark:bg-white/10 rounded font-mono text-[10px] uppercase text-[#030813] dark:text-zinc-300">#Read</span>
                            <span className="px-2 py-1 bg-[#030813]/10 dark:bg-white/10 rounded font-mono text-[10px] uppercase text-[#030813] dark:text-zinc-300">#Purchase</span>
                            <span className="px-2 py-1 bg-[#030813]/10 dark:bg-white/10 rounded font-mono text-[10px] uppercase text-[#030813] dark:text-zinc-300">#Draft</span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
 
                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 10, delay: 1.1 }}
                  className="flex flex-col md:flex-row gap-4 pt-10 border-t border-dashed border-[#030813]/10 dark:border-white/10"
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative overflow-hidden flex-1 bg-[#030813] dark:bg-[#630ed4] text-white py-4 rounded-lg font-label-handwritten text-lg hover:bg-[var(--circuit-color)] dark:hover:bg-[#5209b2] transition-colors group glitch-hover flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <span className="relative z-10">{t("profile.form.btn.save")}</span>
                    )}
                    <div className="absolute inset-0 bg-[var(--circuit-color)]/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-lg"></div>
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="flex-1 border-2 border-[#030813]/20 dark:border-white/20 text-[#030813] dark:text-zinc-200 py-4 rounded-lg font-label-handwritten text-lg hover:bg-[#d4e4fc]/30 dark:hover:bg-white/5 transition-all"
                  >
                    {t("profile.form.btn.cancel")}
                  </button>
                </motion.div>
              </form>
            </div>
          </motion.section>
        </div>
 
        {/* Floating Decorative Element */}
        <div className="fixed bottom-12 right-12 opacity-40 hover:opacity-100 transition-opacity pointer-events-none select-none z-0">
          <div className="w-24 h-24 relative">
            <span className="material-symbols-outlined text-7xl text-[#030813]/10 dark:text-white/5">history_edu</span>
            <div className="absolute top-0 right-0 w-32 h-[1px] bg-[var(--circuit-color)]/30 -rotate-45 origin-left"></div>
          </div>
        </div>
      </main>

      {/* Footer Shell */}
      <footer className="bg-[#f3e8ff] dark:bg-[#0c0a15] w-full min-h-[200px] rounded-t-[40px] mt-20 border-t-4 border-double border-[var(--circuit-color)]/20 dark:border-white/10 grayscale hover:grayscale-0 transition-all relative z-10 px-6 md:px-10 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="font-label-handwritten text-lg text-[var(--circuit-color)]">The Ledger</h3>
            <p className="font-body-md text-sm text-[#6b6378] dark:text-zinc-400 opacity-80 max-w-sm">
              © 1994-2026 Scribbled Realities. All rights reserved. Hand-pressed in Brooklyn.
            </p>
          </div>
          <div className="flex gap-8">
            <a className="text-[#6b6378] dark:text-zinc-400 opacity-80 font-body-md hover:opacity-100 hover:text-[var(--circuit-color)] transition-colors" href="#">Editorial Policy</a>
            <a className="text-[#6b6378] dark:text-zinc-400 opacity-80 font-body-md hover:opacity-100 hover:text-[var(--circuit-color)] transition-colors" href="#">Privacy Ledger</a>
            <a className="text-[#6b6378] dark:text-zinc-400 opacity-80 font-body-md hover:opacity-100 hover:text-[var(--circuit-color)] transition-colors" href="#">The Archive</a>
          </div>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-[#030813]/30 dark:text-white/20">ink_pen</span>
            <span className="material-symbols-outlined text-[#030813]/30 dark:text-white/20">coffee</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
