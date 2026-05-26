"use client";

import React, { useState, useEffect } from "react";
import { Mail, X, Send, Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/store/queries/auth";

interface ForgotPasswordModalProps {
  onClose: () => void;
}

export default function ForgotPasswordModal({ onClose }: ForgotPasswordModalProps) {
  const [forgotpass, { isLoading }] = useForgotPasswordMutation();
  const [closing, setClosing] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 280);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotpass({ email }).unwrap();
      setSent(true);
      toast.success("Email đặt lại mật khẩu đã được gửi!");
    } catch (err: any) {
      let errMsg = "Gửi email thất bại. Vui lòng thử lại.";
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
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className={`modal-stack${closing ? " closing" : ""}`}>
        <div className="modal-panel">
          {/* Header */}
          <div className="modal-header">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-container to-inverse-primary flex items-center justify-center">
                <Sparkles size={15} className="text-white" />
              </div>
              <span className="modal-title">Quên mật khẩu?</span>
            </div>
            <button className="modal-close-btn" onClick={handleClose} aria-label="Đóng">
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {!sent ? (
              <form onSubmit={handleSubmit} className="auth-form">
                <p className="font-body-md text-on-surface-variant text-[14px] leading-relaxed mb-2 opacity-80">
                  Nhập email và chúng tôi sẽ gửi liên kết đặt lại mật khẩu tới hộp thư của bạn.
                </p>

                <div className="input-group">
                  <label htmlFor="forgot-email" className="input-label">
                    Email đăng ký <span className="required-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={17} />
                    <input
                      id="forgot-email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      maxLength={100}
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
                  style={{ marginTop: "0.5rem" }}
                >
                  {isLoading ? (
                    <span className="btn-spinner" />
                  ) : (
                    <>
                      <Send size={17} /> Gửi liên kết đặt lại
                    </>
                  )}
                </button>

                <p className="auth-footer" style={{ marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    className="auth-link back-link"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      font: "inherit",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    onClick={handleClose}
                  >
                    <ArrowLeft size={14} /> Quay lại đăng nhập
                  </button>
                </p>
              </form>
            ) : (
              <div className="modal-success">
                <span className="modal-success-icon">✉️</span>
                <h3 className="modal-success-title">Đã gửi email đặt lại!</h3>
                <p className="modal-success-sub mb-6">
                  Liên kết đặt lại mật khẩu đã được gửi tới <strong>{email}</strong>. Vui lòng kiểm tra hộp thư của bạn (bao gồm thư rác).
                </p>
                <button
                  onClick={handleClose}
                  className="auth-btn"
                  style={{ background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#fff", boxShadow: "none" }}
                >
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
