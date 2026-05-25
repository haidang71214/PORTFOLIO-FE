"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useForgotpassMutation } from "@/store/queries/auth";

export default function ForgotPasswordPage() {
  const [forgotpass, { isLoading }] = useForgotpassMutation();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotpass({ email }).unwrap();
      setSent(true);
      toast.success("Email đặt lại mật khẩu đã được gửi!");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Gửi email thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="auth-page">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="auth-card animate-fade-in-up">
        <div className="auth-header">
          <div className="auth-logo">
            <Sparkles size={28} />
          </div>
          <h1 className="auth-title">Quên mật khẩu?</h1>
          <p className="auth-subtitle">
            {sent
              ? "Kiểm tra hộp thư của bạn để tiếp tục"
              : "Nhập email và chúng tôi sẽ gửi liên kết đặt lại mật khẩu"}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="forgot-email" className="input-label">
                Email
              </label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  id="forgot-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="auth-input"
                />
              </div>
            </div>

            <button
              id="forgot-submit"
              type="submit"
              disabled={isLoading}
              className="auth-btn active-press"
            >
              {isLoading ? (
                <span className="btn-spinner" />
              ) : (
                <>
                  <Send size={18} />
                  Gửi liên kết
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="success-box">
            <div className="success-icon">✉️</div>
            <p>
              Email đặt lại mật khẩu đã được gửi tới <strong>{email}</strong>.
              Vui lòng kiểm tra hộp thư (và thư rác).
            </p>
          </div>
        )}

        <p className="auth-footer" style={{ marginTop: "1.5rem" }}>
          <Link href="/auth/login" className="auth-link back-link">
            <ArrowLeft size={16} />
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
