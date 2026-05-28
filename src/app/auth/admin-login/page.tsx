"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLoginMutation } from "@/store/queries/auth";
import { LoginRequest } from "@/types";
import { useAppDispatch } from "@/utils/redux";
import { clearLoginToken } from "@/store/slices/auth";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, Eye, EyeOff, Loader2, ArrowLeft, Terminal } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loginMutation, { isLoading }] = useLoginMutation();
  
  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginMutation(form).unwrap();
      const user = res.response.user;
      
      if (user.role !== "admin") {
        dispatch(clearLoginToken());
        toast.error("Tài khoản của bạn không có quyền truy cập trang quản trị!");
        return;
      }
      
      toast.success("Đăng nhập quản trị viên thành công!");
      router.push("/");
    } catch (err: any) {
      let errMsg = "Đăng nhập thất bại. Vui lòng thử lại.";
      if (err?.data?.message) {
        errMsg = Array.isArray(err.data.message)
          ? err.data.message.join(", ")
          : err.data.message;
      }
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#07050f] text-[#eae5f5] flex items-center justify-center relative overflow-hidden font-sans select-none">
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#5213b3]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#ca29ff]/10 blur-[150px] pointer-events-none" />
      
      {/* Hexagon/Cyber Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#07050f_90%)] z-0 pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "30px 30px"
        }}
      />

      <div className="relative z-10 w-full max-w-5xl flex rounded-2xl border border-white/5 bg-[#0d091a]/60 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden m-4 min-h-[580px]">
        
        {/* Left column: Cybersecurity Graphic Panel */}
        <section className="hidden md:flex flex-1 flex-col justify-between p-12 bg-gradient-to-br from-[#120b29] to-[#0a0614] border-r border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c084fc]/5 blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2">
            <Shield className="text-[#c084fc]" size={20} />
            <span className="text-xs font-bold tracking-[0.25em] text-[#9d90b0] uppercase font-mono">LAWoH Admin System</span>
          </div>

          <div className="my-auto space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-xl bg-[#c084fc]/10 flex items-center justify-center border border-[#c084fc]/20"
            >
              <Terminal size={22} className="text-[#c084fc]" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <h2 className="text-3xl font-black tracking-tight text-white mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Cổng Quản Trị Viên
              </h2>
              <p className="text-sm text-[#9d90b0] leading-relaxed max-w-sm">
                Xác thực danh tính lớp cao để truy cập hệ thống quản trị, thay đổi mẫu thiết kế và quản lý dữ liệu người dùng.
              </p>
            </motion.div>
          </div>

          <div className="text-[10px] font-mono text-[#5b526d] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Đường truyền được mã hóa SSL/TLS</span>
          </div>
        </section>

        {/* Right column: Form */}
        <aside className="w-full md:w-[420px] flex flex-col justify-between p-10 md:p-12">
          {/* Back to Home Button */}
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs text-[#9d90b0] hover:text-white transition-colors duration-200 cursor-pointer self-start"
          >
            <ArrowLeft size={14} /> Quay lại trang chủ
          </button>

          <form onSubmit={handleSubmit} className="my-auto space-y-6 w-full">
            <header className="space-y-2">
              <h1 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Đăng nhập quản trị
              </h1>
              <p className="text-xs text-[#9d90b0]">Nhập thông tin xác thực để bắt đầu phiên quản trị.</p>
            </header>

            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">ADMIN EMAIL</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5b526d]" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="admin@lawoh.click"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-[#140f26]/60 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">PASSWORD KEY</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5b526d]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full bg-[#140f26]/60 border border-white/10 rounded-lg py-3 pl-10 pr-10 text-white text-sm outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5b526d] hover:text-white transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#c084fc] hover:bg-[#b06cf7] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-[#07050f] font-bold py-3 rounded-lg text-sm shadow-[0_4px_24px_rgba(192,132,252,0.25)] hover:shadow-[0_4px_28px_rgba(192,132,252,0.35)] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <Shield size={15} /> Xác thực quyền truy cập
                </>
              )}
            </button>
          </form>

          <footer className="text-center text-[10px] text-[#5b526d] font-mono">
            © 2026 LAWoh Control Portal.
          </footer>
        </aside>
      </div>
    </div>
  );
}
