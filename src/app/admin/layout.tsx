"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/utils/redux";
import { clearLoginToken } from "@/store/slices/auth";
import { 
  LayoutDashboard, 
  Users, 
  Palette, 
  LogOut, 
  Shield, 
  Menu, 
  X,
  User,
  Terminal,
  Activity,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, Button, Tooltip } from "@heroui/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticatedAccount, user } = useAppSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Client-side authentication check
  useEffect(() => {
    if (!isAuthenticatedAccount) {
      router.push("/auth/login");
      return;
    }
    if (user && user.role !== "admin") {
      router.push("/");
    }
  }, [isAuthenticatedAccount, user, router]);

  const handleLogout = () => {
    dispatch(clearLoginToken());
    router.push("/auth/login");
  };

  if (!isAuthenticatedAccount || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#07050f] text-white flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#c084fc] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#9d90b0] tracking-widest">XÁC THỰC QUYỀN TRUY CẬP...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      label: "Tổng quan",
      href: "/admin",
      icon: LayoutDashboard,
      desc: "Dashboard & số liệu tổng quan"
    },
    {
      label: "Người dùng",
      href: "/admin/users",
      icon: Users,
      desc: "Quản lý tài khoản & phân quyền"
    },
    {
      label: "Hồ sơ & Giao diện",
      href: "/admin/portfolios",
      icon: Palette,
      desc: "Quản lý hồ sơ & áp dụng theme"
    },
    {
      label: "Mẫu giao diện",
      href: "/admin/templates",
      icon: Layers,
      desc: "Quản lý kho theme & cấu hình"
    }
  ];

  return (
    <div className="min-h-screen bg-[#07050f] text-[#eae5f5] flex relative overflow-hidden font-sans">
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#5213b3]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#ca29ff]/5 blur-[150px] pointer-events-none" />
      
      {/* Sidebar Navigation */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#0d091a]/80 border-r border-white/5 backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div>
          {/* Header/Logo */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-white/5">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#c084fc]/10 border border-[#c084fc]/20 flex items-center justify-center shrink-0">
                <Shield size={16} className="text-[#c084fc]" />
              </div>
              {isSidebarOpen && (
                <span className="font-bold text-sm tracking-wider uppercase font-mono bg-gradient-to-r from-white to-[#9d90b0] bg-clip-text text-transparent">
                  LAWoH Control
                </span>
              )}
            </div>
            {isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-[#9d90b0] hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group relative cursor-pointer ${
                      isActive 
                        ? "bg-[#c084fc]/10 border border-[#c084fc]/20 text-[#c084fc]" 
                        : "border border-transparent hover:bg-white/5 text-[#9d90b0] hover:text-white"
                    }`}
                  >
                    <Icon size={18} className="shrink-0" />
                    {isSidebarOpen ? (
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-semibold">{item.label}</span>
                        <span className="text-[10px] text-[#5b526d] group-hover:text-[#9d90b0] transition-colors">{item.desc}</span>
                      </div>
                    ) : (
                      <Tooltip content={item.label} placement="right" className="bg-[#140f26] border border-white/10 text-white">
                        <div className="absolute inset-0 w-full h-full" />
                      </Tooltip>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area: Admin Info & Logout */}
        <div className="p-4 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar 
              size="sm" 
              src={user.images_url || undefined} 
              fallback={<User size={14} className="text-[#9d90b0]" />}
              className="bg-white/5 border border-white/10 shrink-0" 
            />
            {isSidebarOpen && (
              <div className="text-left overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{user.username}</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase">Administrator</span>
                </div>
              </div>
            )}
          </div>
          
          <Button
            size="sm"
            color="danger"
            variant="light"
            onClick={handleLogout}
            className={`w-full justify-start gap-3 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 font-semibold transition-all ${
              !isSidebarOpen && "px-0 justify-center"
            }`}
          >
            <LogOut size={16} />
            {isSidebarOpen && <span>Đăng xuất</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div 
        className={`flex-grow min-h-screen flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "pl-64" : "pl-20"
        }`}
      >
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 bg-[#0d091a]/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-[#9d90b0] hover:text-white transition-colors"
              >
                <Menu size={18} />
              </button>
            )}
            <h1 className="text-sm font-bold tracking-wider font-mono uppercase text-[#9d90b0] flex items-center gap-2">
              <Terminal size={14} className="text-[#c084fc]" /> Console Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#5b526d]">
            <Activity size={12} className="text-emerald-500 animate-pulse" />
            <span>Hệ thống trực tuyến</span>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-grow p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
