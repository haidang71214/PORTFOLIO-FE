"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useLoginMutation } from "@/store/queries/auth";
import { LoginRequest } from "@/types";

/* ══════════════════════════════════════════════════════════
   SCENE 1: IT / TECH (SPACE EXPLORATION)
   Style: Orange/Red gradient, planets, floating rocks, big typography
══════════════════════════════════════════════════════════ */
function SceneSpace({ isActive }: { isActive: boolean }) {
  return (
    <div className={`scene-wrap scene-space ${isActive ? "is-active" : ""}`}>
      {/* Background Gradient & Stars */}
      <div className="layer layer-bg">
        <div className="space-bg"></div>
        <div className="space-stars"></div>
      </div>

      {/* Big Sun/Planet */}
      <div className="layer layer-mid1">
        <div className="space-sun"></div>
      </div>

      {/* Typography */}
      <div className="layer layer-type">
        <h2 className="space-title">BEYOND EARTH</h2>
        <p className="space-sub">Software & Technology Portfolio</p>
        <div className="glass-btn">Explore IT</div>
      </div>

      {/* Mountains / Landscape foreground */}
      <div className="layer layer-mid2">
        <svg viewBox="0 0 800 600" preserveAspectRatio="none" className="space-mountains">
          <path d="M0,600 L0,450 L120,520 L250,400 L450,550 L600,350 L800,480 L800,600 Z" fill="#b91c1c" />
          <path d="M0,600 L0,500 L180,560 L350,450 L550,580 L700,400 L800,520 L800,600 Z" fill="#991b1b" />
          <path d="M0,600 L0,550 L200,600 L400,500 L600,600 L800,550 L800,600 Z" fill="#7f1d1d" />
        </svg>
      </div>

      {/* Floating Rocks Foreground */}
      <div className="layer layer-fg">
        <div className="rock rock-1"></div>
        <div className="rock rock-2"></div>
        <div className="rock rock-3"></div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SCENE 2: DESIGN / ART (RED STATUE)
   Style: Dark background, glowing red circle, classical statue shape
══════════════════════════════════════════════════════════ */
function SceneArt({ isActive }: { isActive: boolean }) {
  return (
    <div className={`scene-wrap scene-art ${isActive ? "is-active" : ""}`}>
      {/* Dark textured BG */}
      <div className="layer layer-bg">
        <div className="art-bg"></div>
      </div>

      {/* Glowing Circles */}
      <div className="layer layer-mid1">
        <div className="art-circle-big"></div>
        <div className="art-circle-small"></div>
      </div>

      {/* Typography */}
      <div className="layer layer-type art-type-layout">
        <span className="art-tag">OUR VERSION</span>
        <h2 className="art-title">DESIGN</h2>
        <p className="art-sub">
          Our hobby is a modern and convenient design, the key to successful communication.
        </p>
        <div className="art-line"></div>
      </div>

      {/* Foreground Statue Silhouette (SVG approach) */}
      <div className="layer layer-fg">
        {/* We use an SVG path to simulate the classic statue bust silhouette */}
        <svg viewBox="0 0 400 600" className="art-statue">
          <filter id="red-tint">
             <feColorMatrix type="matrix" values="
               1.2 0 0 0 0.2
               0 0.1 0 0 0
               0 0.1 0 0 0
               0 0 0 1 0" />
          </filter>
          <path d="M200,50 C180,50 160,70 165,100 C150,110 145,130 155,160 C140,190 145,230 170,250 C160,280 150,330 140,360 C120,400 90,450 80,500 L80,600 L350,600 L340,500 C330,440 310,380 280,320 C270,260 265,220 270,180 C280,150 270,110 250,90 C255,70 230,50 200,50 Z" 
                fill="#551111" filter="url(#red-tint)" stroke="#ff4444" strokeWidth="2" strokeOpacity="0.3" />
          {/* Subtle details */}
          <path d="M165,100 Q180,120 200,110" stroke="#ff4444" strokeWidth="2" fill="none" opacity="0.5"/>
          <path d="M155,160 Q170,180 210,160" stroke="#ff4444" strokeWidth="3" fill="none" opacity="0.4"/>
          <path d="M170,250 Q200,280 250,240" stroke="#ff4444" strokeWidth="4" fill="none" opacity="0.3"/>
          <path d="M140,360 Q180,390 280,320" stroke="#ff4444" strokeWidth="6" fill="none" opacity="0.2"/>
        </svg>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SCENE 3: MEDIA / LIFESTYLE (LAKE & MOUNTAINS)
   Style: Pink/Purple evening sky, layered vector mountains, lake reflection
══════════════════════════════════════════════════════════ */
function SceneLandscape({ isActive }: { isActive: boolean }) {
  return (
    <div className={`scene-wrap scene-landscape ${isActive ? "is-active" : ""}`}>
      {/* Sky */}
      <div className="layer layer-bg">
        <div className="land-sky"></div>
        <div className="land-sun"></div>
      </div>

      {/* Far Mountains */}
      <div className="layer layer-mid1">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="none" className="land-mount-far">
          <path d="M0,600 L0,300 L150,150 L250,280 L350,100 L500,320 L650,180 L800,350 L1000,200 L1000,600 Z" fill="#6d28d9" opacity="0.6"/>
        </svg>
      </div>

      {/* Mid Mountains */}
      <div className="layer layer-mid2">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="none" className="land-mount-mid">
          <path d="M0,600 L0,350 L200,200 L380,380 L600,150 L750,350 L1000,280 L1000,600 Z" fill="#4c1d95" opacity="0.8"/>
        </svg>
      </div>

      {/* Lake / Ground */}
      <div className="layer layer-mid3">
        <div className="land-lake"></div>
      </div>

      {/* Typography */}
      <div className="layer layer-type land-type-layout">
        <h2 className="land-title">IDEAL<br/>LIFE <span className="land-date">5/31</span></h2>
        <p className="land-sub">
          Unconstrained life, tea and wine tasting with friends, watching the sunset, enjoying the quietness.
        </p>
        <div className="glass-btn land-btn">VIEW</div>
      </div>

      {/* Foreground: Trees / Cabin / Boat */}
      <div className="layer layer-fg">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="none" className="land-fg-elements">
          {/* Trees left */}
          <path d="M0,600 L0,450 L20,400 L40,460 L60,380 L80,470 L100,420 L150,600 Z" fill="#2e1065" />
          {/* Cabin right */}
          <path d="M700,500 L750,350 L800,500 Z" fill="#9f1239" />
          <rect x="720" y="500" width="60" height="50" fill="#4c0519" />
          <polygon points="700,500 750,480 800,500" fill="#be123c" />
          {/* Boat center */}
          <path d="M300,550 Q400,580 550,540 L500,520 Q400,530 350,520 Z" fill="#f43f5e" />
        </svg>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════════════════════ */
export default function LoginPage() {
  const router = useRouter();
  const [loginMutation, { isLoading }] = useLoginMutation();
  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  
  // Carousel State
  const [activeIndex, setActiveIndex] = useState(0);
  const TOTAL_SLIDES = 3;

  useEffect(() => {
    // Auto-slide every 7 seconds
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TOTAL_SLIDES);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation(form).unwrap();
      toast.success("Đăng nhập thành công!");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="login-root">
      
      {/* ══════════════════════════════════════
          LEFT PANEL — Parallax Slider
      ══════════════════════════════════════ */}
      <div className="login-left-slider">
        {/* Brand Overlay */}
        <div className="slider-brand">
          <span className="brand-gem">◆</span>
          <span className="brand-name">PortfolioHub</span>
        </div>

        {/* Sliding Track */}
        <div 
          className="slider-track"
          style={{ transform: `translateY(-${activeIndex * 100}vh)` }}
        >
          <div className="slide-section"><SceneSpace isActive={activeIndex === 0} /></div>
          <div className="slide-section"><SceneArt isActive={activeIndex === 1} /></div>
          <div className="slide-section"><SceneLandscape isActive={activeIndex === 2} /></div>
        </div>

        {/* Pagination Dots */}
        <div className="slider-pagination">
          {[0, 1, 2].map((i) => (
            <button 
              key={i} 
              className={`dot ${i === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT PANEL — Fixed Login Form
      ══════════════════════════════════════ */}
      <div className="login-right-fixed">
        <div className="login-form-card animate-fade-in-up">
          <div className="form-header">
            <div className="form-logo">◆</div>
            <h1 className="form-title">Chào mừng trở lại</h1>
            <p className="form-sub">Đăng nhập để quản lý portfolio đa lĩnh vực của bạn.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="login-email" className="input-label">Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={17} />
                <input
                  id="login-email" type="email" name="email"
                  placeholder="you@example.com"
                  value={form.email} onChange={handleChange}
                  required autoComplete="email" className="auth-input"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="login-password" className="input-label">Mật khẩu</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={17} />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password" placeholder="••••••••"
                  value={form.password} onChange={handleChange}
                  required autoComplete="current-password" className="auth-input"
                />
                <button
                  type="button" className="eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              <div className="forgot-link-wrapper">
                <Link href="/auth/forgot-password" className="forgot-link">
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <button id="login-submit" type="submit" disabled={isLoading} className="auth-btn active-press">
              {isLoading ? <span className="btn-spinner" /> : <><LogIn size={17} /> Đăng nhập</>}
            </button>
          </form>

          <div className="auth-divider"><span>hoặc</span></div>

          <p className="auth-footer">
            Chưa có tài khoản?{" "}
            <Link href="/auth/register" className="auth-link">Đăng ký ngay</Link>
          </p>
        </div>
      </div>

    </div>
  );
}
