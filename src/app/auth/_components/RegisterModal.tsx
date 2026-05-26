"use client";

import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, X, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { useRegisterMutation } from "@/store/queries/auth";
import { RegisterRequest, ErrorForm } from "@/types";

interface RegisterModalProps {
  onClose: () => void;
  onSwitchToForgot?: () => void;
}

const MAJOR_OPTIONS: { value: RegisterRequest["major"]; label: string }[] = [
  { value: "it",         label: "💻 Công nghệ thông tin" },
  { value: "journalist", label: "📰 Nhà báo / Truyền thông" },
  { value: "designer",   label: "🎨 Thiết kế" },
  { value: "economics",  label: "📊 Kinh tế" },
  { value: "other",      label: "✨ Khác" },
];

export default function RegisterModal({ onClose, onSwitchToForgot }: RegisterModalProps) {
  const [registerMutation, { isLoading }] = useRegisterMutation();
  const [closing, setClosing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    pass: "",
    confirmPass: "",
    major: "it" as RegisterRequest["major"],
    role: "user" as RegisterRequest["role"],
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 280);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.pass !== form.confirmPass) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (form.pass.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    try {
      const res =  await registerMutation({
        username: form.username,
        email: form.email,
        pass: form.pass,
        major: form.major,
        role: form.role,
        ...(avatar ? { images: avatar } : {}),
      }).unwrap();
      console.log("response",res);
      toast.success("Đăng ký thành công! Hãy đăng nhập.");
      handleClose();
    } catch (err: any) {
      console.log("err", err);
      const apiErr = err as ErrorForm;
      let errMsg = "Đăng ký thất bại. Vui lòng thử lại.";
      if (apiErr?.data?.message) {
        errMsg = Array.isArray(apiErr.data.message) 
          ? apiErr.data.message.join(", ") 
          : apiErr.data.message;
      }
      toast.error(errMsg);
    }
  };

  return (
    <div
      className={`modal-backdrop${closing ? " closing" : ""}`}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className={`modal-stack${closing ? " closing" : ""}`}>
        <div className="modal-panel">

          {/* Header */}
          <div className="modal-header">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-container to-inverse-primary flex items-center justify-center">
                <UserPlus size={15} className="text-white" />
              </div>
              <span className="modal-title">Tạo tài khoản mới</span>
            </div>
            <button className="modal-close-btn" onClick={handleClose} aria-label="Đóng">
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <form onSubmit={handleSubmit} className="auth-form">

              {/* Avatar upload */}
              <div className="flex flex-col gap-2">
                <label className="input-label">Ảnh đại diện</label>
                <label
                  className="file-upload-area"
                  htmlFor="reg-avatar"
                  style={avatarPreview ? { padding: "0.5rem" } : {}}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-20 h-20 rounded-full object-cover mx-auto"
                    />
                  ) : (
                    <>
                      <ImagePlus size={22} className="opacity-50" />
                      <span>Chọn ảnh (PNG, JPG…) — không bắt buộc</span>
                    </>
                  )}
                  <input
                    id="reg-avatar"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {/* Username */}
              <div className="input-group">
                <label htmlFor="reg-username" className="input-label">
                  Tên người dùng <span className="required-star">*</span>
                </label>
                <div className="input-wrapper">
                  <User className="input-icon" size={17} />
                  <input
                    id="reg-username"
                    type="text"
                    name="username"
                    placeholder="nguyenvana"
                    value={form.username}
                    onChange={handleChange}
                    required
                    maxLength={20}
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
                  <Mail className="input-icon" size={17} />
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    autoComplete="email"
                    className="auth-input"
                  />
                </div>
              </div>

              {/* Major */}
              <div className="input-group">
                <label htmlFor="reg-major" className="input-label">
                  Ngành nghề <span className="required-star">*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    id="reg-major"
                    name="major"
                    value={form.major}
                    onChange={handleChange}
                    required
                    className="auth-select"
                  >
                    {MAJOR_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="input-group">
                <label htmlFor="reg-password" className="input-label">
                  Mật khẩu <span className="required-star">*</span>
                </label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={17} />
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    name="pass"
                    placeholder="Tối thiểu 6 ký tự"
                    value={form.pass}
                    onChange={handleChange}
                    required
                    minLength={6}
                    maxLength={100}
                    autoComplete="new-password"
                    className="auth-input"
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label="Hiện/ẩn mật khẩu"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="input-group">
                <label htmlFor="reg-confirm" className="input-label">
                  Xác nhận mật khẩu <span className="required-star">*</span>
                </label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={17} />
                  <input
                    id="reg-confirm"
                    type={showConfirm ? "text" : "password"}
                    name="confirmPass"
                    placeholder="Nhập lại mật khẩu"
                    value={form.confirmPass}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className="auth-input"
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label="Hiện/ẩn xác nhận"
                  >
                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="register-submit"
                type="submit"
                disabled={isLoading}
                className="auth-btn active-press"
                style={{ marginTop: "0.5rem" }}
              >
                {isLoading ? (
                  <span className="btn-spinner" />
                ) : (
                  <><UserPlus size={17} /> Đăng ký</>
                )}
              </button>

              <p className="auth-footer" style={{ marginTop: "0.5rem" }}>
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  className="auth-link"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit" }}
                  onClick={handleClose}
                >
                  Đăng nhập ngay
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
