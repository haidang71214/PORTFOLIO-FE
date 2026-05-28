"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Layers, 
  Search, 
  Plus, 
  Edit2, 
  Trash2,
  X,
  Upload,
  Loader2,
  Filter,
  Save,
  DollarSign,
  Package,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Key
} from "lucide-react";
import {
  useGetAllTemplatesQuery,
  useAdminCreateTemplateMutation,
  useAdminUpdateTemplateMutation,
  useAdminDeleteTemplateMutation,
  useAdminGrantTemplateMutation
} from "@/store/queries/templates";
import { Card, CardBody, Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Enum for target majors matching backend
enum TemplateMajor {
  IT = "it",
  JOURNALIST = "journalist",
  DESIGNER = "designer",
  ECONOMICS = "economics",
  OTHER = "other",  
}

const MAJOR_LABELS: Record<string, string> = {
  [TemplateMajor.IT]: "Công nghệ thông tin (IT)",
  [TemplateMajor.DESIGNER]: "Thiết kế đồ họa (Design)",
  [TemplateMajor.JOURNALIST]: "Báo chí truyền thông",
  [TemplateMajor.ECONOMICS]: "Kinh tế & Phân tích",
  [TemplateMajor.OTHER]: "Chuyên ngành khác",
};

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[đĐ]/g, "d")
    .replace(/([^0-9a-z-\s])/g, "") // remove special chars
    .replace(/(\s+)/g, "-") // replace spaces with -
    .replace(/-+/g, "-") // collapse multiple -
    .replace(/^-+|-+$/g, ""); // trim -
};

const formatPrice = (value: number | string) => {
  if (value === undefined || value === null || value === "") return "";
  const num = typeof value === "number" ? value : parseInt(value.replace(/\D/g, ""), 10);
  if (isNaN(num)) return "";
  return num.toLocaleString("vi-VN");
};

const parsePrice = (value: string) => {
  const cleanStr = value.replace(/\D/g, "");
  return cleanStr ? parseInt(cleanStr, 10) : 0;
};

