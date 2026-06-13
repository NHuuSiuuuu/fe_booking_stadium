"use client";

import Pagination from "@/components/admin/layouts/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useDebounce from "@/hooks/useDebounce";
import { ArrowDownUp, Info, RefreshCcw, SquarePen, Trash } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { AlertDialog } from "radix-ui";
import { useEffect, useState } from "react";

type UsersStatus = false | true;

type Users = {
  id: string;
  fullname: string;
  phone: string;
  created_at: string;
  isadmin: boolean;
  email: string;
  status: UsersStatus;
};

type UsersResponse = {
  result: Users[];
  total: number;
  pageCurrent: number;
  totalPage: number;
};

type Props = {
  initialUsers: UsersResponse;
};

export default function Users({ initialUsers }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // console.log("searchParams", searchParams);
  const pathName = usePathname();
  const currentKeyword = searchParams.get("keyword");
  const [search, setSearch] = useState(currentKeyword || "");
  const debounceValue = useDebounce(search, 500);

  const [filterStatus, setFilterStatus] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState<any>(1);
  const users = initialUsers.result;
  const totalPage = initialUsers.totalPage;
  const totalUsers = initialUsers.total;

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debounceValue) {
      params.set("keyword", debounceValue);
    } else {
      params.delete("keyword");
    }

    if (filterStatus) {
      // filter=status:pending
      console.log("filterStatus", filterStatus);
      params.set("filter", filterStatus);
    } else {
      params.delete("filter");
    }

    if (sort) {
      //sort=booking_date:asc
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }

    if (page) {
      params.set("page", page);
    } else {
      params.delete("page");
    }
    router.push(`${pathName}?${params.toString()}`);
  }, [debounceValue, filterStatus, sort, page, pathName]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      {/* users Table */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow">
        {/* Table Header với filter */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Danh sách tài khoản
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Tổng: <span className="font-semibold">{totalUsers}</span> tài
                khoản
              </span>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm ">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Status Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Trạng thái đơn đặt
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="status:true">Hoạt động</option>
                <option value="status:false">Dừng hoạt động</option>
                <option value="isadmin:true">Admin</option>
                <option value="isadmin:false">User</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Sắp xếp theo
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                 focus:border-transparent transition bg-white"
              >
                <option value="">Mặc định</option>
                <option value="fullname:desc">Họ tên ↑</option>
                <option value="fullname:asc">Họ tên ↓</option>
                <option value="created_at:asc">Ngày tạo ↑</option>
                <option value="created_at:desc">Ngày tạo ↓</option>
              </select>
            </div>

            {/* Reset Bộ Lọc */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus("");
                  setSort("");
                }}
                className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-center">
                  <RefreshCcw className="mx-[5px] text-[16px]" />
                  Xóa bộ lọc
                </div>
              </button>
            </div>
          </div>
          <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm ">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Status Filter */}
              <div>
                Tìm kiếm
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border h-[40px]"
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bảng */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  <div className="flex items-center gap-1 cursor-pointer group hover:text-gray-700">
                    ID
                    <ArrowDownUp className="text-xs text-gray-400 group-hover:text-gray-600" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Họ tên
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Ngày tạo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  admin/users
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Trạng thái
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users?.map((user, index) => (
                <tr
                  key={user.id}
                  className={`hover:bg-gray-50 transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  {/* Mã đơn */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800">
                      #{user?.id}
                    </span>
                  </td>

                  {/* Khách hàng */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-sm font-medium text-white rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                        {user?.fullname?.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.fullname}
                        </p>
                        <p className="text-xs text-gray-500">{user?.phone}</p>
                      </div>
                    </div>
                  </td>

                  {/* Ngày đặt */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(user?.created_at).toLocaleDateString("vi-VN")}
                    </div>
                  </td>

                  {/* Admin/ user */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.isadmin === true ? "admin" : "user"}
                    </div>
                  </td>

                  {/* trạng thái */}
                  <td className="px-6 py-4">
                    <div
                      className={`
                        ${user.status === true ? "text-emerald-800 border-emerald-400 bg-emerald-50/30" : "text-rose-800 border-rose-400 bg-rose-50/30"}
                      `}
                    >
                      {user?.status === true ? "Hoạt động" : "Dừng hoạt động"}
                    </div>
                  </td>

                  {/* Thao tác*/}
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/stadiums/update/`}
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
                              // onClick={() => handleRemoveStadium(item.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Link
                        href={`/admin/stadiums/detail/`}
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

        {/* Empty State */}
        {(!users || users?.length === 0) && (
          <div className="py-12 text-center">
            <h3 className="mb-1 text-sm font-medium text-gray-900">
              Không có tài khoản
            </h3>
          </div>
        )}
      </div>
      <Pagination page={page} totalPage={totalPage} setPage={setPage} />
    </div>
  );
}
