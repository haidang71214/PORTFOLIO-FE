"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn, X } from "lucide-react";
import { toast } from "sonner";
import { useLoginMutation } from "@/store/queries/auth";
import { LoginRequest } from "@/types";

interface LoginModalProps {
  onClose: () => void;
  onSwitchToRegister?: () => void;
  onSwitchToForgot?: () => void;
}

export default function LoginModal({ onClose, onSwitchToRegister, onSwitchToForgot }: LoginModalProps) {
  const [loginMutation, { isLoading }] = useLoginMutation();
  const [closing, setClosing] = useState(false);
  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 280);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation(form).unwrap();
      toast.success("Đăng nhập thành công!");
      handleClose();
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
                <LogIn size={15} className="text-white" />
              </div>
              <span className="modal-title">Chào mừng trở lại</span>
            </div>
            <button className="modal-close-btn" onClick={handleClose} aria-label="Đóng">
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <form onSubmit={handleSubmit} className="auth-form">

              {/* Email */}
              <div className="input-group">
                <label htmlFor="login-email" className="input-label">
                  Email <span className="required-star">*</span>
                </label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={17} />
                  <input
                    id="login-email"
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

              {/* Password */}
              <div className="input-group">
                <div className="flex justify-between items-end">
                  <label htmlFor="login-password" className="input-label">
                    Mật khẩu <span className="required-star">*</span>
                  </label>
                  {onSwitchToForgot && (
                    <button
                      type="button"
                      className="auth-link forgot-link"
                      onClick={onSwitchToForgot}
                    >
                      Quên mật khẩu?
                    </button>
                  )}
                </div>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={17} />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Nhập mật khẩu"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
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

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={isLoading}
                className="auth-btn active-press"
                style={{ marginTop: "0.5rem" }}
              >
                {isLoading ? (
                  <span className="btn-spinner" />
                ) : (
                  <><LogIn size={17} /> Đăng nhập</>
                )}
              </button>

              <p className="auth-footer" style={{ marginTop: "0.5rem" }}>
                Chưa có tài khoản?{" "}
                {onSwitchToRegister ? (
                  <button
                    type="button"
                    className="auth-link"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit" }}
                    onClick={onSwitchToRegister}
                  >
                    Đăng ký ngay
                  </button>
                ) : null}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
