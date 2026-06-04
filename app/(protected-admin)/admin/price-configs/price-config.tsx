"use client";

import Pagination from "@/components/admin/layouts/pagination";
import useDebounce from "@/hooks/useDebounce";
import { BookMarked, ChevronRight, MapPin, Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Stadium = {
  id: number;
  name: string;
  slug: string;
  address: string;
  description: string;
  type: number;
  thumbnail: string[];
  utility: string[];
};

type StadiumsResponse = {
  stadiums: Stadium[];
  pageCurrent: number;
  totalPage: number;
  total: any;
  message: string;
};

type Props = { initialPriceConfig: StadiumsResponse };

export default function PriceConfig({ initialPriceConfig }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentKeyword = searchParams.get("keyword");

  const [search, setSearch] = useState(currentKeyword);
  const debounceValue = useDebounce(search, 500);

  useEffect(() => {
    // Khi có keyword mới khác với keyword hiện tại
    if (debounceValue !== currentKeyword) {
      const params = new URLSearchParams(searchParams.toString());
      if (debounceValue) {
        params.set("keyword", debounceValue);
      } else {
        params.delete("keyword");
      }
      params.set("page", "1");

      // /admin/price-configs?keyword=abc&page=1
      // params.toString() = "keyword=abc&page=1"
      router.push(`${pathname}?${params.toString()}`); ///admin/price-configs?keyword=abc&page=1
    }
  }, [debounceValue, currentKeyword, pathname, router, searchParams]);

  useEffect(() => {
    setSearch(currentKeyword);
  }, [currentKeyword]);

  const data = initialPriceConfig;
  const totalPage = data?.totalPage || 0;
  const page = data?.pageCurrent || 1;

  const handlePageChange = (newPage: number) => {
    // console.log("newPage", newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen p-4 bg-slate-50 md:p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
              Quản lý sân bóng
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Tổng số sân bóng:{" "}
              <span className="font-semibold text-slate-700">
                {data?.stadiums?.length || 0}
              </span>
            </p>
          </div>

          <Link href="/admin/stadiums/create">
            <button className="inline-flex items-center gap-2 h-11 px-6 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-sm hover:shadow-md">
              <Plus className="w-5 h-5" />
              <span>Thêm sân bóng</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-6">
        <div className="p-4 md:p-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Tìm kiếm
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={search ?? ""}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên sân, địa chỉ..."
              className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Stadiums Grid */}
      {data?.stadiums?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-slate-100">
            <MapPin className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-700">
            Không có sân bóng nào
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Thử thay đổi từ khóa tìm kiếm
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {data?.stadiums?.map((item) => (
            <Link
              key={item.id}
              href={`/admin/price-configs/${item.id}`}
              className="block group"
            >
              <div className="flex items-start gap-4 p-4 bg-white border border-slate-200  shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-24 h-20 overflow-hidden rounded-lg bg-slate-100">
                  {item?.thumbnail?.[0] ? (
                    <img
                      src={item.thumbnail[0]}
                      alt={item.name}
                      className="object-cover w-full h-full transition-transform duration-300 "
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <MapPin className="w-8 h-8 text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <h3 className="text-base font-semibold text-slate-800 truncate  transition-colors">
                    {item.name}
                  </h3>

                  <div className="flex items-start gap-1.5 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {item.address}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                      <BookMarked className="w-3 h-3" />
                      {item.type}
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-all duration-200" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data?.stadiums && data.stadiums.length > 0 && (
        <div className="mt-6">
          <Pagination
            page={page}
            totalPage={totalPage}
            setPage={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
