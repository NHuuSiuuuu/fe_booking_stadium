"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, RefreshCw, Search, Signpost } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import Pagination from "@/components/admin/layouts/pagination";

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
export default function ListStadiums({ initialData }: ListStadiumsProp) {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentKeyword = searchParams.get("keyword");
  const [search, setSearch] = useState(currentKeyword || "");
  const debounceValue = useDebounce(search, 500);

  const [filterStatus, setFilterStatus] = useState("");
  const [filterFeatured, setFilterFeatured] = useState("");
  const [sort, setSort] = useState("");
  const [dist, setDist] = useState("");
  const [page, setPage] = useState<any>(1);
  const [favorites, setFavorites] = useState<Stadium[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debounceValue) {
      params.set("keyword", debounceValue);
    } else {
      params.delete("keyword");
    }

    params.delete("filter");
    if (filterStatus) {
      params.set("filter", filterStatus);
    }

    if (filterFeatured) {
      params.set("filter", filterFeatured);
    }

    if (sort) {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }

    if (page) {
      params.set("page", page);
    } else {
      params.delete("page");
    }

    if (sort) {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }
    if (dist) {
      params.set("dist", dist);
    } else {
      params.delete("dist");
    }

    if (page) {
      params.set("page", page);
    } else {
      params.delete("page");
    }

    router.push(`${pathName}?${params.toString()}`);
  }, [debounceValue, filterFeatured, page, filterStatus, sort, pathName, dist]);
  const handleFavorite = (s: Stadium) => {
    const exist = favorites.find((item) => item.id === s.id);
    // console.log(exist);
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
  const totalPage = initialData?.totalPage || 0;
  // console.log("totalPage", totalPage);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1200px] mx-auto px-4 pt-3 md:py-8 sm:px-6">
        <div className="  md:shadow-sm md:p-5 mb-2">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1 md:gap-4">
            {/* Tìm kiếm */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] md:text-sm font-bold uppercase tracking-[0.12em] text-slate-700">
                Tìm kiếm
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-700" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tên sân, địa chỉ..."
                  className="w-full h-10 pl-9 pr-4 border border-slate-200 bg-slate-50
                     text-[13px] text-slate-800 placeholder:text-slate-700
                     focus:outline-none focus:border-slate-400 focus:bg-white
                     transition-all "
                />
              </div>
            </div>

            {/* Trạng thái */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] md:text-sm  font-bold uppercase tracking-[0.12em] text-slate-700">
                Trạng thái
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-10 px-3 border border-slate-200 bg-slate-50
                   text-[13px] text-slate-700
                   focus:outline-none focus:border-slate-400 focus:bg-white
                   transition-all cursor-pointer"
              >
                <option value="">Tất cả</option>
                <option value="status:true">Hoạt động</option>
                <option value="status:false">Dừng hoạt động</option>
                <option value="featured:true">Nổi bật</option>
                <option value="featured:false">Không nổi bật</option>
              </select>
            </div>

            {/* Sắp xếp */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] md:text-sm  font-bold uppercase tracking-[0.12em] text-slate-700">
                Sắp xếp
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 px-3 border border-slate-200 bg-slate-50
                   text-[13px] text-slate-700
                   focus:outline-none focus:border-slate-400 focus:bg-white
                   transition-all cursor-pointer"
              >
                <option value="">Mặc định</option>
                <option value="name:asc">Tên: A → Z</option>
                <option value="name:desc">Tên: Z → A</option>
                <option value="district_id:asc">Giá: Tăng dần</option>
                <option value="district_id:desc">Giá: Giảm dần</option>
              </select>
            </div>

            {/* Reset */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] md:text-sm  font-bold uppercase tracking-[0.12em] text-slate-700">
                Xóa bộ lọc
              </label>
              <button
                onClick={() => {
                  setFilterStatus("");
                  setFilterFeatured("");
                  setSort("");
                  setDist("");
                  setSearch("");
                }}
                className="h-10 flex items-center justify-center gap-2
                   border border-slate-200 bg-slate-50
                   text-[12px] font-semibold text-slate-500
                   hover:border-slate-400 hover:text-slate-800 hover:bg-white
                   transition-all cursor-pointer"
              >
                <RefreshCw className="size-5.5" />
              </button>
            </div>
          </div>
        </div>

        <p className="text-[13px] font-bold uppercase text-[#94a3b8] mb-[4px]">
          Khám Phá
        </p>
        <p className="text-[20px] font-bold mb-[2px] text-[#0f172a] ">
          Sân Mới
        </p>
        <p className="text-[13px] font-bold uppercase text-[#94a3b8] mb-[4px]">
          Những sân vừa được cập nhật gần đây
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:mt-5 lg:grid-cols-3">
          <>
            {initialData?.stadiums?.map((s) => (
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
                      title="Sân yêu thích"
                      className={` absolute top-2.5 right-2.5 px-2.5 py-1  text-white  `}
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleFavorite(s);
                        }}
                      >
                        <Heart
                          className={
                            favorites.find((item) => item.id === s.id)
                              ? "text-red-500 cursor-pointer fill-red-500"
                              : "text-white cursor-pointer"
                          }
                        />
                      </button>
                    </div>
                    <div
                      className={`absolute top-2.5 left-2.5 px-2.5 py-1  text-white text-[10px] font-bold uppercase bg-slate-500`}
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
                 py-2  text-[11px] font-semibold  uppercase tracking-wider transition-colors"
                      >
                        Đặt sân →
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </>
        </div>
        {initialData?.stadiums.length === 0 && (
          <p className="py-16 text-center text-sm font-semibold uppercase tracking-widest text-slate-700">
            Không tìm thấy sân phù hợp
          </p>
        )}
        <Pagination page={page} totalPage={totalPage} setPage={setPage} />
      </div>
    </div>
  );
}
