"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/utils/redux";
import { useGetMeQuery } from "@/store/queries/auth";
import {
  useGetProfileQuery,
  useUpdateMyPortfolioMutation,
  useChangeMyThemeMutation,
  useGetSkillsQuery,
  useCreateMySkillMutation,
  useUpdateMySkillMutation,
  useDeleteSkillMutation,
  useGetCertificatesQuery,
  useCreateCertMutation,
  useUpdateCertMutation,
  useDeleteCertMutation,
  useGetExperiencesQuery,
  useCreateExpMutation,
  useUpdateExpMutation,
  useDeleteExpMutation,
} from "@/store/queries/profile";
import { useGetAllTemplatesQuery } from "@/store/queries/templates";
import { useAuthModal } from "@/context/AuthModalContext";
import webStorageClient from "@/utils/webStorageClient";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, Shield, User, Briefcase, MapPin, Github, Linkedin, Globe,
  FileText, ExternalLink, Save, X, Palette, Layout, ChevronRight,
  Settings, Eye, Layers, Info, Star, Award, Plus, Trash2,
  Building2, Calendar, Code2,
} from "lucide-react";
import type { Skill, Certificate, Experience, UpsertSkillRequest, UpsertCertRequest, UpsertExpRequest } from "@/types";

// ── Section IDs ───────────────────────────────────────────────────────────────
type SectionId = "portfolio" | "theme" | "skills" | "certificates" | "experience";

const sidebarItems: { id: SectionId; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "portfolio",    label: "Thông tin Portfolio", icon: FileText,  desc: "Title, Bio, Links xã hội" },
  { id: "theme",        label: "Giao diện (Theme)",   icon: Palette,   desc: "Chọn mẫu portfolio" },
  { id: "skills",       label: "Kỹ năng",             icon: Code2,     desc: "Quản lí Skills" },
  { id: "certificates", label: "Chứng chỉ",           icon: Award,     desc: "Quản lí Certificates" },
  { id: "experience",   label: "Kinh nghiệm",         icon: Briefcase, desc: "Quản lí Experiences" },
];

// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_SKILL:   UpsertSkillRequest  = { name: "", level: undefined, category: "" };
const EMPTY_CERT:    UpsertCertRequest   = { name: "", organization: "", issue_date: "", expiration_date: "", credential_id: "", credential_url: "" };
const EMPTY_EXP:     UpsertExpRequest    = { company_name: "", position: "", start_date: "", end_date: "", description: "" };

