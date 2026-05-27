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
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { useAppSelector, useAppDispatch } from "@/utils/redux";
import { clearLoginToken } from "@/store/slices/auth";
import { useGetMeQuery } from "@/store/queries/auth";
import webStorageClient from "@/utils/webStorageClient";
import ThemeToggle from "@/Provider/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { Sparkles, LogOut, User, ShoppingBag, Mail, Home, Shield, UserCog, Settings } from "lucide-react";
import { useAuthModal } from "@/context/AuthModalContext";
import { useI18n } from "@/context/I18nContext";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticatedAccount, user } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { openLogin, openRegister } = useAuthModal();
  const { t } = useI18n();

  // Gọi /auth/me khi mount để tự động set cờ auth + user vào Redux.
  // Skip nếu chưa có access token (tránh gọi thừa khi chưa login).
  const hasToken = !!webStorageClient.getToken();
  useGetMeQuery(undefined, { skip: !hasToken });

  // Close mobile menu and dropdown on path change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    dispatch(clearLoginToken());
  };

  const navItems = [
    { label: t("nav.home"), href: "/", icon: Home },
    { label: t("nav.templates"), href: "/templates", icon: ShoppingBag },
  ];

  return (
    <HeroNavbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-background/80 backdrop-blur-md border-zinc-200/50 dark:border-zinc-800/50 fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      maxWidth="xl"
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-t-full",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      {/* Brand logo (Animate in from the Left) */}
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="gap-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Link href="/" className="flex items-center gap-2 text-current no-underline hover:opacity-90">
              <div className="p-2 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary animate-pulse">
                <Sparkles size={20} className="stroke-[2.5]" />
              </div>
              <p className="font-bold text-lg md:text-xl tracking-tight bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500 dark:from-violet-400 dark:via-fuchsia-400 dark:to-amber-400 bg-clip-text text-transparent">
               Đen Đen Project
              </p>
            </Link>
          </motion.div>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Menu (Animate in with staggered delay from Top) */}
      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        {navItems.map((item, idx) => {
          const isActive = pathname === item.href;
          return (
            <NavbarItem key={item.href} isActive={isActive}>
              <motion.div
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1, ease: "easeOut" }}
              >
                <Link
                  href={item.href}
                  className={`text-sm font-medium transition-colors py-2 flex items-center gap-1.5 ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary-400"
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              </motion.div>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      {/* Action Buttons (Animate in from the Right) */}
      <NavbarContent justify="end" className="gap-4">
        {/* Language Toggle */}
        <NavbarItem>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          >
            <LanguageToggle />
          </motion.div>
        </NavbarItem>

        {/* Theme Toggle */}
        <NavbarItem>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          >
            <ThemeToggle />
          </motion.div>
        </NavbarItem>

        {/* Custom Order / Contact Button for Desktop */}
        <NavbarItem className="hidden md:flex">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          >
            <Button
              as={Link}
              href="/contact"
              variant="light"
              color="primary"
              startContent={<Mail size={16} />}
              className="font-semibold text-sm rounded-xl"
            >
              {t("nav.contact")}
            </Button>
          </motion.div>
        </NavbarItem>

        {/* Auth section */}
        {isAuthenticatedAccount && user ? (
          <NavbarItem>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
            >
              <Dropdown isOpen={isDropdownOpen} onOpenChange={setIsDropdownOpen} placement="bottom-end" className="bg-background/95 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform ring-primary/50"
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
                >
                  <DropdownItem key="profile" className="h-auto py-3 gap-2 opacity-100 cursor-default">
                    <p className="font-semibold text-xs text-zinc-500 dark:text-zinc-400">{t("nav.role")}</p>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200">{user.username}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
                    <div className="mt-1.5">
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">
                          <Shield size={10} /> Quản trị viên
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 px-2 py-0.5 rounded-full">
                          <User size={10} /> Người dùng
                        </span>
                      )}
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="admin"
                    as={NextLink}
                    href={user.role === "admin" ? "/admin" : ""}
                    startContent={<Shield size={16} className={user.role === "admin" ? "text-amber-500" : "text-transparent"} />}
                    className={user.role === "admin" ? "text-amber-600 dark:text-amber-400 font-semibold" : "hidden"}
                  >
                    Quản lí
                  </DropdownItem>
                  <DropdownItem key="settings" as={NextLink} href="/profile" startContent={<User size={16} />}>
                    {t("nav.profile")}
                  </DropdownItem>
                  <DropdownItem key="edit-profile" as={NextLink} href="/profile/edit" startContent={<UserCog size={16} />}>
                    {t("nav.editProfile")}
                  </DropdownItem>
                  <DropdownItem key="manage-profile" as={NextLink} href="/profile/manage" startContent={<Settings size={16} />}>
                    {t("nav.manageProfile")}
                  </DropdownItem>
                  <DropdownItem key="orders" as={NextLink} href="/my-orders" startContent={<ShoppingBag size={16} />}>
                    {t("nav.orders")}
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    className="text-danger"
                    onPress={handleLogout}
                    startContent={<LogOut size={16} />}
                  >
                    {t("nav.logout")}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </motion.div>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="hidden md:flex">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
              >
                <button
                  onClick={openLogin}
                  className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-primary dark:hover:text-primary-400 transition-colors bg-transparent border-none cursor-pointer"
                >
                  {t("nav.login")}
                </button>
              </motion.div>
            </NavbarItem>
            <NavbarItem>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
              >
                <Button
                  color="primary"
                  onPress={openRegister}
                  variant="flat"
                  className="font-semibold text-sm rounded-xl px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white dark:text-primary-400 dark:hover:text-white transition-all active:scale-95"
                >
                  {t("nav.register")}
                </Button>
              </motion.div>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-background/95 backdrop-blur-md pt-6 gap-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <NavbarMenuItem key={item.href}>
              <Link
                href={item.href}
                className={`w-full py-3 text-lg font-medium border-b border-zinc-100 dark:border-zinc-800/30 flex items-center gap-3 ${
                  isActive
                    ? "text-primary font-bold"
                    : "text-zinc-700 dark:text-zinc-300 hover:text-primary"
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? "bg-primary/15 text-primary" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>
                  <item.icon size={20} />
                </div>
                {item.label}
              </Link>
            </NavbarMenuItem>
          );
        })}
        
        <NavbarMenuItem>
          <Link
            href="/contact"
            className="w-full py-3 text-lg font-medium border-b border-zinc-100 dark:border-zinc-800/30 flex items-center gap-3 text-zinc-700 dark:text-zinc-300"
          >
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
              <Mail size={20} />
            </div>
            {t("nav.contact")}
          </Link>
        </NavbarMenuItem>

        {!isAuthenticatedAccount && (
          <div className="flex flex-col gap-3 mt-6">
            <Button
              onPress={() => { setIsMenuOpen(false); openLogin(); }}
              variant="bordered"
              className="w-full font-semibold border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl"
            >
              {t("nav.login")}
            </Button>
            <Button
              onPress={() => { setIsMenuOpen(false); openRegister(); }}
              color="primary"
              className="w-full font-semibold rounded-xl"
            >
              {t("nav.register")}
            </Button>
          </div>
        )}
      </NavbarMenu>
    </HeroNavbar>
  );
}
