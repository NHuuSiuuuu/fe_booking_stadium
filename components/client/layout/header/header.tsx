"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, User, X } from "lucide-react";
import {  useState } from "react";

type AuthUser = {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  isAdmin: boolean;
};
type Props = {
  initialUser: AuthUser | null;
};

export default function Header({ initialUser }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(initialUser);

  async function handleLogout() {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    }
    setUser(null);
    setIsMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {/* ==================== THANH NAVBAR CHÍNH ==================== */}
      <nav className="sticky top-0 z-50 bg-[#f1f5f8] border-b border-gray-200">
        <div className="flex items-center justify-between px-4 md:px-10 ">
          {/* ---------- LOGO BÊN TRÁI ---------- */}
          <Link href="/" className="flex items-center gap-2 py-2">
            <Image
              src="/logo.png"
              alt="logo"
              width={60}
              height={60}
              className="w-[22px] h-auto md:w-[60px] object-cover"
              style={{ height: "auto" }}
            />
            <span className="text-gray-900 text-[12px] md:text-[13px] font-black tracking-[0.08em]">
              SânBóng<span className="text-gray-900">HN</span>
            </span>
          </Link>

          {/* ---------- NAV LINKS (CHỈ HIỆN TRÊN DESKTOP) ---------- */}
          {/* Ẩn trên mobile (hidden), hiện từ md trở lên (md:flex) */}
          <div className="items-center hidden md:flex">
            {/* Link Trang chủ */}
            <Link
              href="/"
              className={`flex items-center px-[14px] h-[52px] text-[12px] md:text-[16px] font-bold uppercase  transition-colors  ${
                pathname === "/"
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-500 border-transparent hover:text-gray-900"
              }`}
            >
              Trang chủ
            </Link>

            {/* Link Danh sách sân*/}
            <Link
              href="/stadiums"
              className={`flex items-center px-[14px] h-[52px] text-[12px] md:text-[16px] font-bold uppercase  transition-colors  ${
                pathname === "/stadiums"
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-500 border-transparent hover:text-gray-900"
              }`}
            >
              Danh sách
            </Link>

            {/* Link Bản đồ */}
            <Link
              href="/map"
              className={`flex items-center px-[14px] h-[52px] text-[12px] md:text-[16px] font-bold uppercase  transition-colors  ${
                pathname === "/map"
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-500 border-transparent hover:text-gray-900"
              }`}
            >
              Bản đồ
            </Link>

            {/* Link Đã đặt */}
            <Link
              href="/booked"
              className={`flex items-center px-[14px] h-[52px] text-[12px] md:text-[16px] font-bold uppercase  transition-colors  ${
                pathname === "/booked"
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-500 border-transparent hover:text-gray-900"
              }`}
            >
              Đã đặt
            </Link>

            {/* Link Yêu thích */}
            <Link
              href="/favorite"
              className={`flex items-center px-[14px] h-[52px] text-[12px] md:text-[16px] font-bold uppercase  transition-colors  ${
                pathname === "/favorite"
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-500 border-transparent hover:text-gray-900"
              }`}
            >
              Yêu thích
            </Link>
          </div>

          {/* ---------- PHẦN AUTH (ĐĂNG NHẬP/ĐĂNG XUẤT) ---------- */}
          {/* DESKTOP: hiện từ md trở lên */}
          <div className="items-center hidden gap-3 md:flex">
            {/* Nếu có user thì hiển thị tên + nút logout */}
            {user ? (
              <>
                <Link
                  href="/me"
                  className="text-gray-700 text-[14px] font-semibold hover:text-gray-900 transition-colors"
                >
                  Xin chào, {user.fullname}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-[12px] font-semibold uppercase text-red-500 hover:text-red-900 bg-transparent border-none cursor-pointer transition-colors"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                {/* Chưa đăng nhập thì hiện nút Đăng nhập + Đăng ký */}
                <Link
                  href="/login"
                  className="text-[12px] font-semibold uppercase tracking-[0.1em] 
                  text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="text-[12px] font-semibold uppercase tracking-[0.1em]
                   text-white bg-gray-900 hover:bg-gray-700 px-4 py-1.5 
                   transition-colors"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* ---------- MOBILE BUTTONS (CHỈ HIỆN TRÊN MÀN HÌNH NHỎ) ---------- */}
          {/* Ẩn trên desktop (md:hidden), chỉ hiện khi màn hình < md */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Icon đăng nhập / logout (mobile) */}
            {!user ? (
              <Link href="/login" className="text-gray-700">
                {/* Icon người dùng */}
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="text-red-700"
                aria-label="Đăng xuất"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}

            {/* Nút hamburger để mở menu mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 text-gray-700"
            >
              {isMenuOpen ? (
                /* Icon X (đóng) */
                <X className="w-6 h-6" />
              ) : (
                /* Icon hamburger (3 gạch) */
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ==================== MENU MOBILE (HIỆN KHI isMenuOpen = true) ==================== */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-[52px] left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg">
          <div className="flex flex-col py-2">
            {/* Hiển thị tên user nếu đã đăng nhập */}
            {user && (
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-900">{user.fullname}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            )}

            {/* Link Trang chủ (mobile) */}
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className={`px-4 py-3 text-sm font-medium ${
                pathname === "/"
                  ? "text-gray-900 bg-gray-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Trang chủ
            </Link>

            {/* Link Bản đồ (mobile) */}
            <Link
              href="/map"
              onClick={() => setIsMenuOpen(false)}
              className={`px-4 py-3 text-sm font-medium ${
                pathname === "/map"
                  ? "text-gray-900 bg-gray-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Bản đồ
            </Link>

            {/* Link Đã đặt (mobile) */}
            <Link
              href="/booked"
              onClick={() => setIsMenuOpen(false)}
              className={`px-4 py-3 text-sm font-medium ${
                pathname === "/map"
                  ? "text-gray-900 bg-gray-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Đã đặt
            </Link>

            {/* Link Yêu thích (mobile) */}
            <Link
              href="/favorite"
              onClick={() => setIsMenuOpen(false)}
              className={`px-4 py-3 text-sm font-medium ${
                pathname === "/favorite"
                  ? "text-gray-900 bg-gray-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Yêu thích
            </Link>

            {/* Nếu chưa đăng nhập, hiển thị 2 nút đăng nhập/đăng ký ở mobile */}
            {!user && (
              <div className="px-4 pt-3 pb-2 mt-2 border-t border-gray-100">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-2 mb-2 text-sm font-semibold text-center text-gray-900 border border-gray-300 rounded-sm"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-2 text-sm font-semibold text-center text-white bg-gray-900 rounded-sm"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-3 mt-2 text-sm font-semibold text-left text-red-600 border-t border-gray-100"
              >
                Đăng xuất
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
