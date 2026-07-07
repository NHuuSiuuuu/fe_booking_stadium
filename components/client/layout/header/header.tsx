"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, User, X } from "lucide-react";
import { useState } from "react";

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
      <nav className="sticky top-0 z-50 bg-[#001A2D]">
        <div className="flex items-center justify-between px-4 md:px-10 ">
          {/* ---------- LOGO BÊN TRÁI ---------- */}
          <Link href="/" className="flex items-center gap-2 py-2">
            <Image
              src="/logoo.png"
              alt="logo"
              width={60}
              height={60}
              className="w-[22px] h-auto md:w-[60px]  object-cover"
              style={{ height: "auto" }}
            />
          </Link>

          {/* ---------- NAV LINKS (CHỈ HIỆN TRÊN DESKTOP) ---------- */}
          {/* Ẩn trên mobile (hidden), hiện từ md trở lên (md:flex) */}
          <div className="items-center hidden md:flex">
            {/* Link Trang chủ */}

            <Link
              href="/"
              className={`flex items-center text-white px-[14px] h-[52px] text-[12px] md:text-[16px] font-semibold uppercase  transition-colors  `}
            >
              <p className="relative after:absolute after:left-0 after:-bottom-1 after:h-[3px] after:w-0  after:bg-white after:transition-all after:duration-300 hover:after:w-full">
                Trang chủ
              </p>
            </Link>

            {/* Link Danh sách sân*/}
            <Link
              href="/stadiums"
              className={`flex items-center text-white px-[14px] h-[52px] text-[12px] md:text-[16px] font-semibold uppercase  transition-colors  `}
            >
              <p className="relative after:absolute after:left-0 after:-bottom-1 after:h-[3px] after:w-0  after:bg-white after:transition-all after:duration-300 hover:after:w-full">
                Danh sách
              </p>
            </Link>

            {/* Link Bản đồ */}
            <Link
              href="/map"
              className={`flex items-center text-white px-[14px] h-[52px] text-[12px] md:text-[16px] font-semibold uppercase  transition-colors  `}
            >
              <p className="relative after:absolute after:left-0 after:-bottom-1 after:h-[3px] after:w-0  after:bg-white after:transition-all after:duration-300 hover:after:w-full">
                Bản đồ
              </p>
            </Link>

            {/* Link Đã đặt */}
            <Link
              href="/booked"
              className={`flex items-center text-white px-[14px] h-[52px] text-[12px] md:text-[16px] font-semibold uppercase  transition-colors  `}
            >
              <p className="relative after:absolute after:left-0 after:-bottom-1 after:h-[3px] after:w-0  after:bg-white after:transition-all after:duration-300 hover:after:w-full">
                Đã đặt
              </p>
            </Link>

            {/* Link Yêu thích */}
            <Link
              href="/favorite"
              className={`flex items-center text-white px-[14px] h-[52px] text-[12px] md:text-[16px] font-semibold uppercase  transition-colors `}
            >
              <p className="relative after:absolute after:left-0 after:-bottom-1 after:h-[3px] after:w-0  after:bg-white after:transition-all after:duration-300 hover:after:w-full">
                Yêu thích
              </p>
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
                  className="text-[14px] font-semibold text-white "
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
                  className="text-[12px] font-semibold uppercase  
                  text-white "
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="text-[12px] font-semibold uppercase 
                   text-[#1b1b1b]  bg-white hover:bg-gray-200 px-4 py-1.5 
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
              <></>
            )}

            {/* Nút hamburger để mở menu mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 text-white"
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
              <div className="px-4 py-3 border-b ">
                <p className="font-semibold text-[#1b1b1b]">{user.fullname}</p>
                <p className="text-xs text-[#1b1b1b]">{user.email}</p>
              </div>
            )}

            {/* Link Trang chủ (mobile) */}
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className={`px-4 text-[#1b1b1b] py-3 text-sm font-medium border-b`}
            >
              Trang chủ
            </Link>

            {/* Link Bản đồ (mobile) */}
            <Link
              href="/map"
              onClick={() => setIsMenuOpen(false)}
              className={`px-4 text-[#1b1b1b] py-3 text-sm font-medium border-b `}
            >
              Bản đồ
            </Link>

            {/* Link Đã đặt (mobile) */}
            <Link
              href="/booked"
              onClick={() => setIsMenuOpen(false)}
              className={`px-4 text-[#1b1b1b] py-3 text-sm font-medium border-b `}
            >
              Đã đặt
            </Link>

            {/* Link Yêu thích (mobile) */}
            <Link
              href="/favorite"
              onClick={() => setIsMenuOpen(false)}
              className={`px-4 text-[#1b1b1b] py-3 text-sm font-medium border-b `}
            >
              Yêu thích
            </Link>

            {/* Nếu chưa đăng nhập, hiển thị 2 nút đăng nhập/đăng ký ở mobile */}
            {!user && (
              <div className="px-4 pt-3 pb-2 mt-2 border-t ">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-2 mb-2 text-sm font-semibold text-center text-white border border-gray-300 rounded-sm"
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
                className="px-4 py-2  text-sm font-semibold text-left text-[#f30000] "
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
