"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Locale = "vi" | "en";

interface I18nContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations = {
  vi: {
    "nav.home": "Trang chủ",
    "nav.templates": "Kho bản mẫu",
    "nav.contact": "Liên hệ thiết kế",
    "nav.login": "Đăng nhập",
    "nav.register": "Đăng ký",
    "nav.logout": "Đăng xuất",
    "nav.profile": "Hồ sơ cá nhân",
    "nav.editProfile": "Chỉnh sửa thông tin cá nhân",
    "nav.manageProfile": "Quản lí portfolio",
    "nav.orders": "Bản mẫu đã mua",
    "nav.role": "Đăng nhập với tư cách",
    
    "hero.label": "— Portfolio Templates Shop",
    "hero.title": "Giao diện\nKhông giống như\n Lồn",
    "hero.desc": "Bộ sưu tập portfolio chuẩn UI/UX, tối ưu code và SEO, được thiết kế thủ công cho từng ngành nghề cụ thể.",
    "hero.btn.all": "Xem tất cả",
    "hero.btn.custom": "Thiết kế riêng",
    
    "stats.customers": "Khách hàng",
    "stats.templates": "Templates",
    "stats.rating": "Rating",
    "stats.support": "Hỗ trợ",
    
    "cat.all": "All",
    "cat.it": "IT / Dev",
    "cat.designer": "Design",
    "cat.journalist": "Journalist",
    "cat.economics": "Economics",
    
    "tpl.buy": "Mua ngay",
    "tpl.bestSeller": "Bán chạy",
    
    "why.label": "— Tại sao chọn tôi?",
    "why.title1": "Code sạch.",
    "why.title2": "Thiết kế thật.",
    "why.title3": "Không template rác.",
    "why.desc": "Tất cả templates được tôi viết tay từ đầu — không dùng theme mua sẵn, không code rác. Từng pixel được kiểm soát có chủ đích.",
    "why.item1.t": "Mã nguồn tối ưu 100%",
    "why.item1.d": "React / Next.js, không thư viện thừa, build cực nhanh.",
    "why.item2.t": "Responsive & SEO-ready",
    "why.item2.d": "Tương thích mọi thiết bị. Chuẩn Core Web Vitals.",
    "why.item3.t": "Cập nhật trọn đời",
    "why.item3.d": "Mua một lần, nhận update miễn phí mãi mãi.",
    "why.item4.t": "Hỗ trợ deploy miễn phí",
    "why.item4.d": "Tôi hỗ trợ trỏ domain và push lên Vercel / Netlify.",
    
    "cta.title1": "Muốn portfolio",
    "cta.title2": "độc quyền",
    "cta.title3": "cho riêng bạn?",
    "cta.desc": "Không tìm thấy mẫu phù hợp? Tôi nhận thiết kế custom theo yêu cầu — từ ý tưởng đến deploy.",
    "cta.btn.contact": "Liên hệ ngay",
    
    "footer.brand": "Nâng Tầm Thương Hiệu",
    "footer.copyright": "© 2026. Thiết kế & phát triển bởi chủ shop. All rights reserved.",
    "footer.products": "Sản phẩm",
    "footer.company": "Công ty",
    "footer.support": "Hỗ trợ",

    "profile.title": "Chỉnh Sửa Thông Tin Cá Nhân",
    "profile.subTitle": "Cấu hình tài khoản",
    "profile.role.admin": "Tổng Biên Tập",
    "profile.role.user": "Cộng Tác Viên",
    "profile.uptime": "Thời gian hoạt động",
    "profile.systemFeed": "DÒNG DỮ LIỆU HỆ THỐNG",
    "profile.form.username": "Tên hiển thị",
    "profile.form.email": "Địa chỉ email",
    "profile.form.password": "Mật khẩu mới",
    "profile.form.major": "Chuyên ngành",
    "profile.form.roleLabel": "Quyền hạn (Role)",
    "profile.form.btn.save": "Lưu thay đổi",
    "profile.form.btn.cancel": "Hủy bỏ",
    "profile.unauth.title": "Yêu cầu Đăng nhập",
    "profile.unauth.desc": "Bạn cần đăng nhập để truy cập trang cập nhật thông tin cá nhân.",
    "profile.unauth.btn": "Đăng nhập ngay",
    "profile.role.desc.admin": "Có quyền truy cập toàn bộ tài liệu lưu trữ, quyền xuất bản toàn cầu và khả năng soạn thảo bản tuyên ngôn.",
    "profile.role.desc.user": "Có quyền truy cập bản nháp công khai, mua bản mẫu và quản lý chi tiết hồ sơ cá nhân.",
    "profile.major.journalist.title": "Phóng sự điều tra",
    "profile.major.journalist.desc": "Investigative Journalism",
    "profile.major.it.title": "Phát triển phần mềm",
    "profile.major.it.desc": "Software Development / IT",
    "profile.major.designer.title": "Thiết kế sáng tạo",
    "profile.major.designer.desc": "Creative Design",
    "profile.major.economics.title": "Phân tích kinh tế",
    "profile.major.economics.desc": "Economic Analysis",
    "profile.major.other.title": "Ký sự hiện trường / Khác",
    "profile.major.other.desc": "Field Reporting / Other"
  },
  en: {
    "nav.home": "Home",
    "nav.templates": "Templates",
    "nav.contact": "Contact Design",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.logout": "Logout",
    "nav.profile": "Profile",
    "nav.editProfile": "Edit Personal Info",
    "nav.manageProfile": "Manage Portfolio",
    "nav.orders": "Purchased Templates",
    "nav.role": "Logged in as",
    
    "hero.label": "— Portfolio Templates Shop",
    "hero.title": "Templates\n*that don't*\nlook like\ntemplates.",
    "hero.desc": "Curated UI/UX portfolio templates, optimized for speed and SEO, handcrafted for each specific profession.",
    "hero.btn.all": "View All",
    "hero.btn.custom": "Custom Design",
    
    "stats.customers": "Customers",
    "stats.templates": "Templates",
    "stats.rating": "Rating",
    "stats.support": "Support",
    
    "cat.all": "All",
    "cat.it": "IT / Dev",
    "cat.designer": "Design",
    "cat.journalist": "Journalist",
    "cat.economics": "Economics",
    
    "tpl.buy": "Buy Now",
    "tpl.bestSeller": "Best Seller",
    
    "why.label": "— Why choose me?",
    "why.title1": "Clean Code.",
    "why.title2": "Real Design.",
    "why.title3": "No Trash Templates.",
    "why.desc": "All templates are hand-coded from scratch — no pre-bought themes, no junk code. Every single pixel is controlled intentionally.",
    "why.item1.t": "100% Optimized Source Code",
    "why.item1.d": "React / Next.js, no redundant libraries, lightning fast build.",
    "why.item2.t": "Responsive & SEO-ready",
    "why.item2.d": "Compatible with all devices. Standard Core Web Vitals.",
    "why.item3.t": "Lifetime Updates",
    "why.item3.d": "Buy once, receive free updates forever.",
    "why.item4.t": "Free Deployment Support",
    "why.item4.d": "I support custom domains and deployment to Vercel / Netlify.",
    
    "cta.title1": "Want a portfolio",
    "cta.title2": "exclusive",
    "cta.title3": "just for you?",
    "cta.desc": "Can't find a suitable template? I offer custom design services — from concept to deployment.",
    "cta.btn.contact": "Contact Now",
    
    "footer.brand": "Elevating Brands",
    "footer.copyright": "© 2026. Designed & developed by shop owner. All rights reserved.",
    "footer.products": "Products",
    "footer.company": "Company",
    "footer.support": "Support",

    "profile.title": "Edit Profile",
    "profile.subTitle": "Profile Configuration",
    "profile.role.admin": "Chief Editor",
    "profile.role.user": "Contributor",
    "profile.uptime": "System Uptime",
    "profile.systemFeed": "SYSTEM FEED",
    "profile.form.username": "Display Name",
    "profile.form.email": "Email Address",
    "profile.form.password": "New Password",
    "profile.form.major": "Specialty",
    "profile.form.roleLabel": "Permission Role",
    "profile.form.btn.save": "Save Changes",
    "profile.form.btn.cancel": "Cancel",
    "profile.unauth.title": "Login Required",
    "profile.unauth.desc": "You need to log in to access the profile settings page.",
    "profile.unauth.btn": "Login Now",
    "profile.role.desc.admin": "Access to all archives, global publishing rights, and manifesto drafting capabilities.",
    "profile.role.desc.user": "Access to public drafts, purchasing templates, and managing personal profile details.",
    "profile.major.journalist.title": "Investigative Journalism",
    "profile.major.journalist.desc": "Investigative Journalism",
    "profile.major.it.title": "Software Development / IT",
    "profile.major.it.desc": "Software Development / IT",
    "profile.major.designer.title": "Creative Design",
    "profile.major.designer.desc": "Creative Design",
    "profile.major.economics.title": "Economic Analysis",
    "profile.major.economics.desc": "Economic Analysis",
    "profile.major.other.title": "Field Reporting / Other",
    "profile.major.other.desc": "Field Reporting / Other"
  }
};

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("vi");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale;
    if (saved === "vi" || saved === "en") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = (key: string): string => {
    const langData = translations[locale];
    // @ts-ignore
    return langData[key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
