"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaTiktok, FaYoutube } from "react-icons/fa";
import {
  // Facebook,
  // Youtube,
  Music2,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="logo"
                width={40}
                height={40}
                className="invert"
              />

              <span className="font-black text-lg uppercase tracking-wide">
                SânBóngHN
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-6">
              Nền tảng đặt sân bóng đá trực tuyến tại Hà Nội.
            </p>

            <p className="text-slate-400 text-sm mt-2">
              Nhanh · Tiện · Minh bạch.
            </p>
          </div>

          {/* Sản phẩm */}
          <div>
            <h3 className="font-bold uppercase text-sm tracking-wider mb-4">
              Sản phẩm
            </h3>

            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <Link href="/stadiums">Tìm sân</Link>
              </li>

              <li>
                <Link href="/map">Bản đồ GIS</Link>
              </li>

              <li>
                <Link href="/stadiums">Đặt sân</Link>
              </li>

              <li>
                <Link href="/bookings">Quản lý đặt chỗ</Link>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h3 className="font-bold uppercase text-sm tracking-wider mb-4">
              Hỗ trợ
            </h3>

            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <Link href="#">Hướng dẫn</Link>
              </li>

              <li>
                <Link href="#">Câu hỏi thường gặp</Link>
              </li>

              <li>
                <Link href="#">Liên hệ</Link>
              </li>

              <li>
                <Link href="#">Báo lỗi</Link>
              </li>
            </ul>
          </div>

          {/* Pháp lý */}
          <div>
            <h3 className="font-bold uppercase text-sm tracking-wider mb-4">
              Pháp lý
            </h3>

            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <Link href="#">Điều khoản dịch vụ</Link>
              </li>

              <li>
                <Link href="#">Chính sách bảo mật</Link>
              </li>

              <li>
                <Link href="#">Cookies</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-800 my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <p className="text-xs text-slate-400 text-center md:text-left">
            © 2026 SânBóngHN. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="https://www.facebook.com/mohamedsatiii"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 border rounded-full border-slate-700 flex items-center justify-center hover:bg-slate-800 transition"
            >
              <FaFacebook size={18} />
            </Link>

            <Link
              href="#"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 border  rounded-full border-slate-700 flex items-center justify-center hover:bg-slate-800 transition"
            >
              <FaTiktok size={18} />
            </Link>

            <Link
              href="#"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 border  rounded-full border-slate-700 flex items-center justify-center hover:bg-slate-800 transition"
            >
              <FaYoutube size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
