"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Heart, Signpost } from "lucide-react";
import Hero from "@/components/client/layout/hero";
import Image from "next/image";
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
};

type StadiumsResponse = {
  stadiums: Stadium[];
  pageCurrent: number;
  totalPage: number;
  total: any;
};

type ListStadiumsProp = {
  initialData: StadiumsResponse;
};

function StadiumCardSkeleton() {
  return (
    <div className="overflow-hidden bg-white border rounded border-slate-200 animate-pulse">
      <div className="h-[180px] bg-slate-200" />
      <div className="px-4 pt-4 pb-3.5 space-y-3">
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-px bg-slate-100 my-2.5" />
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-2.5 w-16 rounded bg-slate-100" />
            <div className="h-4 w-24 rounded bg-slate-200" />
          </div>
          <div className="h-9 w-24 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export default function ListStadium({ initialData }: ListStadiumsProp) {
  const [distCode, setDistCode] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

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

  // Tránh fetch lần đàu vì bên server component đã fetch
  useEffect(() => {
    if (page === 1 && type === "" && distCode === "") {
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
        distCode={distCode}
        setDistCode={setDistCode}
        type={type}
        setType={setType}
      />

      <div className="max-w-[1200px] mx-auto px-4 py-8 sm:px-6">
        <p className="text-[13px] font-bold uppercase text-[#94a3b8] mb-[4px]"> Gợi ý</p>
        <p className="text-[20px] font-bold mb-[2px] text-[#0f172a] ">Sân nổi bật</p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }, (_, i) => <StadiumCardSkeleton key={i} />)
          ) : (
            <>
              {data?.stadiums?.map((s) => (
                <Link key={s?.id} href={`/stadiums/${s?.slug}`}>
                  <div className="overflow-hidden transition-all duration-200 bg-white border rounded border-slate-200 hover:border-slate-500 ">
                    <div className="relative h-[200px]">
                      {s?.thumbnail?.[0] && (
                        <Image
                          src={s?.thumbnail?.[0]}
                          fill
                          sizes="(max-width: 768px) 100vw,
                          (max-width: 1200px) 50vw,
                          33vw"
                          className=" object-cover block"
                          alt={s?.name}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div
                        className={`absolute top-2.5 right-2.5 px-2.5 py-1  text-white text-[10px] font-bold uppercase bg-slate-500`}
                      >
                        Sân {s.type}
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
                          <div className="text-[15px] font-semibold  text-black">
                            {Number(s?.price).toLocaleString("vi-VN")}đ
                          </div>
                        </div>
                        <button
                          className="text-white bg-gray-900 hover:bg-gray-700  px-4
                 py-2  text-[11px] font-semibold italic uppercase tracking-wider transition-colors"
                        >
                          Đặt sân →
                        </button>
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
                                : "text-gray-400"
                            }
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
        {!isLoading && data?.stadiums.length === 0 && (
          <p className="py-16 text-center text-sm font-semibold uppercase tracking-widest text-slate-400">
            Không tìm thấy sân phù hợp
          </p>
        )}
        {/* <Pagination page={page} totalPage={totalPage} setPage={setPage} /> */}
      </div>
    </div>
  );
}
