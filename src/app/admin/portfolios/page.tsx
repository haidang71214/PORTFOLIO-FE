"use client";

import React, { useState, useEffect } from "react";
import { 
  Palette, 
  Search, 
  ExternalLink,
  X,
  Loader2,
  FileText,
  User,
  Check,
  Building,
  MapPin,
  Globe
} from "lucide-react";
import { useGetAllPortfoliosQuery, useAdminChangeThemeMutation } from "@/store/queries/profile";
import { useGetAllUsersQuery } from "@/store/queries/auth";
import { useGetAllTemplatesQuery } from "@/store/queries/templates";
import { Card, CardBody, Avatar, Button, Tooltip } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function AdminPortfoliosPage() {
  const { data: portfolios, isLoading: portfoliosLoading, refetch: refetchPortfolios } = useGetAllPortfoliosQuery();
  const { data: users, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: templates, isLoading: templatesLoading } = useGetAllTemplatesQuery();
  
  const [changeTheme, { isLoading: isChangingTheme }] = useAdminChangeThemeMutation();

  // Search & Filter state
  const [search, setSearch] = useState("");

  // Modal states
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);

  const isLoading = portfoliosLoading || usersLoading || templatesLoading;

  // Correlate portfolios with user data
  const portfoliosWithUser = portfolios?.map((portfolio) => {
    const userDetail = users?.find((u) => u.id === portfolio.user_id);
    const themeDetail = templates?.find((t) => t.id === portfolio.theme_id);
    return {
      ...portfolio,
      user: userDetail,
      theme: themeDetail
    };
  }) || [];

  // Filtered list
  const filteredPortfolios = portfoliosWithUser.filter((item) => {
    const username = item.user?.username || "";
    const email = item.user?.email || "";
    const title = item.title || "";
    const bio = item.bio || "";
    
    const matchesSearch = 
      username.toLowerCase().includes(search.toLowerCase()) || 
      email.toLowerCase().includes(search.toLowerCase()) || 
      title.toLowerCase().includes(search.toLowerCase()) || 
      bio.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  const handleChangeThemeClick = (portfolio: any) => {
    setSelectedPortfolio(portfolio);
    setIsThemeModalOpen(true);
  };

  const handleApplyTheme = async (templateId: string) => {
    if (!selectedPortfolio) return;

    try {
      await changeTheme({
        userId: selectedPortfolio.user_id,
        theme_id: templateId
      }).unwrap();
      toast.success(`Đã cập nhật giao diện của ${selectedPortfolio.user?.username || "người dùng"} thành công!`);
      setIsThemeModalOpen(false);
      refetchPortfolios();
    } catch (err: any) {
      toast.error(err?.data?.message || "Lỗi thay đổi giao diện!");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          <Palette className="text-[#c084fc]" size={22} /> Themes & Portfolios
        </h2>
        <p className="text-sm text-[#9d90b0]">Xem và điều khiển giao diện Portfolio đang áp dụng trên toàn hệ thống.</p>
      </div>

      {/* Filter and Search controls */}
      <Card className="bg-[#0d091a]/40 border border-white/5 backdrop-blur-md">
        <CardBody className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5b526d]" size={15} />
            <input
              type="text"
              placeholder="Tìm kiếm portfolio, tên thành viên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#140f26]/60 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-white text-xs outline-none focus:border-[#c084fc]/30 focus:bg-[#140f26] transition-all"
            />
          </div>

          <div className="text-xs text-[#5b526d] font-mono uppercase">
            Tổng số hồ sơ: {filteredPortfolios.length} / {portfoliosWithUser.length}
          </div>
        </CardBody>
      </Card>

      {/* Portfolios list */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="animate-spin text-[#c084fc]" size={28} />
          <p className="text-xs text-[#9d90b0] font-mono">Đang tải danh sách hồ sơ & giao diện...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolios.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-[#0d091a]/40 border border-white/5 backdrop-blur-md hover:border-white/10 transition-colors h-full flex flex-col justify-between">
                <CardBody className="p-5 space-y-4">
                  {/* Top user info card */}
                  <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                    <Avatar
                      src={item.user?.images_url || undefined}
                      name={item.user?.username}
                      size="sm"
                      className="border border-white/10 bg-white/5 text-white"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{item.user?.username || "Không có tên"}</p>
                      <p className="text-[10px] text-[#5b526d] truncate">{item.user?.email || "Chưa thiết lập"}</p>
                    </div>
                  </div>

                  {/* Portfolio title and bio */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#c084fc]">
                      <FileText size={13} /> {item.title || "Chưa thiết lập tiêu đề"}
                    </div>
                    <p className="text-xs text-[#9d90b0] line-clamp-2 h-8 leading-relaxed">
                      {item.bio || "Thành viên này chưa viết lời giới thiệu cho portfolio."}
                    </p>
                    
                    {/* Location/Links */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
                      {item.location && (
                        <span className="text-[10px] text-[#5b526d] flex items-center gap-0.5">
                          <MapPin size={9} /> {item.location}
                        </span>
                      )}
                      {item.website && (
                        <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#5b526d] hover:text-[#c084fc] flex items-center gap-0.5 transition-colors">
                          <Globe size={9} /> Website
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Active theme design card */}
                  <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex items-center gap-3">
                    <div className="w-12 h-9 rounded bg-[#140f26] overflow-hidden border border-white/10 shrink-0">
                      {item.theme?.preview_url ? (
                        <img src={item.theme.preview_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#c084fc]/5 flex items-center justify-center">
                          <Palette size={14} className="text-[#c084fc]/40" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-[#5b526d] uppercase tracking-wider font-mono">Giao diện đang dùng</p>
                      <p className="text-xs font-bold text-white truncate">{item.theme?.name || "Mặc định (Default)"}</p>
                    </div>
                  </div>
                </CardBody>

                {/* Card footer control */}
                <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between gap-3">
                  {item.user ? (
                    <a 
                      href={`https://${item.user.username.toLowerCase()}.lawoh.click`}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[11px] font-bold text-[#9d90b0] hover:text-white flex items-center gap-0.5 transition-colors"
                    >
                      Xem trang <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span className="text-[10px] text-[#5b526d]">Không có liên kết</span>
                  )}
                  
                  <Button
                    size="sm"
                    onClick={() => handleChangeThemeClick(item)}
                    className="bg-[#c084fc]/10 hover:bg-[#c084fc]/20 text-[#c084fc] font-bold rounded-lg text-xs py-1.5 px-3 border border-[#c084fc]/20 transition-all cursor-pointer"
                  >
                    Đổi giao diện
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
          
          {filteredPortfolios.length === 0 && (
            <div className="col-span-full py-16 text-center text-xs text-[#5b526d]">
              Không tìm thấy Portfolio nào phù hợp với bộ lọc tìm kiếm
            </div>
          )}
        </div>
      )}

      {/* Change Theme Modal */}
      <AnimatePresence>
        {isThemeModalOpen && selectedPortfolio && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsThemeModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-2xl bg-[#0d091a] border border-white/10 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col text-left"
            >
              <div className="h-14 border-b border-white/5 flex items-center justify-between px-6">
                <div>
                  <h3 className="font-bold text-white text-sm tracking-wider font-mono uppercase">Thay Đổi Giao Diện</h3>
                  <p className="text-[10px] text-[#9d90b0]">Thay đổi theme mẫu cho tài khoản: <strong className="text-white">{selectedPortfolio.user?.username}</strong></p>
                </div>
                <button onClick={() => setIsThemeModalOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-[#9d90b0] hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[400px]">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {templates?.filter(t => t.is_active).map((tpl) => {
                    const isCurrent = tpl.id === selectedPortfolio.theme_id;
                    return (
                      <div 
                        key={tpl.id}
                        className={`border rounded-xl overflow-hidden bg-white/[0.01] transition-all flex flex-col justify-between ${
                          isCurrent 
                            ? "border-[#c084fc] shadow-[0_0_15px_rgba(192,132,252,0.15)] bg-[#c084fc]/5" 
                            : "border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                        }`}
                      >
                        <div>
                          {/* Template Preview Image */}
                          <div className="aspect-[4/3] bg-[#140f26] overflow-hidden relative border-b border-white/5">
                            {tpl.preview_url ? (
                              <img src={tpl.preview_url} alt={tpl.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#5b526d]">
                                <Palette size={20} />
                              </div>
                            )}
                            {isCurrent && (
                              <div className="absolute top-2 right-2 bg-[#c084fc] text-[#07050f] p-1 rounded-full shadow">
                                <Check size={10} className="stroke-[3]" />
                              </div>
                            )}
                          </div>
                          
                          {/* Template Meta */}
                          <div className="p-3">
                            <h4 className="text-xs font-bold text-white truncate">{tpl.name}</h4>
                            <p className="text-[9px] text-[#5b526d] mt-0.5 capitalize font-mono">{tpl.major || "Chung (Generic)"}</p>
                          </div>
                        </div>

                        {/* Apply button */}
                        <div className="p-3 pt-0">
                          <Button
                            size="sm"
                            disabled={isCurrent || isChangingTheme}
                            onClick={() => handleApplyTheme(tpl.id)}
                            className={`w-full text-xs font-bold py-1.5 rounded-lg transition-all cursor-pointer ${
                              isCurrent 
                                ? "bg-white/5 text-[#5b526d]" 
                                : "bg-[#c084fc] hover:bg-[#b06cf7] text-[#07050f]"
                            }`}
                          >
                            {isCurrent ? "Đang áp dụng" : "Áp dụng"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {templates?.length === 0 && (
                    <div className="col-span-full py-10 text-center text-xs text-[#5b526d]">
                      Không có template nào khả dụng trên hệ thống.
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-white/5 justify-end flex">
                <Button
                  size="sm"
                  onClick={() => setIsThemeModalOpen(false)}
                  className="bg-white/5 border border-white/10 text-white font-semibold rounded-xl text-xs cursor-pointer"
                >
                  Đóng
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
