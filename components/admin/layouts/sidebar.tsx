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
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Thống kê", icon: BarChart3 },
  { href: "/admin/stadiums", label: "Quản lý sân bóng", icon: MapPin },
  { href: "/admin/price-configs", label: "Cấu hình giá giờ", icon: DollarSign },
  { href: "/admin/bookings", label: "Quản lý đơn đặt", icon: ClipboardList },
  { href: "/admin/user", label: "Quản lý người dùng", icon: Users },
];

type SidebarProps = {
  collapsed: boolean;
};

export default function Sidebar({ collapsed }: SidebarProps) {
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

  const textClass = `ml-2 overflow-hidden whitespace-nowrap transition-all duration-200 ease-in-out md:ml-3 ${
    collapsed ? "md:w-0 md:opacity-0 md:ml-0" : "md:w-40 md:opacity-100"
  }`;

  return (
    <div
      className={`sticky top-[52px] z-20 flex w-full flex-row overflow-x-auto border-b border-slate-200 bg-white md:pb-16
        transition-all duration-300 ease-in-out md:h-[calc(100vh-52px)] md:flex-col md:overflow-visible md:border-b-0 md:border-r
        ${collapsed ? "md:w-16" : "md:w-56"}`}
    >
      {/* Logo */}
      <div className="hidden items-center px-3 py-5 md:flex">
        <div className={textClass}>
          <p className="text-sm font-bold leading-tight text-slate-950">
            Sân Bóng Hà Nội
          </p>
          <p className="text-xs font-medium text-slate-500">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-row flex-1 gap-1 px-2 py-2 md:flex-col md:px-0 md:py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 items-center px-3 py-2.5 text-sm font-semibold
                transition-colors duration-200
                ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
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
        className="flex shrink-0 items-center px-3 py-2.5 text-sm font-semibold md:py-4
                   text-slate-700 hover:bg-slate-100 hover:text-slate-950
                   transition-colors duration-200"
      >
        <LogOut className="w-4 h-4 shrink-0 ml-1" />
        <span className={textClass}>Đăng xuất</span>
      </button>
    </div>
  );
}
