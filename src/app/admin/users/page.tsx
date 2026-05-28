"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  ShieldAlert, 
  Calendar,
  X,
  Mail,
  User as UserIcon,
  Briefcase,
  Lock,
  Upload,
  Loader2,
  Filter,
  Save
} from "lucide-react";
import { 
  useGetAllUsersQuery, 
  useAdminCreateUserMutation, 
  useAdminUpdateUserMutation 
} from "@/store/queries/auth";
import { Avatar, Button, Card, CardBody, Badge } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const { data: users, isLoading, refetch } = useGetAllUsersQuery();
  const [createUser, { isLoading: isCreating }] = useAdminCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useAdminUpdateUserMutation();

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [majorFilter, setMajorFilter] = useState("all");

  // Modal states
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Selected user for editing
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Forms state
  const [newForm, setNewForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    major: "it"
  });
  const [newAvatar, setNewAvatar] = useState<File | null>(null);

  const [editForm, setEditForm] = useState({
    username: "",
    password: "",
    major: "it"
  });
  const [editAvatar, setEditAvatar] = useState<File | null>(null);

  const newAvatarRef = useRef<HTMLInputElement>(null);
  const editAvatarRef = useRef<HTMLInputElement>(null);

  // Open "Create User" if action=new parameter is in the URL
  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setIsNewModalOpen(true);
      // Clean query params
      router.replace("/admin/users");
    }
  }, [searchParams, router]);

  // Handlers
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.username.trim() || !newForm.email.trim() || !newForm.password.trim()) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }
    
    try {
      await createUser({
        ...newForm,
        images: newAvatar || undefined
      }).unwrap();
      toast.success("Tạo tài khoản người dùng thành công!");
      setIsNewModalOpen(false);
      setNewForm({
        username: "",
        email: "",
        password: "",
        role: "user",
        major: "it"
      });
      setNewAvatar(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Lỗi tạo tài khoản mới!");
    }
  };

  const handleEditClick = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      password: "",
      major: user.major
    });
    setEditAvatar(null);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.username.trim()) {
      toast.error("Tên người dùng không được để trống!");
      return;
    }

    try {
      await updateUser({
        id: selectedUser.id,
        body: {
          username: editForm.username,
          major: editForm.major,
          password: editForm.password ? editForm.password : undefined,
          images: editAvatar || undefined
        }
      }).unwrap();
      toast.success("Cập nhật thông tin tài khoản thành công!");
      setIsEditModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Lỗi cập nhật tài khoản!");
    }
  };

  // Filter users list
  const filteredUsers = users?.filter((user) => {
    const matchesSearch = 
      user.username.toLowerCase().includes(search.toLowerCase()) || 
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesMajor = majorFilter === "all" || user.major === majorFilter;
    return matchesSearch && matchesRole && matchesMajor;
  }) || [];

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            <Users className="text-[#c084fc]" size={22} /> Quản Lý Người Dùng
          </h2>
          <p className="text-sm text-[#9d90b0]">Xem danh sách, thêm tài khoản và hiệu chỉnh thông tin thành viên.</p>
        </div>
        
        <Button
          onClick={() => setIsNewModalOpen(true)}
          className="bg-[#c084fc] hover:bg-[#b06cf7] text-[#07050f] font-bold rounded-xl flex items-center gap-1.5 shadow-[0_4px_20px_rgba(192,132,252,0.2)] hover:shadow-[0_4px_24px_rgba(192,132,252,0.3)] transition-all cursor-pointer"
        >
          <Plus size={16} /> Thêm tài khoản mới
        </Button>
      </div>

      {/* Filter and Search controls */}
      <Card className="bg-[#0d091a]/40 border border-white/5 backdrop-blur-md">
        <CardBody className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5b526d]" size={15} />
            <input
              type="text"
              placeholder="Tìm kiếm tên, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-white text-xs outline-none focus:border-[#c084fc]/30 focus:bg-[#140f26] transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 w-full md:w-auto items-center justify-end">
            <div className="flex items-center gap-1.5 text-xs text-[#9d90b0] font-mono">
              <Filter size={12} /> LỌC:
            </div>
            
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#140f26]/60 border border-white/5 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer hover:border-white/10 transition-colors"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="user">Người dùng (User)</option>
              <option value="admin">Quản trị viên (Admin)</option>
            </select>

            {/* Major Filter */}
            <select
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
              className="bg-[#140f26]/60 border border-white/5 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer hover:border-white/10 transition-colors"
            >
              <option value="all">Tất cả ngành nghề</option>
              <option value="it">Công nghệ thông tin</option>
              <option value="designer">Thiết kế đồ họa</option>
              <option value="journalist">Báo chí truyền thông</option>
              <option value="economics">Kinh tế & Phân tích</option>
              <option value="other">Chuyên ngành khác</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Users table */}
      <Card className="bg-[#0d091a]/40 border border-white/5 backdrop-blur-md overflow-hidden">
        <CardBody className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-[#c084fc]" size={28} />
              <p className="text-xs text-[#9d90b0] font-mono">Đang tải danh sách người dùng...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="p-4 text-xs font-bold font-mono tracking-wider text-[#9d90b0] uppercase">Thành viên</th>
                    <th className="p-4 text-xs font-bold font-mono tracking-wider text-[#9d90b0] uppercase">Vai trò</th>
                    <th className="p-4 text-xs font-bold font-mono tracking-wider text-[#9d90b0] uppercase">Khối ngành</th>
                    <th className="p-4 text-xs font-bold font-mono tracking-wider text-[#9d90b0] uppercase">Ngày đăng ký</th>
                    <th className="p-4 text-xs font-bold font-mono tracking-wider text-[#9d90b0] uppercase text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            size="sm"
                            src={user.images_url || undefined}
                            name={user.username}
                            className="bg-white/5 border border-white/10 shrink-0 text-white"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user.username}</p>
                            <p className="text-xs text-[#5b526d] truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {user.role === "admin" ? (
                          <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                            <ShieldAlert size={10} /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full">
                            <UserIcon size={10} /> User
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-mono capitalize px-2 py-1 bg-white/[0.03] text-[#9d90b0] border border-white/5 rounded-lg">
                          {user.major}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-[#5b526d] flex items-center gap-1">
                          <Calendar size={12} /> {new Date(user.created_at).toLocaleDateString("vi-VN")}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          variant="light"
                          onClick={() => handleEditClick(user)}
                          className="text-[#c084fc] hover:bg-[#c084fc]/10 rounded-xl px-2 font-semibold min-w-0 cursor-pointer"
                        >
                          <Edit2 size={13} className="mr-1" /> Sửa
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-xs text-[#5b526d]">
                        Không tìm thấy người dùng nào phù hợp với bộ lọc
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modals Dialogs */}
      <AnimatePresence>
        {/* CREATE MODAL */}
        {isNewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-lg bg-[#0d091a] border border-white/10 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col text-left"
            >
              <div className="h-14 border-b border-white/5 flex items-center justify-between px-6">
                <h3 className="font-bold text-white text-sm tracking-wider font-mono uppercase">Tạo tài khoản mới</h3>
                <button onClick={() => setIsNewModalOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-[#9d90b0] hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Email đăng nhập *</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5b526d]" />
                      <input
                        type="email"
                        required
                        placeholder="user@lawoh.click"
                        value={newForm.email}
                        onChange={e => setNewForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Tên người dùng *</label>
                    <div className="relative">
                      <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5b526d]" />
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={newForm.username}
                        onChange={e => setNewForm(f => ({ ...f, username: e.target.value }))}
                        className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Mật khẩu khởi tạo *</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5b526d]" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={newForm.password}
                        onChange={e => setNewForm(f => ({ ...f, password: e.target.value }))}
                        className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all"
                      />
                    </div>
                  </div>

                  {/* Role selection */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Vai trò trên hệ thống</label>
                    <select
                      value={newForm.role}
                      onChange={e => setNewForm(f => ({ ...f, role: e.target.value }))}
                      className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 px-3 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all cursor-pointer"
                    >
                      <option value="user">Người dùng thông thường (User)</option>
                      <option value="admin">Quản trị viên (Admin)</option>
                    </select>
                  </div>

                  {/* Major selection */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Khối ngành hoạt động</label>
                    <select
                      value={newForm.major}
                      onChange={e => setNewForm(f => ({ ...f, major: e.target.value }))}
                      className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 px-3 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all cursor-pointer"
                    >
                      <option value="it">Công nghệ thông tin (IT)</option>
                      <option value="designer">Thiết kế đồ họa (Design)</option>
                      <option value="journalist">Báo chí truyền thông</option>
                      <option value="economics">Kinh tế & Phân tích</option>
                      <option value="other">Ngành nghề khác</option>
                    </select>
                  </div>

                  {/* Avatar upload */}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Ảnh đại diện (Avatar)</label>
                    <input
                      ref={newAvatarRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => setNewAvatar(e.target.files?.[0] ?? null)}
                    />
                    <div 
                      onClick={() => newAvatarRef.current?.click()}
                      className="w-full border-2 border-dashed border-white/5 hover:border-[#c084fc]/30 bg-white/[0.01] hover:bg-white/[0.02] rounded-xl py-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Upload className="text-[#9d90b0]" size={16} />
                      <span className="text-[11px] font-medium text-white">{newAvatar ? newAvatar.name : "Tải ảnh lên hoặc chọn file"}</span>
                      <span className="text-[9px] text-[#5b526d]">Định dạng JPG, PNG, GIF. Tối đa 5MB.</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5 justify-end">
                  <Button
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    className="bg-white/5 border border-white/10 text-white font-semibold rounded-xl text-xs cursor-pointer"
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreating}
                    className="bg-[#c084fc] hover:bg-[#b06cf7] text-[#07050f] font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {isCreating ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />} Tạo tài khoản
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* EDIT MODAL */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-lg bg-[#0d091a] border border-white/10 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col text-left"
            >
              <div className="h-14 border-b border-white/5 flex items-center justify-between px-6">
                <h3 className="font-bold text-white text-sm tracking-wider font-mono uppercase">Hiệu chỉnh tài khoản</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-[#9d90b0] hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01] mb-2">
                  <Avatar
                    src={selectedUser?.images_url || undefined}
                    name={selectedUser?.username}
                    size="md"
                    className="border border-white/10 bg-white/5 text-white"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{selectedUser?.username}</p>
                    <p className="text-xs text-[#5b526d] truncate">{selectedUser?.email}</p>
                    <span className="inline-block text-[9px] font-mono font-bold uppercase text-[#c084fc] mt-1 bg-[#c084fc]/10 px-2 py-0.5 rounded">
                      ID: {selectedUser?.id}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Username */}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Tên người dùng *</label>
                    <div className="relative">
                      <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5b526d]" />
                      <input
                        type="text"
                        required
                        value={editForm.username}
                        onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))}
                        className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all"
                      />
                    </div>
                  </div>

                  {/* Password change */}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Mật khẩu mới (Để trống nếu giữ nguyên)</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5b526d]" />
                      <input
                        type="password"
                        placeholder="Nhập mật khẩu mới thay thế"
                        value={editForm.password}
                        onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))}
                        className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all"
                      />
                    </div>
                  </div>

                  {/* Major selection */}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Khối ngành hoạt động</label>
                    <select
                      value={editForm.major}
                      onChange={e => setEditForm(f => ({ ...f, major: e.target.value }))}
                      className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 px-3 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all cursor-pointer"
                    >
                      <option value="it">Công nghệ thông tin (IT)</option>
                      <option value="designer">Thiết kế đồ họa (Design)</option>
                      <option value="journalist">Báo chí truyền thông</option>
                      <option value="economics">Kinh tế & Phân tích</option>
                      <option value="other">Ngành nghề khác</option>
                    </select>
                  </div>

                  {/* Avatar upload */}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Thay đổi ảnh đại diện</label>
                    <input
                      ref={editAvatarRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => setEditAvatar(e.target.files?.[0] ?? null)}
                    />
                    <div 
                      onClick={() => editAvatarRef.current?.click()}
                      className="w-full border-2 border-dashed border-white/5 hover:border-[#c084fc]/30 bg-white/[0.01] hover:bg-white/[0.02] rounded-xl py-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Upload className="text-[#9d90b0]" size={16} />
                      <span className="text-[11px] font-medium text-white">{editAvatar ? editAvatar.name : "Tải lên ảnh đại diện mới"}</span>
                      <span className="text-[9px] text-[#5b526d]">Định dạng JPG, PNG. Tối đa 5MB.</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5 justify-end">
                  <Button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="bg-white/5 border border-white/10 text-white font-semibold rounded-xl text-xs cursor-pointer"
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-[#c084fc] hover:bg-[#b06cf7] text-[#07050f] font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {isUpdating ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} Lưu thay đổi
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
