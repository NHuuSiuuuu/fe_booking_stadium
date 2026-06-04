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
    fetch(`api/districts`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts ?? []))
      .catch(console.error);
  }, []);

  return (
    <div className="relative min-h-[500px] flex flex-col justify-end overflow-hidden">
      <div
        className="absolute inset-0 bg-cover "
        style={{
          backgroundImage: "url('/hero.png')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="relative z-10 max-w-[1200px] mx-auto w-full px-8 pt-20 pb-14">
        <span className="inline-flex items-center gap-2 px-0 py-1 mb-5 text-white/50 text-[10px] font-semibold uppercase tracking-[0.3em]">
          Hà Nội · 53 sân bóng · 12 quận
        </span>
        <h1
          className="text-white font-black uppercase leading-[1] m-0 mb-5 max-w-[620px]"
          style={{
            fontSize: "clamp(2rem, 5vw, 5rem)",
            letterSpacing: "-0.02em",
          }}
        >
          Đặt sân bóng
          <br />
          <span className="text-white">nhanh nhất</span>
          <br />
          <span className="text-white/30">Hà Nội.</span>
        </h1>

        <p className="text-slate-200 text-[13px] font-semibold uppercase tracking-[0.06em] mb-9">
          Xem lịch trống · Đặt sân online · Bản đồ GIS trực quan
        </p>

        {/* Search bar */}
        <div className="flex items-stretch max-w-[800px] bg-white border border-slate-200 overflow-hidden">
          <div className="flex flex-col justify-center flex-1 px-4 py-3 border-r border-slate-100">
            <div className="text-[12px] font-bold uppercase  text-slate-800 mb-1">
              Quận / Huyện
            </div>
            <select
              value={distCode}
              onChange={(e) => setDistCode(e.target.value)}
              className="bg-transparent border-none outline-none text-[13px]  text-slate-800 cursor-pointer"
            >
              <option value="">Tất cả</option>
              {districts?.map((item) => (
                <option value={item.ogc_fid} key={item.ogc_fid}>
                  {item.name_2}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col justify-center flex-1 px-4 py-3 border-r border-slate-100">
            <div className="text-[12px] font-bold uppercase  text-slate-800 mb-1">
              Loại sân
            </div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-transparent border-none outline-none text-[13px]  text-slate-800 cursor-pointer"
            >
              <option value="">Tất cả</option>
              <option value="5">5v5</option>
              <option value="7">7v7</option>
              <option value="11">11v11</option>
            </select>
          </div>
          <div className="flex flex-col justify-center flex-1 px-4 py-3 border-r border-slate-100">
            <div className="text-[12px] font-bold uppercase  text-slate-800 mb-1">
              Khung giờ
            </div>
            <select className="bg-transparent border-none outline-none text-[13px]  text-slate-800 cursor-pointer">
              <option>Bất kỳ</option>
              <option>Sáng (6–12h)</option>
              <option>Chiều (12–18h)</option>
              <option>Tối (18–22h)</option>
            </select>
          </div>
          <div className="flex items-center p-1.5">
            <button
              className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em]
                   text-white bg-gray-900 hover:bg-gray-700  px-7 py-3.5
                   no-underline transition-colors"
            >
              <Search className="size-5" />
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
