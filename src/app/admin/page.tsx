"use client";

import React from "react";
import { 
  Users, 
  Palette, 
  FileText, 
  ShieldCheck, 
  TrendingUp, 
  ArrowUpRight, 
  Plus, 
  Settings,
  Mail,
  UserCheck,
  Code,
  Newspaper,
  LineChart
} from "lucide-react";
import { useGetAllUsersQuery } from "@/store/queries/auth";
import { useGetAllPortfoliosQuery } from "@/store/queries/profile";
import { useGetAllTemplatesQuery } from "@/store/queries/templates";
import { Card, CardBody, Avatar, Progress, Button, Link } from "@heroui/react";
import { motion } from "framer-motion";

export default function AdminOverviewPage() {
  const { data: users, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: portfolios, isLoading: portfoliosLoading } = useGetAllPortfoliosQuery();
  const { data: templates, isLoading: templatesLoading } = useGetAllTemplatesQuery();

  const isLoading = usersLoading || portfoliosLoading || templatesLoading;

  // Calculate statistics
  const totalUsers = users?.length || 0;
  const totalPortfolios = portfolios?.length || 0;
  const totalTemplates = templates?.length || 0;
  const totalAdmins = users?.filter(u => u.role === "admin").length || 0;

  // Major counts
  const majorsCount = {
    it: users?.filter(u => u.major === "it").length || 0,
    designer: users?.filter(u => u.major === "designer").length || 0,
    journalist: users?.filter(u => u.major === "journalist").length || 0,
    economics: users?.filter(u => u.major === "economics").length || 0,
    other: users?.filter(u => u.major === "other").length || 0,
  };

  const getMajorPercentage = (count: number) => {
    if (totalUsers === 0) return 0;
    return Math.round((count / totalUsers) * 100);
  };

  const recentUsers = users 
    ? [...users].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)
    : [];

  const stats = [
    {
      title: "Tổng người dùng",
      value: totalUsers,
      desc: "Tài khoản đã đăng ký",
      icon: Users,
      color: "from-[#a855f7] to-[#7c3aed]",
      glow: "rgba(168,85,247,0.15)"
    },
    {
      title: "Hồ sơ Portfolios",
      value: totalPortfolios,
      desc: "Trang portfolio đang hoạt động",
      icon: FileText,
      color: "from-[#ec4899] to-[#db2777]",
      glow: "rgba(236,72,153,0.15)"
    },
    {
      title: "Mẫu giao diện (Themes)",
      value: totalTemplates,
      desc: "Số templates thiết kế",
      icon: Palette,
      color: "from-[#3b82f6] to-[#2563eb]",
      glow: "rgba(59,130,246,0.15)"
    },
    {
      title: "Quản trị viên",
      value: totalAdmins,
      desc: "Tài khoản kiểm soát viên",
      icon: ShieldCheck,
      color: "from-[#10b981] to-[#059669]",
      glow: "rgba(16,185,129,0.15)"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-2 border-[#c084fc] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#9d90b0] font-mono">ĐANG TẢI DỮ LIỆU THỐNG KÊ HỆ THỐNG...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title & Breadcrumbs */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          Tổng Quan Hệ Thống
        </h2>
        <p className="text-sm text-[#9d90b0]">Chào mừng trở lại! Xem thông số tổng quan của nền tảng LAWoh tại đây.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Card 
                className="bg-[#0d091a]/40 border border-white/5 backdrop-blur-md hover:border-white/10 transition-colors"
                style={{ boxShadow: `0 10px 30px -10px ${stat.glow}` }}
              >
                <CardBody className="p-6 flex flex-row items-center justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#9d90b0] uppercase tracking-wider font-mono">{stat.title}</p>
                    <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                    <p className="text-[10px] text-[#5b526d]">{stat.desc}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                    <Icon size={20} />
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Middle Section: Major distribution & Recent users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Majors Distribution */}
        <Card className="lg:col-span-2 bg-[#0d091a]/40 border border-white/5 backdrop-blur-md p-6">
          <CardBody className="p-0 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <LineChart size={16} className="text-[#c084fc]" /> Phân Bố Chuyên Ngành
                </h4>
                <p className="text-xs text-[#9d90b0]">Tỉ lệ thành viên đăng ký theo từng khối ngành nghề</p>
              </div>
              <span className="text-[10px] font-mono text-[#5b526d] uppercase">Sắp xếp theo khối ngành</span>
            </div>

            <div className="space-y-4">
              {[
                { name: "Công nghệ thông tin (IT)", count: majorsCount.it, code: "it", color: "#c084fc", icon: Code },
                { name: "Thiết kế & Nghệ thuật (Design)", count: majorsCount.designer, code: "designer", color: "#ec4899", icon: Palette },
                { name: "Nhà báo & Truyền thông (Journalist)", count: majorsCount.journalist, code: "journalist", color: "#3b82f6", icon: Newspaper },
                { name: "Kinh tế & Phân tích dữ liệu (Economics)", count: majorsCount.economics, code: "economics", color: "#10b981", icon: TrendingUp },
                { name: "Khác / Hỗn hợp (Other)", count: majorsCount.other, code: "other", color: "#6b7280", icon: Users },
              ].map((m, idx) => {
                const MIcon = m.icon;
                const percentage = getMajorPercentage(m.count);
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white flex items-center gap-2">
                        <MIcon size={14} style={{ color: m.color }} /> {m.name}
                      </span>
                      <span className="text-[#9d90b0] font-mono">
                        {m.count} TV ({percentage}%)
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      aria-label={m.name}
                      className="h-1.5"
                      classNames={{
                        indicator: `bg-[${m.color}]`
                      }}
                      style={{
                        // Manual indicator override for custom colors
                        background: "rgba(255,255,255,0.03)"
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Recent users */}
        <Card className="bg-[#0d091a]/40 border border-white/5 backdrop-blur-md p-6">
          <CardBody className="p-0 space-y-6">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck size={16} className="text-[#c084fc]" /> Thành Viên Mới Nhất
              </h4>
              <p className="text-xs text-[#9d90b0]">Danh sách tài khoản vừa đăng ký gần đây</p>
            </div>

            <div className="divide-y divide-white/5">
              {recentUsers.map((user, idx) => (
                <div key={user.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Avatar 
                      size="sm" 
                      src={user.images_url || undefined} 
                      className="border border-white/10 shrink-0 bg-white/5" 
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-white truncate">{user.username}</p>
                      <p className="text-[10px] text-[#5b526d] truncate">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold tracking-wider uppercase bg-[#c084fc]/10 text-[#c084fc] px-1.5 py-0.5 rounded">
                    {user.major}
                  </span>
                </div>
              ))}
              {recentUsers.length === 0 && (
                <p className="text-xs text-[#5b526d] text-center py-6">Chưa có người dùng nào đăng ký</p>
              )}
            </div>

            <Button 
              as={Link} 
              href="/admin/users" 
              size="sm" 
              className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1 mt-2"
            >
              Xem tất cả người dùng <ArrowUpRight size={12} />
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Bottom Section: Quick Operations */}
      <Card className="bg-[#0d091a]/40 border border-white/5 backdrop-blur-md p-6">
        <CardBody className="p-0 space-y-4">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Settings size={16} className="text-[#c084fc]" /> Thao Tác Nhanh Quản Trị
            </h4>
            <p className="text-xs text-[#9d90b0]">Các hoạt động quản lý khẩn cấp hệ thống</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/admin/users?action=new" className="no-underline block group">
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-[#c084fc]/5 hover:border-[#c084fc]/20 transition-all flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#c084fc]/10 flex items-center justify-center text-[#c084fc] group-hover:scale-110 transition-transform">
                  <Plus size={16} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Thêm Tài Khoản</p>
                  <p className="text-[10px] text-[#5b526d]">Đăng ký thành viên thủ công</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/portfolios" className="no-underline block group">
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-[#ec4899]/5 hover:border-[#ec4899]/20 transition-all flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#ec4899]/10 flex items-center justify-center text-[#ec4899] group-hover:scale-110 transition-transform">
                  <Palette size={16} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Chuyển Giao Giao Diện</p>
                  <p className="text-[10px] text-[#5b526d]">Thay đổi theme mẫu cho người dùng</p>
                </div>
              </div>
            </Link>

            <a href="mailto:support@lawoh.click" className="no-underline block group">
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-[#3b82f6]/5 hover:border-[#3b82f6]/20 transition-all flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6] group-hover:scale-110 transition-transform">
                  <Mail size={16} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Gửi Yêu Cầu Hỗ Trợ</p>
                  <p className="text-[10px] text-[#5b526d]">Liên hệ bộ phận kỹ thuật LAWoh</p>
                </div>
              </div>
            </a>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
