import type { Metadata } from "next";
import "./auth.css";

export const metadata: Metadata = {
  title: "Xác thực | Portfolio",
  description: "Đăng nhập hoặc tạo tài khoản mới",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
