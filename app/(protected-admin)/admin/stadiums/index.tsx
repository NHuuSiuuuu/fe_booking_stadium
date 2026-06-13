"use client";

import Pagination from "@/components/admin/layouts/pagination";
import envConfig from "@/config";
import useDebounce from "@/hooks/useDebounce";
import {
  Image,
  Info,
  Plus,
  RefreshCw,
  SquarePen,
  Star,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
  createBy: {
    account_id: {
      fullName: string;
    };
    createdAt: Date;
  };
  status: boolean;
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

export default function StadiumAdmin() {
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFeatured, setFilterFeatured] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [data, setData] = useState<StadiumsResponse>();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const debounceValue = useDebounce(search, 500);
  const [districts, setDistricts] = useState<District[]>([]);
  const [distCode, setDistCode] = useState("");

  useEffect(() => {
    setIsLoading(true);
    let url = `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/stadiums?page=${page || 1}`;
    if (debounceValue) url += `&keyword=${debounceValue}`;
    if (distCode) url += `&filter=dist:${distCode}`;
    if (sort) url += `&sort=${sort}`;
    if (filterStatus) url += `&filter=status:${filterStatus}`;
    if (filterFeatured) url += `&filter=featured:${filterFeatured}`;

    const result = fetch(`${url}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(console.error);
  }, [page, sort, search, filterFeatured, filterStatus, distCode]);
  const totalPage = data?.totalPage || 0;

  useEffect(() => {
    fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/districts`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts ?? []))
      .catch(console.error);
  }, []);

  const handleRemoveStadium = async (id: number) => {
    try {
      const res = await fetch(
        `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/stadium/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Xóa thất bại");
      }
      toast.success("Xóa thành công");

      setData((prev) =>
        prev
          ? {
              ...prev,
              stadiums: prev.stadiums.filter((item) => item.id !== id),
            }
          : prev,
      );
    } catch (err) {
      console.log(err);
    }
  };
  //   console.log(data);
  //   console.log("distCode:", distCode);
  //   console.log("districts:", districts);
  return (
    // <div>heheh1</div>

    <div className="min-h-screen p-4 bg-gray-50 md:p-6">
      {/* Bộ lọc trạng thái */}
      <div>
        <div className="mb-8">
          <div className="flex justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
                Quản lý sân bóng
              </h1>
              <p className="mt-1 text-gray-600">
                Tổng số sân bóng:{" "}
                <span className="font-semibold">
                  {data?.stadiums?.length || 0}
                </span>
              </p>
            </div>

            <Link href="/admin/stadiums/create">
              <div className="relative inline-flex items-center justify-center h-12 px-6 overflow-hidden font-medium duration-500 rounded-md group bg-gradient-to-r from-blue-600 to-blue-800 text-neutral-200">
                <div className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0">
                  Thêm sân bóng
                </div>
                <div className="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
                  <Plus />
                </div>
              </div>
            </Link>
          </div>
        </div>
        {/* Filter Section */}
        <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm ">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Trạng thái */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-2">
                Trạng thái
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-11 px-4 border border-slate-300  text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="true"> Hoạt động</option>
                <option value="false"> Dừng hoạt động</option>
              </select>
            </div>

            {/* Nổi bật */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-2">
                Nổi bật
              </label>
              <select
                value={filterFeatured}
                onChange={(e) => setFilterFeatured(e.target.value)}
                className="h-11 px-4 border border-slate-300  text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="">Tất cả</option>
                <option value="true">Nổi bật</option>
                <option value="false">Không nổi bật</option>
              </select>
            </div>

            {/* Sắp xếp */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-2">
                Sắp xếp
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-11 px-4 border border-slate-300  text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="">Mặc định</option>
                <option value="name:asc">Tên: A → Z</option>
                <option value="name:desc">Tên: Z → A</option>
                <option value="district_id:asc">Giá: Tăng dần</option>
                <option value="district_id:desc">Giá: Giảm dần</option>
              </select>
            </div>

            {/* Quận */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-2">
                Quận
              </label>
              <select
                value={distCode}
                onChange={(e) => setDistCode(e.target.value)}
                className="h-11 px-4 border border-slate-300  text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="">Tất cả quận</option>
                {districts?.map((item) => (
                  <option key={item.ogc_fid} value={item.ogc_fid}>
                    {item.name_2}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset */}
            <div className="flex flex-col justify-end">
              <button
                onClick={() => {
                  setFilterStatus("");
                  setFilterFeatured("");
                  setSort("");
                  setDistCode("");
                }}
                className="h-11 w-full flex items-center justify-center gap-2 border border-slate-300 hover:border-slate-400 hover:bg-slate-50  text-slate-700 font-medium transition-all"
              >
                <RefreshCw size={18} />
                Xóa bộ lọc
              </button>
            </div>
          </div>

          {/* Hiển thị trạng thái lọc hiện tại */}
          {(filterFeatured || filterStatus || sort) && (
            <div className="pt-6 mt-6 border-t border-gray-200">
              <h3 className="mb-3 text-sm font-medium text-gray-700">
                Bộ lọc đang áp dụng:
              </h3>
              <div className="flex flex-wrap gap-2">
                {filterStatus && (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                    Trạng thái:{" "}
                    {filterStatus === "true"
                      ? "Đang hoạt động"
                      : "Dừng hoạt động"}
                    <button
                      onClick={() => setFilterStatus("")}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filterFeatured && (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-purple-800 bg-purple-100 rounded-full">
                    Nổi bật: {filterFeatured === "true" ? "Có" : "Không"}
                    <button
                      onClick={() => setFilterFeatured("")}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {sort && (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                    Sắp xếp: {sort.includes("price") ? "Giá" : "Tên"}{" "}
                    {sort.includes("asc") ? "↑" : "↓"}
                    <button
                      onClick={() => setSort("")}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="bg-white border border-slate-200  shadow-sm p-6 lg:p-8">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Tìm kiếm
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên sân, địa chỉ..."
            className="w-1/2 h-12 px-5 border border-slate-300  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 placeholder-slate-400 transition-all"
          />
        </div>
      </div>

      {/*Bảng sân bóng */}
      {data?.stadiums?.length === 0 ? (
        <div>
          <h1 className="font-medium text-center text-red-500 text-[20px]">
            Không có sân bóng nào{" "}
          </h1>
        </div>
      ) : (
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase"
                  >
                    Sân bóng
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase"
                  >
                    Địa chỉ
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase"
                  >
                    Loại sân
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase"
                  >
                    Mô tả
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase"
                  >
                    Trạng thái
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase"
                  >
                    Người tạo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase"
                  >
                    Hành động
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {data?.stadiums?.map((item) => (
                  <tr key={item.id} className="transition hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-12 h-12">
                          {item?.thumbnail?.[0] ? (
                            <img
                              className="object-cover w-12 h-12 border rounded-lg"
                              src={item.thumbnail[0]}
                              alt={item.name}
                            />
                          ) : (
                            <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-lg">
                              <Image className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                          <div className="flex items-center mt-1">
                            {item.featured === true && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Star size={16} />
                                Nổi bật
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {item?.address}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        abc xtz
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        abc xtz
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${item.status === true ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {item.status === true ? (
                          <>
                            <span className="w-2 h-2 mr-2 bg-green-500 rounded-full"></span>
                            Hoạt động
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 mr-2 bg-red-500 rounded-full"></span>
                            Dừng hoạt động
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {item.createBy?.account_id?.fullName ||
                          "Không xác định"}
                      </div>

                      <div className="text-xs text-gray-500">
                        {new Date(item?.createBy?.createdAt).toLocaleString(
                          "vi-VN",
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/stadiums/update/${item.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-50 transition"
                        >
                          <SquarePen size={16} />
                          Sửa
                        </Link>

                        {/* Xóa */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-300 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 transition"
                            >
                              <Trash size={16} />
                              Xóa
                            </button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Bạn chắc chắn muốn xóa?
                              </AlertDialogTitle>

                              <AlertDialogDescription>
                                Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>

                              <AlertDialogAction
                                onClick={() => handleRemoveStadium(item.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Link
                          href={`/admin/stadiums/detail/${item.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                        >
                          <Info className="text-[7px] p-1 border rounded-[100%] mr-1" />
                          Chi tiết
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
        </div>
      )}
      <Pagination page={page} totalPage={totalPage} setPage={setPage} />
    </div>
  );
}
