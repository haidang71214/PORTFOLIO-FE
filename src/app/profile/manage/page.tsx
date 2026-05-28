"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/utils/redux";
import { useGetMeQuery } from "@/store/queries/auth";
import { useGetProfileQuery, useUpdateMyPortfolioMutation } from "@/store/queries/profile";
import { useAuthModal } from "@/context/AuthModalContext";
import webStorageClient from "@/utils/webStorageClient";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Loader2,
  Shield,
  Github,
  Linkedin,
  Globe,
  MapPin,
  FileText,
  User,
  Briefcase,
  ExternalLink,
  Save,
  X,
} from "lucide-react";

export default function ManagePortfolioPage() {
  const router = useRouter();
  const { openLogin } = useAuthModal();
  const { user, isAuthenticatedAccount } = useAppSelector((state) => state.auth);

  // Check token
  const hasToken = typeof window !== "undefined" && !!webStorageClient.getToken();
  const { isFetching } = useGetMeQuery(undefined, { skip: !hasToken });

  // Fetch profile hiện tại của user (khi đã có user.id)
  const { data: profileData, isLoading: profileLoading } = useGetProfileQuery(
    user?.id ?? "",
    { skip: !user?.id }
  );

  // Mutation
  const [updatePortfolio, { isLoading: isSaving }] = useUpdateMyPortfolioMutation();

  // Form state
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Populate form từ profile data có sẵn
  useEffect(() => {
    if (profileData?.data) {
      const p = profileData.data;
      setTitle(p.title ?? "");
      setBio(p.bio ?? "");
      setGithub(p.github ?? "");
      setLinkedin(p.linkedin ?? "");
      setWebsite(p.website ?? "");
      setLocation(p.location ?? "");
    }
  }, [profileData]);

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!isFetching && !isAuthenticatedAccount) {
      if (!hasToken) {
        toast.error("Vui lòng đăng nhập để quản lí portfolio!");
        openLogin();
      }
    }
  }, [isAuthenticatedAccount, isFetching, hasToken, openLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticatedAccount) {
      toast.error("Bạn chưa đăng nhập!");
      openLogin();
      return;
    }

    try {
      await updatePortfolio({
        title: title.trim() || undefined,
        bio: bio.trim() || undefined,
        github: github.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        website: website.trim() || undefined,
        location: location.trim() || undefined,
      }).unwrap();
      toast.success("Cập nhật portfolio thành công!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Đã xảy ra lỗi khi cập nhật portfolio!");
    }
  };

  // Loading states
  if (!isMounted || isFetching) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#fef7ff] dark:bg-[#0b0912]">
        <Loader2 className="animate-spin text-[#630ed4] dark:text-[#c084fc] w-12 h-12" />
        <p className="mt-4 font-mono text-xs text-[#6b6378] dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticatedAccount) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 bg-[#fef7ff] dark:bg-[#0b0912]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md bg-white/40 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[#630ed4]/10 flex items-center justify-center text-[#630ed4] dark:text-[#c084fc] mx-auto mb-4">
            <Shield size={32} />
          </div>
          <h2 className="text-xl font-bold text-[#030813] dark:text-zinc-100 mb-2">Yêu cầu đăng nhập</h2>
          <p className="text-sm text-[#45474c] dark:text-zinc-300 mb-6">
            Bạn cần đăng nhập để quản lí portfolio của mình.
          </p>
          <button
            onClick={openLogin}
            className="w-full bg-[#630ed4] hover:bg-[#5209b2] text-white font-semibold py-3 rounded-lg transition-all"
          >
            Đăng nhập ngay
          </button>
        </motion.div>
      </div>
    );
  }

  const fields = [
    {
      label: "Tiêu đề / Chức danh",
      placeholder: "VD: Full-stack Developer | React & Node.js",
      value: title,
      onChange: setTitle,
      icon: Briefcase,
      type: "text",
      hint: "Hiển thị nổi bật trên portfolio của bạn",
    },
    {
      label: "Địa điểm",
      placeholder: "VD: Hà Nội, Việt Nam",
      value: location,
      onChange: setLocation,
      icon: MapPin,
      type: "text",
      hint: "Nơi bạn đang sống / làm việc",
    },
    {
      label: "GitHub",
      placeholder: "https://github.com/username",
      value: github,
      onChange: setGithub,
      icon: Github,
      type: "url",
      hint: "Link GitHub profile của bạn",
    },
    {
      label: "LinkedIn",
      placeholder: "https://linkedin.com/in/username",
      value: linkedin,
      onChange: setLinkedin,
      icon: Linkedin,
      type: "url",
      hint: "Link LinkedIn profile của bạn",
    },
    {
      label: "Website",
      placeholder: "https://yourportfolio.com",
      value: website,
      onChange: setWebsite,
      icon: Globe,
      type: "url",
      hint: "Website / Portfolio cá nhân",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fef7ff] dark:bg-[#0b0912] text-[#1d1a24] dark:text-[#e8e0f0] transition-colors duration-300 overflow-x-hidden relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Source+Serif+4:ital,wght@0,400;0,700;1,400&family=Bricolage+Grotesque:wght@300;400;700&display=swap');

        :root {
          --ptf-color: #630ed4;
          --ptf-glow: rgba(99,14,212,0.35);
          --ptf-bg: rgba(255,255,255,0.5);
          --ptf-border: rgba(3,8,13,0.08);
          --ptf-grid: rgba(3,8,19,0.04);
        }
        .dark {
          --ptf-color: #c084fc;
          --ptf-glow: rgba(192,132,252,0.35);
          --ptf-bg: rgba(22,20,38,0.45);
          --ptf-border: rgba(255,255,255,0.08);
          --ptf-grid: rgba(255,255,255,0.025);
        }
        .ptf-grid {
          background-image:
            linear-gradient(var(--ptf-grid) 1px, transparent 1px),
            linear-gradient(90deg, var(--ptf-grid) 1px, transparent 1px);
          background-size: 44px 44px;
        }
        .ptf-glass {
          backdrop-filter: blur(10px);
          background: var(--ptf-bg);
          border: 1px solid var(--ptf-border);
        }
        .ptf-input {
          width: 100%;
          background: rgba(255,255,255,0.25);
          border: none;
          border-bottom: 2px solid var(--ptf-border);
          color: inherit;
          padding: 10px 12px;
          font-family: 'Source Serif 4', serif;
          outline: none;
          transition: border-color 0.3s;
        }
        .dark .ptf-input {
          background: rgba(255,255,255,0.05);
        }
        .ptf-input:focus {
          border-bottom-color: var(--ptf-color);
        }
        .ptf-label {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--ptf-color);
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }
        .ptf-hint {
          font-size: 0.7rem;
          margin-top: 4px;
          opacity: 0.55;
          font-family: 'Source Serif 4', serif;
        }
        .ptf-btn-primary {
          background: var(--ptf-color);
          color: white;
          border: none;
          padding: 14px 32px;
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
          box-shadow: 0 4px 20px var(--ptf-glow);
        }
        .ptf-btn-primary:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: translateY(-1px);
          box-shadow: 0 6px 28px var(--ptf-glow);
        }
        .ptf-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .ptf-btn-secondary {
          background: transparent;
          border: 2px solid var(--ptf-border);
          color: inherit;
          padding: 14px 32px;
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }
        .ptf-btn-secondary:hover {
          background: rgba(0,0,0,0.04);
        }
        .dark .ptf-btn-secondary:hover {
          background: rgba(255,255,255,0.05);
        }
        .ptf-tag {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding: 3px 10px;
          border-radius: 999px;
          background: rgba(99,14,212,0.1);
          color: var(--ptf-color);
        }
        .dark .ptf-tag { background: rgba(192,132,252,0.15); }
        
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }
      `}</style>

      {/* Background grid */}
      <div className="fixed inset-0 ptf-grid pointer-events-none z-0" />
      <div className="fixed z-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.06] bg-[#7c3aed] -top-32 -right-32 blur-[120px]" />
      <div className="fixed z-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.05] bg-[#a200ba] -bottom-20 -left-20 blur-[120px]" />

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">

        {/* ── Header ── */}
        <motion.header
          initial={{ opacity: 0, y: -32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="ptf-tag">Portfolio Manager</span>
            <code className="font-mono text-xs opacity-40">/profile/me/portfolio</code>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-[#030813] dark:text-white leading-tight mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Quản lí Portfolio
          </h1>
          <p className="text-sm text-[#6b6378] dark:text-zinc-400" style={{ fontFamily: "'Source Serif 4', serif" }}>
            Cập nhật thông tin hiển thị công khai trên portfolio của bạn.
          </p>
          <div className="w-full h-[2px] bg-gradient-to-r from-[var(--ptf-color)]/40 via-transparent to-transparent mt-6" />
        </motion.header>

        <div className="grid grid-cols-12 gap-6 items-start">

          {/* ── Left: User Info Card ── */}
          <motion.aside
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="col-span-12 lg:col-span-4 flex flex-col gap-4"
          >
            {/* Avatar card */}
            <div className="ptf-glass rounded-xl p-6 shadow-lg">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-[var(--ptf-color)]/40 ring-offset-2 ring-offset-transparent mb-4 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                  {user?.images_url ? (
                    <img src={user.images_url} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <User size={36} className="text-zinc-400" />
                  )}
                </div>
                <p className="font-bold text-lg text-[#030813] dark:text-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  {user?.username}
                </p>
                <p className="text-xs text-[#6b6378] dark:text-zinc-400 mt-0.5">{user?.email}</p>
                <span className="ptf-tag mt-3">{user?.major ?? "–"}</span>
              </div>
            </div>

            {/* Preview card */}
            <div className="ptf-glass rounded-xl p-6 shadow-lg">
              <p className="ptf-label mb-4">
                <FileText size={14} />
                Preview
              </p>
              {profileLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="animate-spin text-[var(--ptf-color)]" size={20} />
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  {title && (
                    <p className="text-[#030813] dark:text-white font-semibold">{title}</p>
                  )}
                  {bio && (
                    <p className="text-[#6b6378] dark:text-zinc-400 text-xs leading-relaxed">{bio}</p>
                  )}
                  {location && (
                    <p className="flex items-center gap-1.5 text-xs text-[#45474c] dark:text-zinc-400">
                      <MapPin size={12} /> {location}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {github && (
                      <a href={github} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-[var(--ptf-color)] hover:underline">
                        <Github size={12} /> GitHub
                        <ExternalLink size={10} />
                      </a>
                    )}
                    {linkedin && (
                      <a href={linkedin} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-[var(--ptf-color)] hover:underline">
                        <Linkedin size={12} /> LinkedIn
                        <ExternalLink size={10} />
                      </a>
                    )}
                    {website && (
                      <a href={website} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-[var(--ptf-color)] hover:underline">
                        <Globe size={12} /> Website
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                  {!title && !bio && !location && !github && !linkedin && !website && (
                    <p className="text-xs text-zinc-400 italic">Chưa có thông tin. Điền form bên phải để cập nhật.</p>
                  )}
                </div>
              )}
            </div>
          </motion.aside>

          {/* ── Right: Form ── */}
          <motion.section
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="col-span-12 lg:col-span-8"
          >
            <form onSubmit={handleSubmit}>
              <div className="ptf-glass rounded-xl p-8 shadow-lg">
                <p className="ptf-label mb-6">
                  <FileText size={14} />
                  Thông tin Portfolio
                </p>

                {/* Single-line fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {fields.map((f, idx) => (
                    <motion.div
                      key={f.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + idx * 0.07 }}
                    >
                      <label className="ptf-label">
                        <f.icon size={13} />
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        className="ptf-input rounded-sm"
                        placeholder={f.placeholder}
                        value={f.value}
                        onChange={(e) => f.onChange(e.target.value)}
                      />
                      <p className="ptf-hint">{f.hint}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Bio textarea */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.65 }}
                  className="mb-8"
                >
                  <label className="ptf-label">
                    <FileText size={13} />
                    Giới thiệu bản thân (Bio)
                  </label>
                  <textarea
                    className="ptf-input rounded-sm resize-none"
                    placeholder="Viết vài câu giới thiệu về bản thân, kỹ năng, và mục tiêu của bạn..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={5}
                  />
                  <p className="ptf-hint">Giới hạn ~500 ký tự. Hiển thị trực tiếp trên portfolio công khai.</p>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.75 }}
                  className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-dashed border-black/10 dark:border-white/10"
                >
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="ptf-btn-primary flex-1 justify-center"
                  >
                    {isSaving ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Save size={18} />
                    )}
                    {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="ptf-btn-secondary flex-1 justify-center"
                  >
                    <X size={18} />
                    Hủy bỏ
                  </button>
                </motion.div>
              </div>
            </form>
          </motion.section>

        </div>
      </main>
    </div>
  );
}
