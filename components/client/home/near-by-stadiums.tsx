"use client";

import Link from "next/link";
import { ImageOff, MapPin } from "lucide-react";
import Image from "next/image";

export default function NearByStadiums({ initialData }) {
  console.log("initialData", initialData);
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 sm:px-6">
      <p className="text-[13px] font-bold uppercase text-[#94a3b8] mb-[4px]">
        Vị trí của bạn
      </p>
      <p className="text-[20px] font-bold mb-[2px] text-[#0f172a] ">
        Sân Gần Bạn
      </p>
      <p className="text-[13px] font-bold uppercase text-[#94a3b8] mb-[4px]">
        Trong bán kính 10 km · Hà Nội
      </p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {initialData?.stadiums?.map((s) => (
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
                      <ImageOff className="w-full h-[36px] md:h-full text-gray-400" />
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

                      <div className="text-sm text-xl font-bold text-black">
                        {Number(s.price).toLocaleString("vi-VN")}đ
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
                        1.4 km
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
    </div>
  );
}