export default function ManagerPortfolioPage() {
  const router = useRouter();
  const { openLogin } = useAuthModal();
  const { user, isAuthenticatedAccount } = useAppSelector((s) => s.auth);

  const hasToken = typeof window !== "undefined" && !!webStorageClient.getToken();
  const { isFetching } = useGetMeQuery(undefined, { skip: !hasToken });

  const [activeSection, setActiveSection] = useState<SectionId>("portfolio");
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  // ── Fetch data ──
  const { data: profileData, isLoading: profileLoading } = useGetProfileQuery(user?.id ?? "", { skip: !user?.id });
  const { data: templates,   isLoading: templatesLoading } = useGetAllTemplatesQuery();
  const { data: skills,      isLoading: skillsLoading }    = useGetSkillsQuery(user?.id ?? "", { skip: !user?.id });
  const { data: certs,       isLoading: certsLoading }     = useGetCertificatesQuery(user?.id ?? "", { skip: !user?.id });
  const { data: exps,        isLoading: expsLoading }      = useGetExperiencesQuery(user?.id ?? "", { skip: !user?.id });

  // ── Mutations — User ──
  const [updatePortfolio, { isLoading: savingPortfolio }] = useUpdateMyPortfolioMutation();
  const [changeMyTheme,   { isLoading: changingTheme }]   = useChangeMyThemeMutation();
  const [createSkill,     { isLoading: creatingSkill }]   = useCreateMySkillMutation();
  const [updateSkill,     { isLoading: updatingSkill }]   = useUpdateMySkillMutation();
  const [deleteSkill,     { isLoading: deletingSkill }]   = useDeleteSkillMutation();
  const [createCert,      { isLoading: creatingCert }]    = useCreateCertMutation();
  const [updateCert,      { isLoading: updatingCert }]    = useUpdateCertMutation();
  const [deleteCert,      { isLoading: deletingCert }]    = useDeleteCertMutation();
  const [createExp,       { isLoading: creatingExp }]     = useCreateExpMutation();
  const [updateExp,       { isLoading: updatingExp }]     = useUpdateExpMutation();
  const [deleteExp,       { isLoading: deletingExp }]     = useDeleteExpMutation();



  // ── Form: Portfolio ──
  const [title,    setTitle]    = useState("");
  const [bio,      setBio]      = useState("");
  const [github,   setGithub]   = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website,  setWebsite]  = useState("");
  const [location, setLocation] = useState("");

  // ── Form: Theme ──
  const [selectedTheme,      setSelectedTheme]      = useState("");

  // ── Form: Skill ──
  const [skillForm,       setSkillForm]       = useState<UpsertSkillRequest & { id?: string }>(EMPTY_SKILL);
  const [editingSkillId,  setEditingSkillId]  = useState<string | null>(null);


  // ── Form: Certificate ──
  const [certForm,     setCertForm]     = useState<UpsertCertRequest>(EMPTY_CERT);
  const [certImageFile,setCertImageFile] = useState<File | null>(null);
  const [editingCertId,setEditingCertId] = useState<string | null>(null);
  const certImageRef = useRef<HTMLInputElement>(null);

  // ── Form: Experience ──
  const [expForm,     setExpForm]     = useState<UpsertExpRequest>(EMPTY_EXP);
  const [editingExpId,setEditingExpId] = useState<string | null>(null);

  // Populate portfolio from backend
  useEffect(() => {
    if (profileData?.data) {
      const p = profileData.data;
      setTitle(p.title ?? "");
      setBio(p.bio ?? "");
      setGithub(p.github ?? "");
      setLinkedin(p.linkedin ?? "");
      setWebsite(p.website ?? "");
      setLocation(p.location ?? "");
      setSelectedTheme(p.theme_id ?? "");
    }
  }, [profileData]);

  // Auth guard
  useEffect(() => {
    if (!isFetching && !isAuthenticatedAccount && !hasToken) {
      toast.error("Vui lòng đăng nhập!");
      openLogin();
    }
  }, [isAuthenticatedAccount, isFetching, hasToken, openLogin]);

  // ═══ HANDLERS ═══════════════════════════════════════════════════════════════

  // Portfolio
  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePortfolio({ title: title.trim() || undefined, bio: bio.trim() || undefined, github: github.trim() || undefined, linkedin: linkedin.trim() || undefined, website: website.trim() || undefined, location: location.trim() || undefined }).unwrap();
      toast.success("Cập nhật portfolio thành công!");
    } catch (err: any) { toast.error(err?.data?.message || "Lỗi cập nhật portfolio!"); }
  };

  // Theme — User
  const handleChangeMyTheme = async () => {
    if (!selectedTheme) { toast.error("Chọn 1 theme trước!"); return; }
    try { await changeMyTheme({ theme_id: selectedTheme }).unwrap(); toast.success("Đổi theme thành công!"); }
    catch (err: any) { toast.error(err?.data?.message || "Lỗi đổi theme!"); }
  };



  // Skill — User
  const handleUpsertSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name.trim()) { toast.error("Nhập tên skill!"); return; }
    try {
      if (editingSkillId) {
        await updateSkill({
          skillId: editingSkillId,
          body: { name: skillForm.name.trim(), level: skillForm.level, category: skillForm.category?.trim() }
        }).unwrap();
        toast.success("Cập nhật skill!");
      } else {
        await createSkill({
          name: skillForm.name.trim(),
          level: skillForm.level,
          category: skillForm.category?.trim()
        }).unwrap();
        toast.success("Thêm skill mới!");
      }
      setSkillForm(EMPTY_SKILL); setEditingSkillId(null);
    } catch (err: any) { toast.error(err?.data?.message || "Lỗi lưu skill!"); }
  };
  const handleDeleteSkill = async (id: string) => {
    try { await deleteSkill(id).unwrap(); toast.success("Xóa skill thành công!"); }
    catch (err: any) { toast.error(err?.data?.message || "Lỗi xóa skill!"); }
  };



  // Certificate — User
  const handleUpsertCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.name.trim()) { toast.error("Nhập tên chứng chỉ!"); return; }
    const payload: UpsertCertRequest = { ...certForm, id: editingCertId ?? undefined, image: certImageFile ?? undefined };
    try {
      if (editingCertId) { await updateCert(payload).unwrap(); toast.success("Cập nhật chứng chỉ!"); }
      else { await createCert(payload).unwrap(); toast.success("Thêm chứng chỉ mới!"); }
      setCertForm(EMPTY_CERT); setCertImageFile(null); setEditingCertId(null);
    } catch (err: any) { toast.error(err?.data?.message || "Lỗi lưu chứng chỉ!"); }
  };
  const handleDeleteCert = async (id: string) => {
    try { await deleteCert(id).unwrap(); toast.success("Xóa chứng chỉ!"); }
    catch (err: any) { toast.error(err?.data?.message || "Lỗi xóa chứng chỉ!"); }
  };

  // Experience — User
  const handleUpsertExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.company_name.trim() || !expForm.position.trim() || !expForm.start_date) { toast.error("Điền công ty, vị trí và ngày bắt đầu!"); return; }
    const payload: UpsertExpRequest = { ...expForm, id: editingExpId ?? undefined };
    try {
      if (editingExpId) { await updateExp(payload).unwrap(); toast.success("Cập nhật kinh nghiệm!"); }
      else { await createExp(payload).unwrap(); toast.success("Thêm kinh nghiệm mới!"); }
      setExpForm(EMPTY_EXP); setEditingExpId(null);
    } catch (err: any) { toast.error(err?.data?.message || "Lỗi lưu kinh nghiệm!"); }
  };
  const handleDeleteExp = async (id: string) => {
    try { await deleteExp(id).unwrap(); toast.success("Xóa kinh nghiệm!"); }
    catch (err: any) { toast.error(err?.data?.message || "Lỗi xóa kinh nghiệm!"); }
  };

  // ─────────────────────────────────────────────────────────────────────────
  if (!isMounted || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fef7ff] dark:bg-[#0b0912]">
        <Loader2 className="animate-spin text-[#630ed4] dark:text-[#c084fc] w-10 h-10" />
      </div>
    );
  }
  if (!isAuthenticatedAccount) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#fef7ff] dark:bg-[#0b0912]">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm w-full bg-white/40 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl text-center">
          <Shield size={36} className="text-[#630ed4] dark:text-[#c084fc] mx-auto mb-4" />
          <h2 className="text-lg font-bold mb-2">Yêu cầu đăng nhập</h2>
          <button onClick={openLogin} className="mt-4 w-full bg-[#630ed4] text-white font-semibold py-2.5 rounded-lg">Đăng nhập ngay</button>
        </motion.div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#faf7ff] dark:bg-[#0b0912] text-[#1d1a24] dark:text-[#e8e0f0] transition-colors duration-300">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;600;700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap');
        :root {
          --pm: #630ed4; --pmg: rgba(99,14,212,.22); --pmb: rgba(3,8,13,.08);
          --pmc: rgba(255,255,255,.65); --pms: rgba(255,255,255,.88);
        }
        .dark { --pm: #c084fc; --pmg: rgba(192,132,252,.18); --pmb: rgba(255,255,255,.08); --pmc: rgba(22,20,38,.6); --pms: rgba(15,13,30,.9); }
        .pm-sidebar { background:var(--pms); border-right:1px solid var(--pmb); backdrop-filter:blur(14px); }
        .pm-card    { background:var(--pmc); border:1px solid var(--pmb); backdrop-filter:blur(8px); }
        .pm-input   { width:100%; background:rgba(255,255,255,.25); border:1.5px solid var(--pmb); border-radius:8px; padding:9px 13px; font-family:'Source Serif 4',serif; color:inherit; outline:none; font-size:.88rem; transition:border-color .25s,box-shadow .25s; }
        .dark .pm-input { background:rgba(255,255,255,.04); }
        .pm-input:focus { border-color:var(--pm); box-shadow:0 0 0 3px var(--pmg); }
        .pm-label   { font-family:'Bricolage Grotesque',sans-serif; font-weight:600; font-size:.72rem; text-transform:uppercase; letter-spacing:.08em; color:#6b6378; display:flex; align-items:center; gap:5px; margin-bottom:5px; }
        .dark .pm-label { color:#9d90b0; }
        .pm-btn     { display:inline-flex; align-items:center; gap:6px; padding:10px 22px; border-radius:8px; font-family:'Bricolage Grotesque',sans-serif; font-weight:700; font-size:.85rem; cursor:pointer; transition:all .22s; border:none; }
        .pm-p       { background:var(--pm); color:#fff; box-shadow:0 4px 14px var(--pmg); }
        .pm-p:hover:not(:disabled) { filter:brightness(1.08); transform:translateY(-1px); }
        .pm-p:disabled  { opacity:.5; cursor:not-allowed; }
        .pm-g       { background:transparent; border:1.5px solid var(--pmb); color:inherit; }
        .pm-g:hover { background:rgba(99,14,212,.05); border-color:var(--pm); }
        .pm-d       { background:transparent; border:1.5px solid rgba(239,68,68,.3); color:#ef4444; }
        .pm-d:hover:not(:disabled) { background:rgba(239,68,68,.06); }
        .pm-d:disabled { opacity:.45; cursor:not-allowed; }
        .si { display:flex; align-items:center; gap:10px; padding:9px 13px; border-radius:10px; cursor:pointer; transition:all .18s; font-family:'Bricolage Grotesque',sans-serif; font-weight:500; font-size:.85rem; color:#6b6378; user-select:none; }
        .dark .si { color:#9d90b0; }
        .si:hover { background:rgba(99,14,212,.07); color:var(--pm); }
        .si.act   { background:rgba(99,14,212,.1); color:var(--pm); font-weight:700; }
        .dark .si:hover, .dark .si.act { background:rgba(192,132,252,.1); }
        .tc { border:2px solid var(--pmb); border-radius:12px; overflow:hidden; cursor:pointer; transition:all .22s; background:var(--pmc); }
        .tc:hover   { border-color:var(--pm); transform:translateY(-2px); box-shadow:0 8px 20px var(--pmg); }
        .tc.sel     { border-color:var(--pm); box-shadow:0 0 0 3px var(--pmg); }
        .row-card   { display:flex; align-items:flex-start; gap:12px; padding:14px 16px; border-radius:12px; border:1px solid var(--pmb); background:var(--pmc); }
      `}</style>

      <div className="fixed z-0 w-96 h-96 rounded-full pointer-events-none opacity-[0.05] bg-[#7c3aed] -top-24 -right-24 blur-[100px]" />
      <div className="fixed z-0 w-80 h-80 rounded-full pointer-events-none opacity-[0.04] bg-[#a200ba] bottom-0 -left-16 blur-[100px]" />

      <div className="relative z-10 flex min-h-screen pt-16">

        {/* ═══ SIDEBAR ═══════════════════════════════════════════════════════ */}
        <aside className="pm-sidebar hidden lg:flex flex-col w-64 xl:w-72 fixed top-16 left-0 bottom-0 z-30 px-3 py-5 gap-1 overflow-y-auto">
          {/* User card */}
          <div className="flex items-center gap-3 px-2 pb-4 mb-2 border-b border-[var(--pmb)]">
            <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-[var(--pm)]/30 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
              {user?.images_url ? <img src={user.images_url} alt={user.username} className="w-full h-full object-cover" /> : <User size={18} className="text-zinc-400" />}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-[#030813] dark:text-white truncate" style={{ fontFamily:"'Bricolage Grotesque',sans-serif" }}>{user?.username}</p>
            </div>
          </div>
          <p className="px-2 text-[10px] font-bold uppercase tracking-[.15em] text-zinc-400 mb-1">Portfolio Manager</p>
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setActiveSection(item.id)} className={`si ${activeSection === item.id ? "act" : ""}`}>
              <item.icon size={15} className="shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {activeSection === item.id && <ChevronRight size={13} className="opacity-50" />}
            </button>
          ))}
          <div className="mt-auto pt-4 border-t border-[var(--pmb)]">
            <button onClick={() => router.back()} className="si w-full"><X size={15} /><span>Quay lại</span></button>
          </div>
        </aside>

        {/* ═══ MAIN ══════════════════════════════════════════════════════════ */}
        <main className="flex-1 lg:ml-64 xl:ml-72 px-4 sm:px-8 py-8">
          {/* Mobile tabs */}
          <div className="flex gap-2 mb-5 lg:hidden overflow-x-auto no-scrollbar pb-1">
            {sidebarItems.map(item => (
              <button key={item.id} onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border transition-all
                  ${activeSection === item.id ? "bg-[var(--pm)] text-white border-[var(--pm)]" : "border-[var(--pmb)] text-zinc-500 hover:border-[var(--pm)] hover:text-[var(--pm)]"}`}>
                <item.icon size={13} />{item.label}
              </button>
            ))}
          </div>

          {/* Header */}
          <AnimatePresence mode="wait">
            <motion.div key={activeSection + "-header"} initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.35 }} className="mb-6">
              {(() => { const s = sidebarItems.find(x => x.id === activeSection)!; return (
                <><div className="flex items-center gap-2 mb-0.5"><s.icon size={19} className="text-[var(--pm)]" /><h1 className="text-xl font-black text-[#030813] dark:text-white" style={{ fontFamily:"'Bricolage Grotesque',sans-serif" }}>{s.label}</h1></div>
                <p className="text-xs text-zinc-400">{s.desc}</p>
                <div className="w-full h-px bg-gradient-to-r from-[var(--pm)]/30 via-transparent to-transparent mt-4" /></>
              ); })()}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">

            {/* ══════════════════════════════════════════════ PORTFOLIO */}
            {activeSection === "portfolio" && (
              <motion.div key="portfolio" initial={{ opacity:0, x:14 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-14 }} transition={{ duration:.28 }}>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 max-w-4xl">
                  <form onSubmit={handleSavePortfolio} className="xl:col-span-2">
                    <div className="pm-card rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className="pm-label"><Briefcase size={11}/>Tiêu đề</label><input className="pm-input" placeholder="Full-stack Developer" value={title} onChange={e=>setTitle(e.target.value)}/></div>
                        <div><label className="pm-label"><MapPin size={11}/>Địa điểm</label><input className="pm-input" placeholder="Hà Nội, Việt Nam" value={location} onChange={e=>setLocation(e.target.value)}/></div>
                        <div><label className="pm-label"><Github size={11}/>GitHub</label><input className="pm-input" type="url" placeholder="https://github.com/..." value={github} onChange={e=>setGithub(e.target.value)}/></div>
                        <div><label className="pm-label"><Linkedin size={11}/>LinkedIn</label><input className="pm-input" type="url" placeholder="https://linkedin.com/in/..." value={linkedin} onChange={e=>setLinkedin(e.target.value)}/></div>
                        <div className="sm:col-span-2"><label className="pm-label"><Globe size={11}/>Website</label><input className="pm-input" type="url" placeholder="https://yoursite.com" value={website} onChange={e=>setWebsite(e.target.value)}/></div>
                      </div>
                      <div><label className="pm-label"><FileText size={11}/>Bio</label><textarea className="pm-input resize-none" rows={4} placeholder="Viết vài câu giới thiệu..." value={bio} onChange={e=>setBio(e.target.value)}/></div>
                      <div className="flex gap-3 pt-2 border-t border-[var(--pmb)]">
                        <button type="submit" disabled={savingPortfolio} className="pm-btn pm-p">{savingPortfolio?<Loader2 size={15} className="animate-spin"/>:<Save size={15}/>}{savingPortfolio?"Đang lưu...":"Lưu thay đổi"}</button>
                        <button type="button" onClick={()=>router.back()} className="pm-btn pm-g"><X size={15}/>Hủy</button>
                      </div>
                    </div>
                  </form>
                  {/* Preview */}
                  <div className="pm-card rounded-2xl p-4 shadow-sm h-fit sticky top-24">
                    <p className="pm-label mb-3"><Eye size={11}/>Preview</p>
                    {profileLoading ? <Loader2 className="animate-spin text-[var(--pm)] mx-auto my-6" size={18}/> : (
                      <div className="space-y-2.5 text-sm">
                        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[var(--pm)]/30 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                          {user?.images_url?<img src={user.images_url} alt="" className="w-full h-full object-cover"/>:<User size={18} className="text-zinc-400"/>}
                        </div>
                        <div><p className="font-bold text-xs">{user?.username}</p>{title&&<p className="text-[11px] text-[var(--pm)]">{title}</p>}{location&&<p className="text-[11px] text-zinc-400 flex items-center gap-1"><MapPin size={9}/>{location}</p>}</div>
                        {bio&&<p className="text-[11px] text-zinc-500 leading-relaxed border-t border-[var(--pmb)] pt-2">{bio}</p>}
                        {(github||linkedin||website)&&<div className="flex flex-wrap gap-2 border-t border-[var(--pmb)] pt-2">{github&&<a href={github} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[var(--pm)] flex items-center gap-0.5 hover:underline"><Github size={10}/>GitHub</a>}{linkedin&&<a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[var(--pm)] flex items-center gap-0.5 hover:underline"><Linkedin size={10}/>LI</a>}{website&&<a href={website} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[var(--pm)] flex items-center gap-0.5 hover:underline"><Globe size={10}/>Site</a>}</div>}
                        {!title&&!bio&&!location&&<p className="text-[11px] text-zinc-400 italic">Điền form để xem preview.</p>}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════ THEME */}
            {activeSection === "theme" && (
              <motion.div key="theme" initial={{ opacity:0, x:14 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-14 }} transition={{ duration:.28 }}>
                <div className="space-y-5 max-w-4xl">
                  <div className="pm-card rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <p className="pm-label"><Layout size={11}/>Chọn mẫu giao diện</p>
                      {selectedTheme&&<span className="text-[10px] font-mono text-[var(--pm)] bg-[var(--pm)]/10 px-2 py-0.5 rounded-full">Selected: {selectedTheme.slice(0,8)}…</span>}
                    </div>
                    {templatesLoading ? <div className="flex items-center justify-center py-10 gap-2"><Loader2 className="animate-spin text-[var(--pm)]" size={20}/><span className="text-sm text-zinc-400">Đang tải theme...</span></div>
                      : templates&&templates.length>0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {templates.map(t=>(
                            <button key={t.id} onClick={()=>setSelectedTheme(t.id)} className={`tc text-left ${selectedTheme===t.id?"sel":""}`}>
                              <div className="aspect-[4/3] bg-gradient-to-br from-[var(--pm)]/10 to-purple-200/20 dark:to-purple-900/20 flex items-center justify-center relative overflow-hidden">
                                {t.preview_url?<img src={t.preview_url} alt={t.name} className="w-full h-full object-cover"/>:<Layers size={24} className="text-[var(--pm)]/40"/>}
                                {selectedTheme===t.id&&<div className="absolute inset-0 bg-[var(--pm)]/15 flex items-center justify-center"><div className="w-6 h-6 rounded-full bg-[var(--pm)] flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div></div>}
                              </div>
                              <div className="p-2.5"><p className="text-[11px] font-bold truncate">{t.name}</p>{t.major&&<p className="text-[9px] text-zinc-400 capitalize">{t.major}</p>}{!t.is_active&&<p className="text-[9px] text-red-400 font-bold">Inactive</p>}</div>
                            </button>
                          ))}
                        </div>
                      ) : <div className="flex flex-col items-center justify-center py-10 gap-2"><Info size={28} className="text-zinc-300 dark:text-zinc-600"/><p className="text-sm text-zinc-400">Chưa có theme nào.</p></div>}
                  </div>
                  {/* User apply */}
                  <div className="pm-card rounded-2xl p-5 shadow-sm">
                    <p className="pm-label mb-3"><Settings size={11}/>Áp dụng cho tôi</p>
                    <button onClick={handleChangeMyTheme} disabled={changingTheme||!selectedTheme} className="pm-btn pm-p">
                      {changingTheme?<Loader2 size={15} className="animate-spin"/>:<Palette size={15}/>}{changingTheme?"Đang đổi...":"Áp dụng theme"}
                    </button>
                  </div>

                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════ SKILLS */}
            {activeSection === "skills" && (
              <motion.div key="skills" initial={{ opacity:0, x:14 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-14 }} transition={{ duration:.28 }}>
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 max-w-4xl">
                  {/* Form */}
                  <div className="xl:col-span-2 space-y-4">
                    <form onSubmit={handleUpsertSkill}>
                      <div className="pm-card rounded-2xl p-5 shadow-sm space-y-3">
                        <p className="pm-label"><Code2 size={11}/>{editingSkillId?"Sửa":"Thêm"} Skill</p>
                        <div><label className="pm-label">Tên skill *</label><input className="pm-input" placeholder="VD: React, Node.js, Python..." value={skillForm.name} onChange={e=>setSkillForm(f=>({...f,name:e.target.value}))}/></div>
                        <div><label className="pm-label">Mức độ (0–100)</label><input className="pm-input" type="number" min={0} max={100} placeholder="80" value={skillForm.level??""} onChange={e=>setSkillForm(f=>({...f,level:e.target.value?Number(e.target.value):undefined}))}/></div>
                        <div><label className="pm-label">Danh mục</label><input className="pm-input" placeholder="VD: Frontend, Backend, DevOps..." value={skillForm.category??""} onChange={e=>setSkillForm(f=>({...f,category:e.target.value}))}/></div>
                        <div className="flex gap-2 pt-1">
                          <button type="submit" disabled={creatingSkill || updatingSkill} className="pm-btn pm-p flex-1 justify-center">{(creatingSkill || updatingSkill)?<Loader2 size={14} className="animate-spin"/>:<Save size={14}/>}{(creatingSkill || updatingSkill)?"Đang lưu...":"Lưu"}</button>
                          {editingSkillId&&<button type="button" onClick={()=>{setSkillForm(EMPTY_SKILL);setEditingSkillId(null);}} className="pm-btn pm-g"><X size={14}/></button>}
                        </div>
                      </div>
                    </form>

                  </div>
                  {/* Skills list */}
                  <div className="xl:col-span-3 space-y-2">
                    <p className="pm-label"><Star size={11}/>Danh sách ({skills?.length??0})</p>
                    {skillsLoading ? <Loader2 className="animate-spin text-[var(--pm)] mx-auto my-8" size={20}/> : skills&&skills.length>0 ? skills.map((sk:Skill)=>(
                      <div key={sk.id} className="row-card">
                        <div className="w-9 h-9 rounded-lg bg-[var(--pm)]/10 flex items-center justify-center shrink-0"><Code2 size={16} className="text-[var(--pm)]"/></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm">{sk.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            {sk.level!=null&&<div className="flex items-center gap-1.5 flex-1 max-w-[120px]"><div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden"><div className="h-full bg-[var(--pm)] rounded-full" style={{width:`${sk.level}%`}}/></div><span className="text-[10px] text-zinc-400">{sk.level}%</span></div>}
                            {sk.category&&<span className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{sk.category}</span>}
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={()=>{setSkillForm({name:sk.name,level:sk.level??undefined,category:sk.category??""});setEditingSkillId(sk.id);}} className="pm-btn pm-g p-2"><Settings size={13}/></button>
                          <button onClick={()=>handleDeleteSkill(sk.id)} disabled={deletingSkill} className="pm-btn pm-d p-2"><Trash2 size={13}/></button>
                        </div>
                      </div>
                    )) : <div className="flex flex-col items-center justify-center py-10 text-center"><Code2 size={28} className="text-zinc-300 dark:text-zinc-600 mb-2"/><p className="text-sm text-zinc-400">Chưa có skill. Thêm skill đầu tiên!</p></div>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════ CERTIFICATES */}
            {activeSection === "certificates" && (
              <motion.div key="certificates" initial={{ opacity:0, x:14 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-14 }} transition={{ duration:.28 }}>
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 max-w-4xl">
                  <form onSubmit={handleUpsertCert} className="xl:col-span-2">
                    <div className="pm-card rounded-2xl p-5 shadow-sm space-y-3">
                      <p className="pm-label"><Award size={11}/>{editingCertId?"Sửa":"Thêm"} Chứng chỉ</p>
                      <div><label className="pm-label">Tên chứng chỉ *</label><input className="pm-input" placeholder="AWS Certified..." value={certForm.name} onChange={e=>setCertForm(f=>({...f,name:e.target.value}))}/></div>
                      <div><label className="pm-label">Tổ chức cấp</label><input className="pm-input" placeholder="Amazon Web Services" value={certForm.organization??""} onChange={e=>setCertForm(f=>({...f,organization:e.target.value}))}/></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><label className="pm-label"><Calendar size={10}/>Ngày cấp</label><input className="pm-input" type="date" value={certForm.issue_date??""} onChange={e=>setCertForm(f=>({...f,issue_date:e.target.value}))}/></div>
                        <div><label className="pm-label"><Calendar size={10}/>Hết hạn</label><input className="pm-input" type="date" value={certForm.expiration_date??""} onChange={e=>setCertForm(f=>({...f,expiration_date:e.target.value}))}/></div>
                      </div>
                      <div><label className="pm-label">Credential ID</label><input className="pm-input" placeholder="ABC123" value={certForm.credential_id??""} onChange={e=>setCertForm(f=>({...f,credential_id:e.target.value}))}/></div>
                      <div><label className="pm-label">Credential URL</label><input className="pm-input" type="url" placeholder="https://credly.com/..." value={certForm.credential_url??""} onChange={e=>setCertForm(f=>({...f,credential_url:e.target.value}))}/></div>
                      <div>
                        <label className="pm-label">Ảnh chứng chỉ</label>
                        <input ref={certImageRef} type="file" accept="image/*" className="hidden" onChange={e=>setCertImageFile(e.target.files?.[0]??null)}/>
                        <button type="button" onClick={()=>certImageRef.current?.click()} className="pm-btn pm-g text-xs py-2 px-3">
                          <Plus size={13}/>{certImageFile?certImageFile.name:"Chọn ảnh"}
                        </button>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button type="submit" disabled={creatingCert||updatingCert} className="pm-btn pm-p flex-1 justify-center">{(creatingCert||updatingCert)?<Loader2 size={14} className="animate-spin"/>:<Save size={14}/>}Lưu</button>
                        {editingCertId&&<button type="button" onClick={()=>{setCertForm(EMPTY_CERT);setCertImageFile(null);setEditingCertId(null);}} className="pm-btn pm-g"><X size={14}/></button>}
                      </div>
                    </div>
                  </form>
                  {/* Cert list */}
                  <div className="xl:col-span-3 space-y-2">
                    <p className="pm-label"><Award size={11}/>Danh sách ({certs?.length??0})</p>
                    {certsLoading ? <Loader2 className="animate-spin text-[var(--pm)] mx-auto my-8" size={20}/> : certs&&certs.length>0 ? certs.map((c:Certificate)=>(
                      <div key={c.id} className="row-card">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-[var(--pm)]/10 flex items-center justify-center shrink-0">
                          {c.image_url?<img src={c.image_url} alt={c.name} className="w-full h-full object-cover"/>:<Award size={16} className="text-[var(--pm)]"/>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{c.name}</p>
                          <p className="text-xs text-zinc-400 truncate">{c.organization??""}{c.issue_date&&` · ${c.issue_date.slice(0,7)}`}</p>
                          {c.credential_url&&<a href={c.credential_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[var(--pm)] flex items-center gap-0.5 hover:underline"><ExternalLink size={9}/>Xem chứng chỉ</a>}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={()=>{setCertForm({name:c.name,organization:c.organization??"",issue_date:c.issue_date??"",expiration_date:c.expiration_date??"",credential_id:c.credential_id??"",credential_url:c.credential_url??""});setEditingCertId(c.id);}} className="pm-btn pm-g p-2"><Settings size={13}/></button>
                          <button onClick={()=>handleDeleteCert(c.id)} disabled={deletingCert} className="pm-btn pm-d p-2"><Trash2 size={13}/></button>
                        </div>
                      </div>
                    )) : <div className="flex flex-col items-center justify-center py-10 text-center"><Award size={28} className="text-zinc-300 dark:text-zinc-600 mb-2"/><p className="text-sm text-zinc-400">Chưa có chứng chỉ nào.</p></div>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════ EXPERIENCE */}
            {activeSection === "experience" && (
              <motion.div key="experience" initial={{ opacity:0, x:14 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-14 }} transition={{ duration:.28 }}>
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 max-w-4xl">
                  <form onSubmit={handleUpsertExp} className="xl:col-span-2">
                    <div className="pm-card rounded-2xl p-5 shadow-sm space-y-3">
                      <p className="pm-label"><Briefcase size={11}/>{editingExpId?"Sửa":"Thêm"} Kinh nghiệm</p>
                      <div><label className="pm-label">Công ty *</label><input className="pm-input" placeholder="FPT Software" value={expForm.company_name} onChange={e=>setExpForm(f=>({...f,company_name:e.target.value}))}/></div>
                      <div><label className="pm-label">Vị trí *</label><input className="pm-input" placeholder="Senior Backend Developer" value={expForm.position} onChange={e=>setExpForm(f=>({...f,position:e.target.value}))}/></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><label className="pm-label"><Calendar size={10}/>Ngày bắt đầu *</label><input className="pm-input" type="date" value={expForm.start_date} onChange={e=>setExpForm(f=>({...f,start_date:e.target.value}))}/></div>
                        <div><label className="pm-label"><Calendar size={10}/>Ngày kết thúc</label><input className="pm-input" type="date" value={expForm.end_date??""} onChange={e=>setExpForm(f=>({...f,end_date:e.target.value||undefined}))}/></div>
                      </div>
                      <div><label className="pm-label">Mô tả</label><textarea className="pm-input resize-none" rows={3} placeholder="Mô tả công việc và thành tựu..." value={expForm.description??""} onChange={e=>setExpForm(f=>({...f,description:e.target.value}))}/></div>
                      <div className="flex gap-2 pt-1">
                        <button type="submit" disabled={creatingExp||updatingExp} className="pm-btn pm-p flex-1 justify-center">{(creatingExp||updatingExp)?<Loader2 size={14} className="animate-spin"/>:<Save size={14}/>}Lưu</button>
                        {editingExpId&&<button type="button" onClick={()=>{setExpForm(EMPTY_EXP);setEditingExpId(null);}} className="pm-btn pm-g"><X size={14}/></button>}
                      </div>
                    </div>
                  </form>
                  {/* Exp list */}
                  <div className="xl:col-span-3 space-y-2">
                    <p className="pm-label"><Building2 size={11}/>Danh sách ({exps?.length??0})</p>
                    {expsLoading ? <Loader2 className="animate-spin text-[var(--pm)] mx-auto my-8" size={20}/> : exps&&exps.length>0 ? exps.map((ex:Experience)=>(
                      <div key={ex.id} className="row-card">
                        <div className="w-9 h-9 rounded-lg bg-[var(--pm)]/10 flex items-center justify-center shrink-0"><Building2 size={16} className="text-[var(--pm)]"/></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{ex.position}</p>
                          <p className="text-xs text-zinc-500 truncate">{ex.company_name}</p>
                          <p className="text-[10px] text-zinc-400">{ex.start_date?.slice(0,7)} — {ex.end_date?ex.end_date.slice(0,7):"Hiện tại"}</p>
                          {ex.description&&<p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{ex.description}</p>}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={()=>{setExpForm({company_name:ex.company_name,position:ex.position,start_date:ex.start_date?.slice(0,10)??"",end_date:ex.end_date?.slice(0,10)??"",description:ex.description??""});setEditingExpId(ex.id);}} className="pm-btn pm-g p-2"><Settings size={13}/></button>
                          <button onClick={()=>handleDeleteExp(ex.id)} disabled={deletingExp} className="pm-btn pm-d p-2"><Trash2 size={13}/></button>
                        </div>
                      </div>
                    )) : <div className="flex flex-col items-center justify-center py-10 text-center"><Briefcase size={28} className="text-zinc-300 dark:text-zinc-600 mb-2"/><p className="text-sm text-zinc-400">Chưa có kinh nghiệm nào.</p></div>}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
