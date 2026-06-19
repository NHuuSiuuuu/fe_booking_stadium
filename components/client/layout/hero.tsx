"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

type District = {
  ogc_fid: number;
  name_2: string;
};
type HeroProps = {
  distCode: string;
  setDistCode: (val: string) => void;
  type: string;
  setType: (val: string) => void;
};

export default function Hero({
  distCode,
  setDistCode,
  type,
  setType,
}: HeroProps) {
  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    fetch(`api/districts`, {
      next: {
        revalidate: 60,
      },
    })
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts ?? []))
      .catch(console.error);
  }, []);

  return (
    <div className="relative min-h-[500px] md:min-h-[700px] flex flex-col justify-end overflow-hidden">
      <video
        className="h-full w-full absolute inset-0 object-cover"
        playsInline //Không fullscreen trên điện thoại
        autoPlay
        muted
        loop
      >
        <source src="/videos/banner.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="relative z-10 max-w-[1200px] mx-auto w-full px-3 md:px-8 pt-20 pb-14">
        <span className="inline-flex items-center gap-2 px-0 py-1 mb-3 md:mb-5 text-white/50 text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.3em]">
          Hà Nội · 53 sân bóng · 12 quận
        </span>

        <h1 className="text-white text-[38px] sm:text-[52px] md:text-[68px] font-black uppercase leading-[1.1] md:leading-[80px] mb-3 md:mb-5 max-w-[620px]">
          Đặt sân bóng
          <br />
          <span className="text-white/80">nhanh nhất</span>
          <br />
          <span className="text-white/50">Hà Nội.</span>
        </h1>

        <p className="text-slate-200 text-[11px] md:text-[14px]  font-semibold uppercase tracking-[0.06em] mb-9">
          Xem lịch trống · Đặt sân online · Bản đồ GIS trực quan
        </p>

        {/* Search bar */}
        {/* <div className="flex items-stretch w-full bg-white/30 p-2 gap-2 overflow-hidden"> */}
        <div className="flex flex-col sm:flex-row  w-full bg-white/30 p-2 gap-2">
          {/* Row 1 trên mobile: Quận + Loại sân */}
          <div className="flex flex-row gap-2 sm:contents">
            {/* Lọc quận */}
            <div className="flex flex-col justify-center bg-white flex-1 px-3 md:px-4 py-2">
              <div className="text-[10px] md:text-[12px] font-bold uppercase text-slate-800 mb-1">
                Quận / Huyện
              </div>
              <select
                value={distCode}
                onChange={(e) => setDistCode(e.target.value)}
                className="bg-transparent border-none outline-none text-[13px] md:text-[14px] text-slate-800 cursor-pointer"
              >
                <option value="">Tất cả</option>
                {districts?.map((item) => (
                  <option value={item.ogc_fid} key={item.ogc_fid}>
                    {item.name_2}
                  </option>
                ))}
              </select>
            </div>

            {/* Lọc sân */}
            <div className="flex flex-col justify-center bg-white flex-1 px-3 md:px-4 py-2">
              <div className="text-[10px] md:text-[12px] font-bold uppercase text-slate-800 mb-1">
                Loại sân
              </div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-transparent border-none outline-none text-[13px] md:text-[14px] text-slate-800 cursor-pointer"
              >
                <option value="">Tất cả</option>
                <option value="5">5v5</option>
                <option value="7">7v7</option>
                <option value="11">11v11</option>
              </select>
            </div>
          </div>

          {/* Row 2 trên mobile: Khung giờ + Nút tìm */}
          <div className="flex flex-row gap-2 sm:contents">
            {/* Khung giờ */}
            <div className="flex flex-col justify-center bg-white flex-1 px-3 md:px-4 py-2">
              <div className="text-[10px] md:text-[12px] font-bold uppercase text-slate-800 mb-1">
                Khung giờ
              </div>
              <select className="bg-transparent border-none outline-none text-[13px] md:text-[14px] text-slate-800 cursor-pointer">
                <option>Bất kỳ</option>
                <option>Sáng (6–12h)</option>
                <option>Chiều (12–18h)</option>
                <option>Tối (18–22h)</option>
              </select>
            </div>

            {/* Nút tìm kiếm */}
            <div className="flex bg-white items-center p-1.5">
              <button
                className="flex items-center justify-center gap-2 text-[13px] md:text-[14px] font-semibold uppercase tracking-[0.1em]
                     text-white bg-gray-900 hover:bg-gray-700 px-5 md:px-7 py-2.5 w-full
                     transition-colors"
              >
                <Search className="size-4 md:size-5" />
                <span className="hidden xs:inline">Tìm kiếm</span>
                <span className="xs:hidden">Tìm</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
