"use client";

import Link from "next/link";
import { ImageOff, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function NearByStadiums({ initialData }: any) {
  const [stadiums, setStadiums] = useState(
    initialData?.stadiums ||
      initialData?.data ||
      (Array.isArray(initialData) ? initialData : []),
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleFindNearMe = () => {
    // API lấy vị trí
    // Kiểm tra trình duyệt có hỗ trợ định vị
    if (!navigator.geolocation) return;

    setIsLoading(true);

    // Lây tọa độ
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const radius = 5000; // Bán kính 10km
          const res = await fetch(
            `/api/stadiums?limit=6&lat=${lat}&lng=${lng}&radius=${radius}`,
          );

          if (!res.ok) throw new Error("Không thể lấy danh sách sân gần đây");

          const data = await res.json();
          // Cập nhật lại danh sách sân
          setStadiums(data?.stadiums || data?.data || []);
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Vui lòng cấp quyền truy cập vị trí để tìm sân gần bạn.");
        } else {
          toast.error("Không thể xác định vị trí của bạn.");
        }
      },
    );
  };
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-[13px] font-bold uppercase text-slate-400 mb-1 tracking-wider">
            Vị trí của bạn
          </p>
          <h2 className="text-[20px] font-bold mb-[2px] text-[#0f172a] ">
            Sân Gần Bạn
          </h2>
          <p className="text-[13px] font-bold uppercase text-[#94a3b8] mb-[4px]">
            Trong bán kính Hà Nội
          </p>
        </div>

        <button
          onClick={handleFindNearMe}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5  text-sm font-semibold transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <>
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Đang xác định vị trí...
            </>
          ) : (
            <>
              <MapPin className="size-4" />
              Tìm sân gần tôi
            </>
          )}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {stadiums?.map((s: any) => (
          <Link key={s?.id} href={`/stadiums/${s?.slug}`}>
            <div className="overflow-hidden bg-white border border-slate-200 hover:border-slate-500 transition-all duration-200">
              <div className="flex flex-col  md:flex-row">
                {/* IMAGE */}
                <div className="relative w-full md:w-[180px] h-[150px] md:h-[200px] shrink-0">
                  {s?.thumbnail?.[0] ? (
                    <Image
                      src={s.thumbnail[0]}
                      alt={s.name}
                      fill
                      className="object-cover "
                      sizes="260px"
                    />
                  ) : (
                    <div className="flex justify-center items-center">
                      <ImageOff className="w-full h-[36px] md:h-full text-[#1b1b1b]" />
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="flex flex-1">
                  <div className="flex flex-col justify-between flex-1 p-1 md:p-5">
                    <div>
                      <h3 className="text-sm md:text-lg font-bold text-slate-900 md:mb-3 uppercase">
                        {s.name}
                      </h3>

                      <p className="text-[10px] md:text-sm text-slate-600 flex items-start gap-2">
                        {s.address}
                      </p>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-slate-500">
                        Giá / giờ
                      </div>

                      <div className="text-sm md:text-lg font-bold text-black">
                        Từ {Number(s?.min_price).toLocaleString("vi-VN")}đ -
                        {Number(s?.max_price).toLocaleString("vi-VN")}đ
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between text-right items-end flex-1 p-1 md:p-5">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-3 uppercase">
                        Sân {s.type}
                      </h3>

                      <p className="text-sm text-slate-600 flex items-start gap-2">
                        <MapPin className="size-4 shrink-0 mt-0.5" />
                        {s.distance
                          ? `${(Number(s.distance) / 1000).toFixed(1)} km`
                          : "Đang cập nhật"}
                      </p>
                    </div>

                    <div>
                      <div className="h-px bg-slate-100 my-4" />

                      <div className="flex items-center justify-between">
                        <button className=" bg-gray-900 hover:bg-gray-700 text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors">
                          Đặt sân →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
