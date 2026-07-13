"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Heart, Signpost } from "lucide-react";
import Hero from "@/components/client/layout/hero";
import Image from "next/image";
import ListStadiumSkeleton from "@/components/client/stadium/list-stadium-skeleton";
type Stadium = {
  id: number;
  slug: string;
  name: string;
  address: string;
  type: string;
  price: number;
  thumbnail: string[];
  start_time: string;
  end_time: string;
  featured: boolean;
  description: string;
  district_id: number;
  min_price: number;
  max_price: number;
};

type StadiumsResponse = {
  stadiums: Stadium[];
  pageCurrent: number;
  totalPage: number;
  total: any;
};
type District = {
  ogc_fid: number;
  name_2: string;
};

type ListStadiumsProp = {
  initialData: StadiumsResponse;
  districts: District[];
};

export default function ListStadium({
  initialData,
  districts,
}: ListStadiumsProp) {
  const [distCode, setDistCode] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const isFirstRender = useRef(true);

  const [data, setData] = useState(initialData);

  //   Sân yêu thích
  const [favorites, setFavorites] = useState<Stadium[]>([]);
  useEffect(() => {
    try {
      const data = localStorage.getItem("favorite");
      if (data) {
        setFavorites(JSON.parse(data));
      }
    } catch {}
  }, []);

  // Lần đầu load trang nó sẽ dừng ở đây - đây có thể coi là 1 cái chốt chặn để tránh fetch dữ liệu 2 lần
  // Tránh fetch lần đàu vì bên server component đã fetch
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const fetchStadiums = async () => {
      setIsLoading(true);
      try {
        let url = `api/stadiums?page=${page}`;
        if (type) url += `&filter=type:${type}`;
        if (distCode) url += `&filter=dist:${distCode}`;

        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) throw new Error("Lỗi");

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStadiums();
  }, [type, distCode, page]);

  const handleFavorite = (s: Stadium) => {
    const exist = favorites.find((item) => item.id === s.id);
    console.log(exist);
    let newFavorites;

    // Kiểm tra nếu đã có thì xóa
    if (exist) {
      newFavorites = favorites.filter((item) => item.id !== s.id);
    } else {
      newFavorites = [...favorites, s];
    }
    setFavorites(newFavorites);
    localStorage.setItem("favorite", JSON.stringify(newFavorites));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Hero
        districts={districts}
        distCode={distCode}
        setDistCode={setDistCode}
        type={type}
        setType={setType}
      />

      <div className="max-w-[1200px] mx-auto px-4 py-8 sm:px-6">
        <div className=" pb-5">
          <p className="text-[13px] font-bold uppercase text-[#94a3b8] mb-[4px]">
            Khám Phá
          </p>
          <p className="text-[20px] font-bold mb-[2px] text-[#0f172a] ">
            Sân Mới Nổi Bật
          </p>
          <p className="text-[13px] font-bold uppercase text-[#94a3b8] mb-[4px]">
            Những sân vừa được cập nhật gần đây
          </p>
        </div>

        {isLoading ? (
          <ListStadiumSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.stadiums?.map((s) => (
              <Link key={s?.id} href={`/stadiums/${s?.slug}`}>
                <div className="overflow-hidden transition-all duration-200 bg-white border rounded border-slate-200 hover:border-slate-500 ">
                  <div className="relative h-[200px] group overflow-hidden">
                    {s?.thumbnail?.[0] && (
                      <Image
                        src={s?.thumbnail?.[0]}
                        fill
                        sizes="(max-width: 768px) 100vw,
                          (max-width: 1200px) 50vw,
                          33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={s?.name}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div
                      className={`absolute top-2.5 left-2.5 px-2.5 py-1  text-white text-[10px] font-bold uppercase bg-slate-500`}
                    >
                      Sân {s.type}
                    </div>
                    <div className={`absolute top-2.5 right-2.5 px-2.5 py-1 `}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleFavorite(s);
                        }}
                      >
                        <Heart
                          className={
                            favorites.find((item) => item.id === s.id)
                              ? "text-red-500 fill-red-500"
                              : "text-[#ffff]"
                          }
                        />
                      </button>
                    </div>
                  </div>
                  <div className="px-4 pt-4 pb-3.5">
                    <h3 className="m-0 mb-2 text-sm font-bold leading-tight uppercase text-slate-900">
                      {s?.name}
                    </h3>
                    <p className="m-0 mb-1.5 text-xs text-slate-600 flex items-start gap-1.5">
                      <Signpost className="size-4" /> {s?.address}
                    </p>

                    <div className="h-px bg-slate-100 my-2.5" />
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-slate-500 mb-0.5">
                          Giá / giờ
                        </div>
                        <div className="text-sm md:text-lg font-bold  text-black">
                          {Number(s?.min_price).toLocaleString("vi-VN")}đ -{" "}
                          {Number(s?.max_price).toLocaleString("vi-VN")}đ
                        </div>
                      </div>
                      <button
                        className="text-white bg-gray-900 hover:bg-gray-700  px-4
                          py-2  text-[11px] font-semibold italic uppercase tracking-wider transition-colors"
                      >
                        Đặt sân →
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {!isLoading && data?.stadiums.length === 0 && (
          <p className="py-16 text-center text-sm font-semibold uppercase tracking-widest text-slate-400">
            Không tìm thấy sân phù hợp
          </p>
        )}
      </div>
    </div>
  );
}
