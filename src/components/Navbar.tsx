"use client";

import React, { useState, useEffect } from "react";
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/utils/redux";
import { clearLoginToken } from "@/store/slices/auth";
import { useGetMeQuery } from "@/store/queries/auth";
import webStorageClient from "@/utils/webStorageClient";
import ThemeToggle from "@/Provider/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { Sparkles, LogOut, User, ShoppingBag, Mail, Home, Shield, Settings } from "lucide-react";
import { useAuthModal } from "@/context/AuthModalContext";
import { useI18n } from "@/context/I18nContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname === "/auth/admin-login") {
    return null;
  }
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticatedAccount, user } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openLogin, openRegister } = useAuthModal();
  const { t } = useI18n();

  const hasToken = !!webStorageClient.getToken();
  useGetMeQuery(undefined, { skip: !hasToken });

  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(clearLoginToken());
  };

  const navItems = [
    { label: t("nav.home"), href: "/", icon: Home },
    { label: t("nav.templates"), href: "/templates", icon: ShoppingBag },
  ];

  return (
    <HeroNavbar
      isBordered={false}
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border-b border-zinc-200/50 dark:border-white/10 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
      maxWidth="xl"
      classNames={{
        wrapper: "px-4 sm:px-6",
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
        ],
      }}
    >
      {/* Brand logo */}
      <NavbarContent justify="start" className="gap-2">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-zinc-700 dark:text-zinc-300"
        />
        <NavbarBrand>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/" className="flex items-center gap-2.5 text-current no-underline group">
              <div className="relative flex items-center justify-center p-1.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/20 group-hover:ring-primary/40 group-hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all duration-300">
                <Sparkles size={16} className="animate-pulse" />
              </div>
              <span className="font-sans text-lg font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/70 transition-all duration-300">
                DenDen
              </span>
            </Link>
          </motion.div>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Menu */}
      <NavbarContent className="hidden sm:flex gap-1" justify="center">
        {navItems.map((item, idx) => {
          const isActive = pathname === item.href;
          return (
            <NavbarItem key={item.href} isActive={isActive}>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={item.href}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 overflow-hidden ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-primary/10 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon size={15} className="relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              </motion.div>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      {/* Action Buttons */}
      <NavbarContent justify="end" className="gap-2 sm:gap-4">
        {/* Utilities Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:flex items-center gap-1 p-1 rounded-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50"
        >
          <LanguageToggle />
          <div className="w-[1px] h-4 bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
          <ThemeToggle />
        </motion.div>

        {/* Mobile Utilities (Just Icons) */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
        </div>

        {/* Auth section */}
        {isAuthenticatedAccount && user ? (
          <NavbarItem>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Dropdown isOpen={isDropdownOpen} onOpenChange={setIsDropdownOpen} placement="bottom-end" className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl rounded-2xl">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform ring-primary/30 hover:ring-primary/60 cursor-pointer"
                    color="primary"
                    name={user.username}
                    size="sm"
                    src={user.images_url || undefined}
                  />
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Profile Actions"
                  variant="flat"
                  disabledKeys={["profile"]}
                  className="p-2"
                  itemClasses={{
                    base: "gap-3 rounded-xl",
                    title: "font-medium text-sm",
                  }}
                  onAction={(key) => {
                    if (key === "admin") {
                      if (user.role === "admin") router.push("/admin");
                    } else if (key === "settings") {
                      router.push("/profile");
                    } else if (key === "manage-profile") {
                      router.push("/manager/portfolio");
                    } else if (key === "orders") {
                      router.push("/my-orders");
                    } else if (key === "logout") {
                      handleLogout();
                    }
                  }}
                >
                  <DropdownItem key="profile" className="h-auto py-3 px-3 gap-2 opacity-100 cursor-default bg-zinc-50 dark:bg-zinc-900/50 rounded-xl mb-2">
                    <p className="font-semibold text-xs text-zinc-500 dark:text-zinc-400 mb-1">{t("nav.role")}</p>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">{user.username}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
                    <div className="mt-2">
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20">
                          <Shield size={10} /> Quản trị viên
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                          <User size={10} /> Người dùng
                        </span>
                      )}
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="admin"
                    startContent={<Shield size={16} className={user.role === "admin" ? "text-amber-500" : "text-transparent"} />}
                    className={user.role === "admin" ? "text-amber-600 dark:text-amber-400 font-semibold" : "hidden"}
                  >
                    Quản lí
                  </DropdownItem>
                  <DropdownItem key="settings" startContent={<User size={16} className="text-zinc-500" />}>
                    {t("nav.profile")}
                  </DropdownItem>
                  <DropdownItem key="manage-profile" startContent={<Settings size={16} className="text-zinc-500" />}>
                    {t("nav.manageProfile")}
                  </DropdownItem>
                  <DropdownItem key="orders" startContent={<ShoppingBag size={16} className="text-zinc-500" />}>
                    {t("nav.orders")}
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    className="text-danger mt-2"
                    startContent={<LogOut size={16} />}
                  >
                    {t("nav.logout")}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </motion.div>
          </NavbarItem>
        ) : (
          <div className="flex items-center gap-2">
            <NavbarItem className="hidden md:flex">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  onClick={openLogin}
                  className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white px-4 py-2 transition-colors bg-transparent border-none cursor-pointer"
                >
                  {t("nav.login")}
                </button>
              </motion.div>
            </NavbarItem>
            <NavbarItem>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Button
                  onPress={openRegister}
                  className="font-semibold text-sm rounded-full px-5 py-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-all active:scale-95 shadow-sm"
                >
                  {t("nav.register")}
                </Button>
              </motion.div>
            </NavbarItem>
          </div>
        )}
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl pt-6 gap-2 border-t border-zinc-200/50 dark:border-zinc-800/50 px-4">
        <div className="flex md:hidden items-center justify-between p-3 rounded-2xl bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 mb-4">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Tùy chỉnh</span>
          <div className="flex items-center gap-2">
            <LanguageToggle />
          </div>
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <NavbarMenuItem key={item.href}>
              <Link
                href={item.href}
                className={`w-full py-3 px-4 rounded-2xl text-base font-medium transition-all flex items-center gap-3 ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                <div className={`p-2 rounded-xl ${isActive ? "bg-primary/20 text-primary" : "bg-zinc-200/50 dark:bg-zinc-800 text-zinc-500"}`}>
                  <item.icon size={18} />
                </div>
                {item.label}
              </Link>
            </NavbarMenuItem>
          );
        })}
        
        <NavbarMenuItem>
          <Link
            href="/contact"
            className="w-full py-3 px-4 rounded-2xl text-base font-medium transition-all flex items-center gap-3 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 mt-1"
          >
            <div className="p-2 rounded-xl bg-zinc-200/50 dark:bg-zinc-800 text-zinc-500">
              <Mail size={18} />
            </div>
            {t("nav.contact")}
          </Link>
        </NavbarMenuItem>

        {!isAuthenticatedAccount && (
          <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <Button
              onPress={() => { setIsMenuOpen(false); openLogin(); }}
              variant="flat"
              className="w-full font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-2xl py-6 text-base"
            >
              {t("nav.login")}
            </Button>
            <Button
              onPress={() => { setIsMenuOpen(false); openRegister(); }}
              className="w-full font-semibold rounded-2xl py-6 text-base bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md"
            >
              {t("nav.register")}
            </Button>
          </div>
        )}
      </NavbarMenu>
    </HeroNavbar>
  );
}

