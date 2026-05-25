"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useRegisterMutation } from "@/store/queries/auth";
import { RegisterRequestDto } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const [registerMutation, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState<RegisterRequestDto & { confirmPassword: string }>({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    fullName: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      await registerMutation({
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        username: form.username,
        fullName: form.fullName,
      }).unwrap();

      toast.success("Đăng ký thành công! Vui lòng kiểm tra email của bạn.");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="auth-page">
      {/* Animated background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="auth-card animate-fade-in-up">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <Sparkles size={28} />
          </div>
          <h1 className="auth-title">Tạo tài khoản mới</h1>
          <p className="auth-subtitle">Hãy bắt đầu hành trình của bạn ngay hôm nay</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name */}
          <div className="input-group">
            <label htmlFor="reg-fullname" className="input-label">
              Họ và tên
            </label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                id="reg-fullname"
                type="text"
                name="fullName"
                placeholder="Nguyễn Văn A"
                value={form.fullName}
                onChange={handleChange}
                autoComplete="name"
                className="auth-input"
              />
            </div>
          </div>

          {/* Username */}
          <div className="input-group">
            <label htmlFor="reg-username" className="input-label">
              Tên người dùng
            </label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                id="reg-username"
                type="text"
                name="username"
                placeholder="nguyenvana"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                className="auth-input"
              />
            </div>
          </div>

          {/* Email */}
          <div className="input-group">
            <label htmlFor="reg-email" className="input-label">
              Email <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                id="reg-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="auth-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="reg-password" className="input-label">
              Mật khẩu <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Tối thiểu 8 ký tự"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="new-password"
                className="auth-input"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label htmlFor="reg-confirm" className="input-label">
              Xác nhận mật khẩu <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                id="reg-confirm"
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="auth-input"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            id="register-submit"
            type="submit"
            disabled={isLoading}
            className="auth-btn active-press"
          >
            {isLoading ? (
              <span className="btn-spinner" />
            ) : (
              <>
                <UserPlus size={18} />
                Đăng ký
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>hoặc</span>
        </div>

        {/* Footer */}
        <p className="auth-footer">
          Đã có tài khoản?{" "}
          <Link href="/auth/login" className="auth-link">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
