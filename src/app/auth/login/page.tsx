"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLoginMutation } from "@/store/queries/auth";
import { LoginRequest } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [loginMutation, { isLoading }] = useLoginMutation();
  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  // Carousel Refs & States
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollOffsets, setScrollOffsets] = useState<number[]>([0, 0, 0]);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const scrollPos = sliderRef.current.scrollTop;
    const height = sliderRef.current.clientHeight || 1;
    const currentActive = Math.round(scrollPos / height);
    if (currentActive !== activeIndex) {
      setActiveIndex(currentActive);
    }

    // Simple parallax effect calculations
    const newOffsets = [0, 0, 0];
    const scenes = sliderRef.current.querySelectorAll(".scene");
    scenes.forEach((scene, index) => {
      const rect = scene.getBoundingClientRect();
      const windowHeight = window.innerHeight || 800;
      if (rect.top < windowHeight && rect.bottom > 0) {
        const offsetVal = (rect.top / windowHeight) * 100;
        newOffsets[index] = offsetVal * 0.25;
      }
    });
    setScrollOffsets(newOffsets);
  };

  const scrollToScene = (index: number) => {
    if (!sliderRef.current) return;
    const height = sliderRef.current.clientHeight || window.innerHeight;
    sliderRef.current.scrollTo({
      top: index * height,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Initial calculation on mount
    handleScroll();
    
    // Auto-scroll loop every 7 seconds as in original design
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % 3;
      scrollToScene(nextIndex);
    }, 7000);

    return () => clearInterval(interval);
  }, [activeIndex]);

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
    <div className="bg-auth-main text-on-surface selection:bg-primary-container selection:text-white min-h-screen overflow-hidden font-body-md">
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-gutter py-4 backdrop-blur-md bg-surface/5">
        <div className="font-display-lg-mobile text-display-lg-mobile font-bold tracking-tighter text-on-surface">
          Portfolio
        </div>
      </header>

      <main className="flex h-screen w-full">
        {/* Left Slider: Vertical snappable carousel */}
        <section className="hidden md:block flex-1 relative overflow-hidden">
          <div 
            ref={sliderRef} 
            onScroll={handleScroll}
            className="slider-container h-full w-full overflow-y-auto no-scrollbar" 
            id="main-slider"
          >
            {/* Scene 1: Beyond Earth */}
            <div className="scene relative h-full w-full flex items-center justify-center">
              <img 
                className="absolute inset-0 w-full h-full object-cover brightness-[0.6] transition-transform duration-100 ease-out" 
                style={{ transform: `translateY(${scrollOffsets[0]}px)` }}
                alt="A cinematic space landscape titled Beyond Earth with a massive glowing orange sun setting over jagged red crystalline mountains. The deep purple sky is filled with swirling nebulae and shimmering stars, creating a sense of infinite wonder. The lighting is dramatic and warm, contrasting with the cold dark of space, in a high-fidelity artistic style." 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAULXIk87wf-5AND7nMde0-SBpaOjF-GgmTgUp99oL-l1Wy031jQefYUyFG64qv6UQ5niInSMOV4RqBvn71hTysUaLitQCBZC40jJh5_3oDdYIFc7FfDoqGmWlozLs1DtS9rf9oLiLK--KsXm5DBA4kf--dd0QGSLPYNwSqWAKBAj_3787Nwy7POYCRkNJUD13RvLRXuwF3MYNMFg0Q4JYOOb4iHWediYOpG1NV91WtQXWqkYNtiO_YTsdKwr4TSnFUvPFZEHHGtg"
              />
              <div className="relative z-10 text-center px-12">
                <span className="font-label-caps text-label-caps text-secondary mb-2 block tracking-[0.3em]">CHAPTER 01</span>
                <h2 className="font-display-art text-display-art italic text-white mb-4">Beyond Earth</h2>
                <div className="w-12 h-[1px] bg-outline-variant mx-auto mb-6"></div>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto opacity-80">Exploring the silent geometry of the cosmos through a lens of technical precision.</p>
              </div>
              {/* Technical Accents */}
              <div className="absolute bottom-12 left-12 border-l border-t border-white/20 w-8 h-8"></div>
              <div className="absolute bottom-12 right-12 border-r border-t border-white/20 w-8 h-8"></div>
            </div>

            {/* Scene 2: Artistic Geometry */}
            <div className="scene relative h-full w-full flex items-center justify-center">
              <img 
                className="absolute inset-0 w-full h-full object-cover brightness-[0.5] transition-transform duration-100 ease-out" 
                style={{ transform: `translateY(${scrollOffsets[1]}px)` }}
                alt="A modern minimalist art gallery scene titled Design featuring a stark silhouette of a classical Greek statue positioned before a large glowing red neon circle on a dark charcoal wall. The floor is a reflective obsidian surface that catches the crimson light. The atmosphere is sophisticated and moody, emphasizing clean lines and high-contrast artistic composition." 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIUriKGxmkCWnM98xqOCnuwgz1abhrSKB6QB8Ri0f4aGUfJnP-Vtqo3jc6Uvrrhlfv867Z5HcG_oUI_ZhJJI1f-wGMJDcBIxW312UCyoP7t6oFSUX1GTEcBn_8rRE57Ur9gxpbqUeSAmG6jzlKfYDmu7lkd2sze8MafRs7UObczA4Zchm2TJeSOqeRcbz2-XbMgvhpVanYpgrqZeSSGuQv0FxGLlQ5RmvgNR5SQu-vBQoDJsVBPZbyb6TAH5TnYzYULJntRNhBSw"
              />
              <div className="relative z-10 text-center px-12">
                <span className="font-label-caps text-label-caps text-tertiary mb-2 block tracking-[0.3em]">CHAPTER 02</span>
                <h2 className="font-display-art text-display-art italic text-white mb-4">Artistic Geometry</h2>
                <div className="w-12 h-[1px] bg-outline-variant mx-auto mb-6"></div>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto opacity-80">Where classical aesthetics intersect with modern digital luminance.</p>
              </div>
            </div>

            {/* Scene 3: Ideal Life */}
            <div className="scene relative h-full w-full flex items-center justify-center">
              <img 
                className="absolute inset-0 w-full h-full object-cover brightness-[0.6] transition-transform duration-100 ease-out" 
                style={{ transform: `translateY(${scrollOffsets[2]}px)` }}
                alt="A serene dreamlike landscape titled Ideal Life with towering purple mountains reflected in a perfectly still, deep blue lake at twilight. A small, lone wooden boat floats quietly in the center of the water. The sky is a soft gradient of indigo and violet, evoking a peaceful, surreal mood. The style is cinematic and painterly, highlighting the quiet beauty of nature." 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvp7-EcABh475IGB0QyMeiI5xAM6WJMqJ4MqT8LmHjpuWPOHdAyV-awUTGS2TinJpcHnURxdm3LLDQjSfdMZXSV4pRF8ELI4M-MNEcwesJkDY1FYX4ctUOtjToNYkSM4KgXzkWNVk7D4ypGQPnT3A_lei0PSsh4zizSJ23v_rCNqECIUGyImnlm6UtCDD5-XwTWfzKYmTJcAOwfBnPoJa9vAlvKHC0i_bseGIpwpoZwQHgOkOGho8KaopuEL0jQPraxVITtR7RRw"
              />
              <div className="relative z-10 text-center px-12">
                <span className="font-label-caps text-label-caps text-primary mb-2 block tracking-[0.3em]">CHAPTER 03</span>
                <h2 className="font-display-art text-display-art italic text-white mb-4">Ideal Life</h2>
                <div className="w-12 h-[1px] bg-outline-variant mx-auto mb-6"></div>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto opacity-80">A tranquil synthesis of natural forms and digital serenity.</p>
              </div>
            </div>
          </div>

          {/* Custom Scroll Indicator */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
            {[0, 1, 2].map((i) => (
              <button 
                key={i} 
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeIndex 
                    ? "bg-primary w-1.5 h-12" 
                    : "bg-white/20 w-1.5 h-8 hover:bg-white/40"
                }`}
                onClick={() => scrollToScene(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Right Side: Fixed Sidebar Login Form */}
        <aside className="w-full md:w-auth-card-width bg-surface-container-lowest flex flex-col items-center justify-center px-10 relative z-10">
          <div className="w-full max-w-[340px] flex flex-col gap-stack-lg my-auto pt-20 pb-28">
            <header className="flex flex-col gap-2">
              <h1 className="font-headline-md text-headline-md text-white">Chào mừng trở lại</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Vui lòng nhập thông tin để truy cập bộ sưu tập của bạn.</p>
            </header>

            <form className="flex flex-col gap-stack-md" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant opacity-70" htmlFor="email">
                  EMAIL ARCHIVE
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors select-none">
                    mail
                  </span>
                  <input 
                    className="w-full bg-surface-container-high/40 border-outline-variant/30 rounded-lg py-4 pl-12 pr-4 text-white focus:ring-0 focus:border-secondary/50 focus:bg-surface-container-high transition-all ghost-border outline-none" 
                    id="email" 
                    name="email"
                    type="email" 
                    required 
                    autoComplete="email"
                    placeholder="artist@aetheria.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <label className="font-label-caps text-label-caps text-on-surface-variant opacity-70" htmlFor="password">
                    PASSWORD KEY
                  </label>
                  <Link className="font-label-caps text-[10px] text-primary hover:text-white transition-colors" href="/auth/forgot-password">
                    QUÊN MẬT KHẨU?
                  </Link>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors select-none">
                    lock
                  </span>
                  <input 
                    className="w-full bg-surface-container-high/40 border-outline-variant/30 rounded-lg py-4 pl-12 pr-12 text-white focus:ring-0 focus:border-primary/50 focus:bg-surface-container-high transition-all ghost-border outline-none" 
                    id="password" 
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    required 
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-white transition-colors flex items-center justify-center p-1" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    <span className="material-symbols-outlined select-none">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input 
                  className="w-4 h-4 rounded border-outline-variant bg-transparent text-primary focus:ring-primary/20 cursor-pointer" 
                  id="remember" 
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label className="font-body-md text-[14px] text-on-surface-variant cursor-pointer select-none" htmlFor="remember">
                  Ghi nhớ phiên đăng nhập
                </label>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-primary-container to-inverse-primary text-white font-headline-md text-body-lg font-semibold primary-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="btn-spinner" />
                ) : (
                  <>
   Đăng nhập
                  </>
                )}
              </button>
            </form>

            <footer className="flex flex-col gap-6 pt-4">
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-outline-variant/20"></div>
                <span className="flex-shrink mx-4 font-label-caps text-[10px] text-outline select-none">HOẶC TIẾP TỤC VỚI</span>
                <div className="flex-grow border-t border-outline-variant/20"></div>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button"
                  className="flex-1 glass-panel py-3 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-on-surface"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.132,0-5.671-2.54-5.671-5.671 s2.539-5.671,5.671-5.671c1.423,0,2.711,0.516,3.703,1.371l2.817-2.817C17.23,3.537,15.011,2.5,12.545,2.5 c-5.247,0-9.5,4.253-9.5,9.5s4.253,9.5,9.5,9.5c5.445,0,9.5-3.834,9.5-9.5c0-0.516-0.052-1.016-0.149-1.499H12.545z" fill="currentColor"></path>
                  </svg>
                  <span className="font-label-caps text-[11px] select-none">GOOGLE</span>
                </button>
                <button 
                  type="button"
                  className="flex-1 glass-panel py-3 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-on-surface"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path d="M12,2C6.477,2,2,6.477,2,12c0,5.013,3.693,9.153,8.505,9.876V14.659H8.031v-2.659h2.474v-2.029 c0-2.441,1.454-3.79,3.679-3.79c1.066,0,2.181,0.19,2.181,0.19v2.397h-1.228c-1.209,0-1.583,0.75-1.583,1.517v1.714h2.701l-0.432,2.659 h-2.269v7.217C18.307,21.153,22,17.013,22,12C22,6.477,17.523,2,12,2z" fill="currentColor"></path>
                  </svg>
                  <span className="font-label-caps text-[11px] select-none">FACEBOOK</span>
                </button>
              </div>

              <p className="text-center font-body-md text-[13px] text-on-surface-variant">
                Chưa có tài khoản?{" "}
                <Link className="text-secondary font-semibold hover:underline" href="/auth/register">
                  Tạo tài khoản mới
                </Link>
              </p>
            </footer>
          </div>

          {/* Footer Section */}
          <div className="absolute bottom-0 left-0 w-full py-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center px-container-padding gap-stack-md bg-surface-container-lowest z-20">
            <span className="font-label-caps text-label-caps text-on-surface-variant text-[11px] text-center md:text-left select-none">
              © 2026 Aetheria Studios. Precision in Art.
            </span>
            <div className="flex gap-4">
              <Link className="font-label-caps text-label-caps text-on-surface-variant text-[11px] hover:text-secondary transition-colors" href="#">
                Privacy
              </Link>
              <Link className="font-label-caps text-label-caps text-on-surface-variant text-[11px] hover:text-secondary transition-colors" href="#">
                Terms
              </Link>
              <Link className="font-label-caps text-label-caps text-on-surface-variant text-[11px] hover:text-secondary transition-colors" href="#">
                Contact
              </Link>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
