"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  MapPin,
  DollarSign,
  ClipboardList,
  Users,
  LogOut,
  AlignJustify,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Thống kê", icon: BarChart3 },
  { href: "/admin/stadiums", label: "Quản lý sân bóng", icon: MapPin },
  { href: "/admin/price-configs", label: "Cấu hình giá giờ", icon: DollarSign },
  { href: "/admin/bookings", label: "Quản lý đơn đặt", icon: ClipboardList },
  { href: "/admin/user", label: "Quản lý người dùng", icon: Users },
];

export default function Sidebar({ collapsed }: any) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }

  const textClass = `overflow-hidden whitespace-nowrap transition-all duration-200 ease-in-out ${
    collapsed ? "w-0 opacity-0 ml-0" : "w-40 opacity-100 ml-3"
  }`;

  return (
    <div
      className={`flex flex-col h-[calc(100vh-52px)] sticky top-[52px] bg-[#1B1B29]
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-56"}`}
    >
      {/* Logo */}
      <div className="flex items-center px-3 py-5">
        <div className={`${textClass} ml-2`}>
          <p className="text-sm font-bold text-white leading-tight">
            Sân Bóng Hà Nội
          </p>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col flex-1 gap-1 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center px-3 py-2.5 font-semibold
                transition-colors duration-200
                ${
                  isActive
                    ? "bg-[#414147] text-white"
                    : "text-[#939393] hover:bg-[#414147] hover:text-white"
                }`}
            >
              <Icon className="w-4 h-4 shrink-0 ml-1" />
              <span className={textClass}>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center px-3 py-4 font-semibold
                   text-[#939393] hover:bg-[#414147] hover:text-white
                   transition-colors duration-200"
      >
        <LogOut className="w-4 h-4 shrink-0 ml-1" />
        <span className={textClass}>Đăng xuất</span>
      </button>
    </div>
  );
}
