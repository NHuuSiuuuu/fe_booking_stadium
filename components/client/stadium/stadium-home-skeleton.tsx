import { Search } from "lucide-react";
import Image from "next/image";

export default function StadiumHomeSkeleton({ count }: any) {
  return (
    <div className="min-h-screen ">
      <div className="relative min-h-[500px] md:min-h-[700px] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/banner.png"
            fill
            priority
            alt=""
            className="object-cover"
          />
        </div>
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
                <select className="bg-transparent border-none outline-none text-[13px] md:text-[14px] text-slate-800 cursor-pointer">
                  <option value="">Tất cả</option>
                </select>
              </div>

              {/* Lọc sân */}
              <div className="flex flex-col justify-center bg-white flex-1 px-3 md:px-4 py-2">
                <div className="text-[10px] md:text-[12px] font-bold uppercase text-slate-800 mb-1">
                  Loại sân
                </div>
                <select className="bg-transparent border-none outline-none text-[13px] md:text-[14px] text-slate-800 cursor-pointer">
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
      <div className="max-w-[1200px] mx-auto px-4 py-8 sm:px-6 ">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="overflow-hidden  border rounded  ">
              <div className="h-[180px] relative overflow-hidden bg-[#F0F0F4]">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              </div>

              <div className="px-4 pt-4 pb-3.5 space-y-3">
                <div className="h-4 w-3/4 relative overflow-hidden  rounded bg-[#F0F0F4]">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                </div>

                <div className="h-3 w-full relative overflow-hidden  rounded bg-[#F0F0F4]">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                </div>

                <div className="h-px bg-slate-100 my-2.5" />

                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-2.5 w-16 relative overflow-hidden  rounded bg-[#F0F0F4]">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                    </div>

                    <div className="h-4 w-24  relative overflow-hidden rounded bg-[#F0F0F4]">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                    </div>
                  </div>
                  <div className="h-9 w-24  relative overflow-hidden rounded bg-[#F0F0F4]">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
