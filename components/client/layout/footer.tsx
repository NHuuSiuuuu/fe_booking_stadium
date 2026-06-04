import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-8 bg-black border-t border-white/10">
      <div className="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="logo"
            width={60}
            height={60}
            className="w-5 h-auto object-cover invert"
            style={{ height: "auto" }}
          />
          <span className="text-white/80 text-[11px] font-bold tracking-[0.1em] uppercase">
            SânBóng<span className="text-white/40">HN</span>
          </span>
        </div>

        {/* Copyright */}
        <p className="text-white/80 text-[12px] font-medium tracking-wide m-0">
          © 2026 SânBóngHN. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex gap-6">
          <Link
            href="#"
            className="text-white/80 hover:text-white text-[12px] font-medium uppercase tracking-wide no-underline transition-colors"
          >
            Chính sách
          </Link>
          <Link
            href="#"
            className="text-white/80 hover:text-white text-[12px] font-medium uppercase tracking-wide no-underline transition-colors"
          >
            Điều khoản
          </Link>
          <Link
            href="#"
            className="text-white/80 hover:text-white text-[12px] font-medium uppercase tracking-wide no-underline transition-colors"
          >
            Liên hệ
          </Link>
        </div>
      </div>
    </footer>
  );
}