export default function AdminTemplatesPage() {
  const { data: templates, isLoading, refetch } = useGetAllTemplatesQuery();
  const [createTemplate, { isLoading: isCreating }] = useAdminCreateTemplateMutation();
  const [updateTemplate, { isLoading: isUpdating }] = useAdminUpdateTemplateMutation();
  const [deleteTemplate, { isLoading: isDeleting }] = useAdminDeleteTemplateMutation();
  const [grantTemplate, { isLoading: isGranting }] = useAdminGrantTemplateMutation();

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [majorFilter, setMajorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal states
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);

  // Selected item state
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // Grant Form state
  const [grantForm, setGrantForm] = useState({
    email: "",
    expiryType: "permanent",
    customExpiryDate: ""
  });

  // Forms state
  const [newForm, setNewForm] = useState({
    name: "",
    slug: "",
    description: "",
    targetMajor: TemplateMajor.IT,
    price: 0,
    stockLimit: "",
    isActive: true
  });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    slug: "",
    description: "",
    targetMajor: TemplateMajor.IT,
    price: 0,
    stockLimit: "",
    isActive: true
  });
  const [editImages, setEditImages] = useState<File[]>([]);

  // Refs
  const newImagesRef = useRef<HTMLInputElement>(null);
  const editImagesRef = useRef<HTMLInputElement>(null);

  // Handlers for Granting Theme
  const handleGrantClick = (template: any) => {
    setSelectedTemplate(template);
    setGrantForm({
      email: "",
      expiryType: "permanent",
      customExpiryDate: ""
    });
    setIsGrantModalOpen(true);
  };

  const handleGrantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantForm.email.trim()) {
      toast.error("Vui lòng nhập email của người dùng!");
      return;
    }

    try {
      let expiresAt: string | null = null;
      if (grantForm.expiryType === "30days") {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        expiresAt = d.toISOString();
      } else if (grantForm.expiryType === "90days") {
        const d = new Date();
        d.setDate(d.getDate() + 90);
        expiresAt = d.toISOString();
      } else if (grantForm.expiryType === "1year") {
        const d = new Date();
        d.setDate(d.getDate() + 365);
        expiresAt = d.toISOString();
      } else if (grantForm.expiryType === "custom" && grantForm.customExpiryDate) {
        expiresAt = new Date(grantForm.customExpiryDate).toISOString();
      }

      await grantTemplate({
        email: grantForm.email,
        themeId: selectedTemplate.id,
        expiresAt
      }).unwrap();

      toast.success(`Đã cấp giao diện "${selectedTemplate.name}" cho người dùng "${grantForm.email}" thành công!`);
      setIsGrantModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Lỗi khi cấp giao diện cho người dùng!");
    }
  };

  // Handlers for Slug auto-generation
  const handleNewNameChange = (val: string) => {
    setNewForm(prev => {
      const updated = { ...prev, name: val };
      if (!isSlugManuallyEdited) {
        updated.slug = generateSlug(val);
      }
      return updated;
    });
  };

  const handleEditNameChange = (val: string) => {
    setEditForm(prev => ({
      ...prev,
      name: val,
      slug: generateSlug(val) // Always sync or allow edit
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name.trim() || !newForm.slug.trim()) {
      toast.error("Vui lòng điền tên và đường dẫn (slug) mẫu giao diện!");
      return;
    }

    try {
      const payload = {
        name: newForm.name,
        slug: newForm.slug,
        description: newForm.description.trim() || undefined,
        targetMajor: newForm.targetMajor,
        price: Number(newForm.price),
        stockLimit: newForm.stockLimit.trim() ? Number(newForm.stockLimit) : null,
        isActive: newForm.isActive,
        images: newImages
      };

      await createTemplate(payload).unwrap();
      toast.success("Tạo mẫu giao diện mới thành công!");
      setIsNewModalOpen(false);
      resetNewForm();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Lỗi tạo mẫu giao diện!");
    }
  };

  const handleEditClick = (template: any) => {
    setSelectedTemplate(template);
    setEditForm({
      name: template.name,
      slug: template.slug,
      description: template.description || "",
      targetMajor: (template.target_major || template.targetMajor || template.major || TemplateMajor.IT) as TemplateMajor,
      price: Number(template.price) || 0,
      stockLimit: template.stockLimit !== null && template.stockLimit !== undefined ? String(template.stockLimit) : "",
      isActive: template.isActive !== undefined ? template.isActive : template.is_active
    });
    setEditImages([]);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.slug.trim()) {
      toast.error("Tên và đường dẫn slug không được để trống!");
      return;
    }

    try {
      const body = {
        name: editForm.name,
        slug: editForm.slug,
        description: editForm.description.trim() || null,
        targetMajor: editForm.targetMajor,
        price: Number(editForm.price),
        stockLimit: editForm.stockLimit.trim() ? Number(editForm.stockLimit) : null,
        isActive: editForm.isActive,
        images: editImages.length > 0 ? editImages : undefined
      };

      await updateTemplate({
        id: selectedTemplate.id,
        body
      }).unwrap();

      toast.success("Cập nhật mẫu giao diện thành công!");
      setIsEditModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Lỗi cập nhật giao diện!");
    }
  };

  const handleDeleteClick = (template: any) => {
    setSelectedTemplate(template);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTemplate) return;
    try {
      await deleteTemplate(selectedTemplate.id).unwrap();
      toast.success(`Đã xóa mẫu giao diện "${selectedTemplate.name}" thành công!`);
      setIsDeleteConfirmOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Lỗi khi xóa mẫu giao diện!");
    }
  };

  const resetNewForm = () => {
    setNewForm({
      name: "",
      slug: "",
      description: "",
      targetMajor: TemplateMajor.IT,
      price: 0,
      stockLimit: "",
      isActive: true
    });
    setNewImages([]);
    setIsSlugManuallyEdited(false);
  };

  // Filter lists
  const filteredTemplates = templates?.filter((tpl) => {
    const matchesSearch = 
      tpl.name.toLowerCase().includes(search.toLowerCase()) || 
      tpl.slug.toLowerCase().includes(search.toLowerCase());
    
    const tplMajor = tpl.target_major || tpl.targetMajor || tpl.major || "other";
    const matchesMajor = majorFilter === "all" || tplMajor === majorFilter;
    
    const tplActive = tpl.isActive !== undefined ? tpl.isActive : tpl.is_active;
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && tplActive) || 
      (statusFilter === "inactive" && !tplActive);

    return matchesSearch && matchesMajor && matchesStatus;
  }) || [];

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            <Layers className="text-[#c084fc]" size={22} /> Quản Lý Mẫu Giao Diện
          </h2>
          <p className="text-sm text-[#9d90b0]">Đăng ký, điều chỉnh, cập nhật giá bán và bật/tắt các theme mẫu trong kho hệ thống.</p>
        </div>
        
        <Button
          onClick={() => { resetNewForm(); setIsNewModalOpen(true); }}
          className="bg-[#c084fc] hover:bg-[#b06cf7] text-[#07050f] font-bold rounded-xl flex items-center gap-1.5 shadow-[0_4px_20px_rgba(192,132,252,0.2)] hover:shadow-[0_4px_24px_rgba(192,132,252,0.3)] transition-all cursor-pointer"
        >
          <Plus size={16} /> Thêm mẫu giao diện
        </Button>
      </div>

      {/* Stats cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Tổng số mẫu", val: templates?.length || 0, color: "text-[#c084fc]" },
          { label: "Đang hoạt động", val: templates?.filter(t => t.isActive !== undefined ? t.isActive : t.is_active).length || 0, color: "text-emerald-400" },
          { label: "Miễn phí (Free)", val: templates?.filter(t => !Number(t.price)).length || 0, color: "text-blue-400" },
          { label: "Có tính phí", val: templates?.filter(t => !!Number(t.price)).length || 0, color: "text-amber-400" }
        ].map((stat, idx) => (
          <Card key={idx} className="bg-[#0d091a]/40 border border-white/5 backdrop-blur-md">
            <CardBody className="p-4 flex flex-col justify-center text-center">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#5b526d]">{stat.label}</span>
              <span className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.val}</span>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Filter and Search controls */}
      <Card className="bg-[#0d091a]/40 border border-white/5 backdrop-blur-md">
        <CardBody className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5b526d]" size={15} />
            <input
              type="text"
              placeholder="Tìm tên, slug giao diện..."
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
            
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#140f26]/60 border border-white/5 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer hover:border-white/10 transition-colors"
            >
              <option value="all" className="bg-[#140f26] text-white">Tất cả trạng thái</option>
              <option value="active" className="bg-[#140f26] text-white">Đang kích hoạt</option>
              <option value="inactive" className="bg-[#140f26] text-white">Đã tạm ẩn</option>
            </select>

            {/* Major Filter */}
            <select
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
              className="bg-[#140f26]/60 border border-white/5 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer hover:border-white/10 transition-colors"
            >
              <option value="all" className="bg-[#140f26] text-white">Tất cả khối ngành</option>
              <option value="it" className="bg-[#140f26] text-white">Công nghệ thông tin</option>
              <option value="designer" className="bg-[#140f26] text-white">Thiết kế đồ họa</option>
              <option value="journalist" className="bg-[#140f26] text-white">Báo chí truyền thông</option>
              <option value="economics" className="bg-[#140f26] text-white">Kinh tế & Phân tích</option>
              <option value="other" className="bg-[#140f26] text-white">Các ngành khác</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Templates Table/Grid */}
      <Card className="bg-[#0d091a]/40 border border-white/5 backdrop-blur-md overflow-hidden">
        <CardBody className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-[#c084fc]" size={28} />
              <p className="text-xs text-[#9d90b0] font-mono">Đang tải danh sách mẫu giao diện...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="p-4 text-xs font-bold font-mono tracking-wider text-[#9d90b0] uppercase">Mẫu Theme</th>
                    <th className="p-4 text-xs font-bold font-mono tracking-wider text-[#9d90b0] uppercase">Đường dẫn slug</th>
                    <th className="p-4 text-xs font-bold font-mono tracking-wider text-[#9d90b0] uppercase">Khối ngành</th>
                    <th className="p-4 text-xs font-bold font-mono tracking-wider text-[#9d90b0] uppercase">Trạng thái</th>
                    <th className="p-4 text-xs font-bold font-mono tracking-wider text-[#9d90b0] uppercase">Giá bán (VND)</th>
                    <th className="p-4 text-xs font-bold font-mono tracking-wider text-[#9d90b0] uppercase">Hạn mức mua</th>
                    <th className="p-4 text-xs font-bold font-mono tracking-wider text-[#9d90b0] uppercase text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTemplates.map((tpl) => {
                    const isTplActive = tpl.isActive !== undefined ? tpl.isActive : tpl.is_active;
                    const previewImg = (tpl.previewImageUrls && tpl.previewImageUrls[0]) || tpl.preview_url;

                    return (
                      <tr key={tpl.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-10 rounded-lg bg-[#140f26] overflow-hidden border border-white/10 shrink-0 relative group">
                              {previewImg ? (
                                <img src={previewImg} alt={tpl.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                              ) : (
                                <div className="w-full h-full bg-[#c084fc]/5 flex items-center justify-center">
                                  <ImageIcon size={14} className="text-[#c084fc]/40" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{tpl.name}</p>
                              <p className="text-xs text-[#5b526d] truncate line-clamp-1">{tpl.description || "Không có mô tả"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-xs font-mono text-[#c084fc] bg-[#c084fc]/10 px-2 py-0.5 rounded border border-[#c084fc]/10">
                            /{tpl.slug}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-xs text-[#9d90b0] font-mono capitalize">
                            {tpl.target_major || tpl.targetMajor || tpl.major || "other"}
                          </span>
                        </td>
                        <td className="p-4">
                          {isTplActive ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                              <CheckCircle2 size={10} /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-white/5 text-[#5b526d] border border-white/5 px-2 py-0.5 rounded-full">
                              <AlertCircle size={10} /> Hidden
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="text-xs font-semibold text-white">
                            {Number(tpl.price) ? `${Number(tpl.price).toLocaleString("vi-VN")} đ` : "Miễn phí"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-xs text-[#9d90b0] font-mono">
                            {tpl.stockLimit !== null && tpl.stockLimit !== undefined ? `${tpl.stockLimit} lượt` : "Vô hạn"}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1">
                          <Button
                            size="sm"
                            variant="light"
                            onClick={() => handleGrantClick(tpl)}
                            className="text-amber-400 hover:bg-amber-500/10 rounded-xl px-2 font-semibold min-w-0 cursor-pointer"
                          >
                            <Key size={13} className="mr-1" /> Cấp quyền
                          </Button>
                          <Button
                            size="sm"
                            variant="light"
                            onClick={() => handleEditClick(tpl)}
                            className="text-[#c084fc] hover:bg-[#c084fc]/10 rounded-xl px-2 font-semibold min-w-0 cursor-pointer"
                          >
                            <Edit2 size={13} className="mr-1" /> Sửa
                          </Button>
                          <Button
                            size="sm"
                            variant="light"
                            onClick={() => handleDeleteClick(tpl)}
                            className="text-red-400 hover:bg-red-500/10 rounded-xl px-2 font-semibold min-w-0 cursor-pointer"
                          >
                            <Trash2 size={13} className="mr-1" /> Xóa
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredTemplates.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-xs text-[#5b526d]">
                        Không tìm thấy mẫu giao diện nào trong kho
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Dialog Modals */}
      <AnimatePresence>
        {/* CREATE MODAL */}
        {isNewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsNewModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-xl bg-[#0d091a] border border-white/10 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col text-left"
            >
              <div className="h-14 border-b border-white/5 flex items-center justify-between px-6">
                <h3 className="font-bold text-white text-sm tracking-wider font-mono uppercase">Thêm Mẫu Giao Diện Mới</h3>
                <button onClick={() => setIsNewModalOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-[#9d90b0] hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Tên Mẫu Giao Diện *</label>
                    <input
                      type="text" required placeholder="Ví dụ: Code Grid Dark"
                      value={newForm.name}
                      onChange={e => handleNewNameChange(e.target.value)}
                      className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 px-4 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all"
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Đường dẫn tĩnh (Slug) *</label>
                    <input
                      type="text" required placeholder="code-grid-dark"
                      value={newForm.slug}
                      onChange={e => { setNewForm(prev => ({ ...prev, slug: e.target.value })); setIsSlugManuallyEdited(true); }}
                      className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 px-4 text-white text-xs font-mono outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all"
                    />
                  </div>

                  {/* Target Major */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Khối ngành hoạt động *</label>
                    <select
                      value={newForm.targetMajor}
                      onChange={e => setNewForm(f => ({ ...f, targetMajor: e.target.value as TemplateMajor }))}
                      className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 px-3 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all cursor-pointer"
                    >
                      {Object.keys(MAJOR_LABELS).map(key => (
                        <option key={key} value={key} className="bg-[#140f26] text-white">{MAJOR_LABELS[key]}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Giá bán (VND) (0 = Free)</label>
                    <div className="relative">
                      <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5b526d]" />
                      <input
                        type="text"
                        value={formatPrice(newForm.price)}
                        onChange={e => {
                          const val = parsePrice(e.target.value);
                          setNewForm(f => ({ ...f, price: val }));
                        }}
                        className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all"
                      />
                    </div>
                  </div>

                  {/* Stock Limit */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Hạn mức mua (Để trống = vô hạn)</label>
                    <div className="relative">
                      <Package size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5b526d]" />
                      <input
                        type="number" min={1} placeholder="Ví dụ: 100"
                        value={newForm.stockLimit}
                        onChange={e => setNewForm(f => ({ ...f, stockLimit: e.target.value }))}
                        className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all"
                      />
                    </div>
                  </div>

                  {/* Is Active */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1 flex flex-col justify-end pb-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox" id="newActive"
                        checked={newForm.isActive}
                        onChange={e => setNewForm(f => ({ ...f, isActive: e.target.checked }))}
                        className="w-4 h-4 rounded border-white/10 bg-[#140f26]/60 accent-[#c084fc]"
                      />
                      <label htmlFor="newActive" className="text-xs text-white font-medium cursor-pointer">Bật hoạt động mẫu ngay khi tạo</label>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Mô tả tóm tắt mẫu giao diện</label>
                    <textarea
                      placeholder="Mẫu giao diện tối giản cho các nhà báo, tập trung làm nổi bật các bài viết chuyên môn..."
                      value={newForm.description}
                      onChange={e => setNewForm(f => ({ ...f, description: e.target.value }))}
                      rows={2}
                      className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2 px-4 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all resize-none"
                    />
                  </div>



                  {/* Upload preview images */}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Ảnh xem trước (Preview Images) (Có thể chọn nhiều)</label>
                    <input
                      ref={newImagesRef}
                      type="file" multiple accept="image/*" className="hidden"
                      onChange={e => {
                        if (e.target.files) {
                          setNewImages(Array.from(e.target.files));
                        }
                      }}
                    />
                    <div 
                      onClick={() => newImagesRef.current?.click()}
                      className="w-full border-2 border-dashed border-white/5 hover:border-[#c084fc]/30 bg-white/[0.01] hover:bg-white/[0.02] rounded-xl py-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Upload className="text-[#9d90b0]" size={16} />
                      <span className="text-[11px] font-medium text-white">
                        {newImages.length > 0 ? `Đã chọn ${newImages.length} ảnh` : "Tải ảnh lên hoặc chọn các file"}
                      </span>
                      <span className="text-[9px] text-[#5b526d]">Hỗ trợ JPG, PNG, GIF. Dung lượng tối đa 5MB mỗi file.</span>
                    </div>

                    {/* Previews selected list */}
                    {newImages.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {newImages.map((img, idx) => (
                          <div key={idx} className="text-[10px] bg-white/5 border border-white/10 rounded-lg px-2 py-1 flex items-center gap-1.5 text-[#9d90b0]">
                            <ImageIcon size={10} />
                            <span className="truncate max-w-[120px]">{img.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
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
                    {isCreating ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />} Tạo Theme Mới
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* EDIT MODAL */}
        {isEditModalOpen && selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-xl bg-[#0d091a] border border-white/10 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col text-left"
            >
              <div className="h-14 border-b border-white/5 flex items-center justify-between px-6">
                <h3 className="font-bold text-white text-sm tracking-wider font-mono uppercase">Hiệu Chỉnh Mẫu Giao Diện</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-[#9d90b0] hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                {/* Image overview panel */}
                <div className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.01]">
                  <div className="w-16 h-12 rounded bg-[#140f26] overflow-hidden border border-white/10 shrink-0">
                    {((selectedTemplate.previewImageUrls && selectedTemplate.previewImageUrls[0]) || selectedTemplate.preview_url) ? (
                      <img 
                        src={(selectedTemplate.previewImageUrls && selectedTemplate.previewImageUrls[0]) || selectedTemplate.preview_url} 
                        alt="" className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#c084fc]/5 text-[#c084fc]/40">
                        <ImageIcon size={18} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate">{selectedTemplate.name}</h4>
                    <p className="text-[10px] text-[#5b526d] font-mono mt-0.5">ID: {selectedTemplate.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Tên Mẫu Giao Diện *</label>
                    <input
                      type="text" required
                      value={editForm.name}
                      onChange={e => handleEditNameChange(e.target.value)}
                      className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 px-4 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all"
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Đường dẫn tĩnh (Slug) *</label>
                    <input
                      type="text" required
                      value={editForm.slug}
                      onChange={e => setEditForm(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 px-4 text-white text-xs font-mono outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all"
                    />
                  </div>

                  {/* Target Major */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Khối ngành hoạt động *</label>
                    <select
                      value={editForm.targetMajor}
                      onChange={e => setEditForm(f => ({ ...f, targetMajor: e.target.value as TemplateMajor }))}
                      className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 px-3 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all cursor-pointer"
                    >
                      {Object.keys(MAJOR_LABELS).map(key => (
                        <option key={key} value={key} className="bg-[#140f26] text-white">{MAJOR_LABELS[key]}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Giá bán (VND)</label>
                    <div className="relative">
                      <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5b526d]" />
                      <input
                        type="text"
                        value={formatPrice(editForm.price)}
                        onChange={e => {
                          const val = parsePrice(e.target.value);
                          setEditForm(f => ({ ...f, price: val }));
                        }}
                        className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all"
                      />
                    </div>
                  </div>

                  {/* Stock Limit */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Hạn mức mua (Để trống = vô hạn)</label>
                    <div className="relative">
                      <Package size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5b526d]" />
                      <input
                        type="number" min={1} placeholder="Vô hạn"
                        value={editForm.stockLimit}
                        onChange={e => setEditForm(f => ({ ...f, stockLimit: e.target.value }))}
                        className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all"
                      />
                    </div>
                  </div>

                  {/* Is Active */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1 flex flex-col justify-end pb-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox" id="editActive"
                        checked={editForm.isActive}
                        onChange={e => setEditForm(f => ({ ...f, isActive: e.target.checked }))}
                        className="w-4 h-4 rounded border-white/10 bg-[#140f26]/60 accent-[#c084fc]"
                      />
                      <label htmlFor="editActive" className="text-xs text-white font-medium cursor-pointer">Bật hoạt động mẫu giao diện</label>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Mô tả tóm tắt</label>
                    <textarea
                      value={editForm.description}
                      onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                      rows={2}
                      className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2 px-4 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all resize-none"
                    />
                  </div>



                  {/* Upload new preview images */}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Thay ảnh xem trước mới (Sẽ ghi đè ảnh cũ)</label>
                    <input
                      ref={editImagesRef}
                      type="file" multiple accept="image/*" className="hidden"
                      onChange={e => {
                        if (e.target.files) {
                          setEditImages(Array.from(e.target.files));
                        }
                      }}
                    />
                    <div 
                      onClick={() => editImagesRef.current?.click()}
                      className="w-full border-2 border-dashed border-white/5 hover:border-[#c084fc]/30 bg-white/[0.01] hover:bg-white/[0.02] rounded-xl py-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Upload className="text-[#9d90b0]" size={16} />
                      <span className="text-[11px] font-medium text-white">
                        {editImages.length > 0 ? `Đã chọn ${editImages.length} ảnh mới` : "Chọn các file ảnh để thay thế"}
                      </span>
                      <span className="text-[9px] text-[#5b526d]">JPG, PNG, GIF. Chọn file mới để cập nhật ảnh xem trước.</span>
                    </div>

                    {editImages.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {editImages.map((img, idx) => (
                          <div key={idx} className="text-[10px] bg-white/5 border border-white/10 rounded-lg px-2 py-1 flex items-center gap-1.5 text-[#9d90b0]">
                            <ImageIcon size={10} />
                            <span className="truncate max-w-[120px]">{img.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
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
                    {isUpdating ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} Lưu Thay Đổi
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* DELETE CONFIRMATION DIALOG */}
        {isDeleteConfirmOpen && selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-sm bg-[#0d091a] border border-white/10 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] p-6 text-left"
            >
              <div className="flex items-center gap-3 text-red-400 mb-3">
                <AlertCircle size={22} />
                <h3 className="font-bold text-sm uppercase tracking-wider font-mono">Xác Nhận Xóa</h3>
              </div>
              
              <p className="text-xs text-[#9d90b0] leading-relaxed mb-6">
                Bạn có chắc chắn muốn xóa mẫu giao diện <strong className="text-white">"{selectedTemplate.name}"</strong>? Hành động này sẽ loại bỏ hoàn toàn mẫu giao diện khỏi hệ thống và không thể khôi phục.
              </p>

              <div className="flex gap-3 justify-end">
                <Button
                  size="sm"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="bg-white/5 border border-white/10 text-white font-semibold rounded-lg text-xs cursor-pointer"
                >
                  Hủy bỏ
                </Button>
                <Button
                  size="sm"
                  disabled={isDeleting}
                  onClick={handleDeleteConfirm}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                >
                  {isDeleting ? <Loader2 className="animate-spin" size={12} /> : <Trash2 size={12} />} Đồng ý Xóa
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* GRANT MODAL */}
        {isGrantModalOpen && selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsGrantModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-md bg-[#0d091a] border border-white/10 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col text-left"
            >
              <div className="h-14 border-b border-white/5 flex items-center justify-between px-6">
                <h3 className="font-bold text-white text-sm tracking-wider font-mono uppercase">Cấp Quyền Sử Dụng Giao Diện</h3>
                <button onClick={() => setIsGrantModalOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-[#9d90b0] hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleGrantSubmit} className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.01]">
                  <div className="w-16 h-12 rounded bg-[#140f26] overflow-hidden border border-white/10 shrink-0 flex items-center justify-center text-[#c084fc]/40">
                    <Key size={20} className="text-[#c084fc]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate">{selectedTemplate.name}</h4>
                    <p className="text-[10px] text-[#5b526d] font-mono mt-0.5">ID: {selectedTemplate.id}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Email Người Nhận *</label>
                    <input
                      type="email" required placeholder="user@gmail.com"
                      value={grantForm.email}
                      onChange={e => setGrantForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 px-4 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all"
                    />
                  </div>

                  {/* Expiry Type */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Thời Hạn Sử Dụng *</label>
                    <select
                      value={grantForm.expiryType}
                      onChange={e => setGrantForm(prev => ({ ...prev, expiryType: e.target.value }))}
                      className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 px-3 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all cursor-pointer"
                    >
                      <option value="permanent" className="bg-[#140f26] text-white">Vĩnh viễn (Trọn đời)</option>
                      <option value="30days" className="bg-[#140f26] text-white">30 ngày (1 tháng)</option>
                      <option value="90days" className="bg-[#140f26] text-white">90 ngày (3 tháng)</option>
                      <option value="1year" className="bg-[#140f26] text-white">1 năm (365 ngày)</option>
                      <option value="custom" className="bg-[#140f26] text-white">Tự chọn ngày hết hạn...</option>
                    </select>
                  </div>

                  {/* Custom Expiry Date */}
                  {grantForm.expiryType === "custom" && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-mono block">Ngày Hết Hạn *</label>
                      <input
                        type="date" required
                        min={new Date().toISOString().split("T")[0]}
                        value={grantForm.customExpiryDate}
                        onChange={e => setGrantForm(prev => ({ ...prev, customExpiryDate: e.target.value }))}
                        className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2.5 px-4 text-white text-xs outline-none focus:border-[#c084fc]/50 focus:bg-[#140f26] transition-all"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5 justify-end">
                  <Button
                    type="button"
                    onClick={() => setIsGrantModalOpen(false)}
                    className="bg-white/5 border border-white/10 text-white font-semibold rounded-xl text-xs cursor-pointer"
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    disabled={isGranting}
                    className="bg-amber-500 hover:bg-amber-600 text-[#07050f] font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {isGranting ? <Loader2 className="animate-spin" size={14} /> : <Key size={14} />} Cấp Giao Diện
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
