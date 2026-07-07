"use client";

import Pagination from "@/components/admin/layouts/pagination";
import envConfig from "@/config";
import useDebounce from "@/hooks/useDebounce";
import { ArrowDownUp, RefreshCcw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "playing"
  | "completed";
type PaymentStatus =
  | "paid"
  | "unpaid"
  | "refund_pending"
  | "refunded"
  | "failed";

// Bảng cho phép chuyển tiếp trạng thái
const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["playing", "cancelled"],
  playing: ["completed"],
  completed: [],
  cancelled: [],
};

const statusLabel: Record<BookingStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  playing: "Đang diễn ra",
  completed: "Hoàn thành",
  cancelled: "Hủy",
};

type Booking = {
  id: string;
  fullName: string;
  phone: string;
  created_at: string;
  booking_date: string;
  stadium_name: string;
  start_time: string;
  end_time: string;
  total_price: number;
  payment_method: "cash" | "banking";
  paymentStatus: PaymentStatus;
  status: BookingStatus;
};

type BookingResponse = {
  result: Booking[];
  total: number;
  pageCurrent: number;
  totalPage: number;
};

type Props = {
  initialPriceConfig: BookingResponse;
};

export default function Bookings({ initialPriceConfig }: Props) {
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
  const orders = initialPriceConfig.result;
  const totalPage = initialPriceConfig.totalPage;

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

  const handleUpdateStatus = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: string,
  ) => {
    const newStatus = e.target.value as BookingStatus;

    try {
      const res = await fetch(`/api/booking/update-status`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, newStatus }),
      });

      if (!res.ok) {
        throw new Error("Cập nhật trạng thái thất bại");
      }

      router.refresh();
    } catch (error: any) {
      alert(error.message || "Đã xảy ra lỗi hệ thống");
    } finally {
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      {/* Orders Table */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow">
        {/* Table Header với filter */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Danh sách đơn hàng
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Tổng: <span className="font-semibold">{orders?.length}</span>{" "}
                đơn
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
                <option value="status:pending">Chờ xác nhận</option>
                <option value="status:confirmed">Đã xác nhận</option>
                <option value="status:playing">Đang diễn ra</option>
                <option value="status:completed">Hoàn thành</option>
                <option value="status:cancelled">Hủy</option>
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
                <option value="booking_date:asc">Ngày đặt ↑</option>
                <option value="booking_date:desc">Ngày đặt ↓</option>
                <option value="total_price:asc">Tổng giá ↑</option>
                <option value="total_price:desc">Tổng giá ↓</option>
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
                    Mã đơn
                    <ArrowDownUp className="text-xs text-[#1b1b1b] group-hover:text-gray-600" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Khách hàng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Ngày đặt
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Tên sân
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Ngày
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Khung giờ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Tổng tiền
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  {" "}
                  Thanh toán
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
              {orders?.map((order, index) => (
                <tr
                  key={order.id}
                  className={`hover:bg-gray-50 transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  {/* Mã đơn */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800">
                      #{order?.id}
                    </span>
                  </td>

                  {/* Khách hàng */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-sm font-medium text-white rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                        {order?.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {order?.fullName}
                        </p>
                        <p className="text-xs text-gray-500">{order?.phone}</p>
                      </div>
                    </div>
                  </td>

                  {/* Ngày đặt */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(order?.created_at).toLocaleDateString("vi-VN")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order?.created_at).toLocaleTimeString("vi-VN")}
                    </div>
                  </td>

                  {/* Sân */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {order?.stadium_name}
                    </div>
                  </td>

                  {/* Ngày  */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-500">
                      {new Date(order?.booking_date).toLocaleDateString(
                        "vi-VN",
                      )}
                    </div>
                  </td>
                  {/* Khung giờ*/}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {order?.start_time} - {order?.end_time}
                    </span>
                  </td>

                  {/* Tổng tiền*/}

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {order.total_price?.toLocaleString("vi-VN")}đ
                    </span>
                  </td>

                  {/* Thanh toán*/}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Thanh toán */}
                    <span
                      className={` px-2.5 py-1 rounded-full text-xs font-medium ${order.payment_method === "cash" ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"} `}
                    >
                      {order.payment_method === "cash"
                        ? "Tiền mặt"
                        : "Chuyển khoản"}
                    </span>
                    <p className="mt-1 text-xs text-gray-500">
                      {order.paymentStatus === "paid" && "Đã thanh toán"}
                      {order.paymentStatus === "unpaid" && "Chưa thanh toán"}
                      {order.paymentStatus === "refund_pending" &&
                        "Chờ hoàn tiền"}
                      {order.paymentStatus === "refunded" &&
                        "Đã hoàn tiền hoàn tiền"}
                      {order.paymentStatus === "failed" && "Lỗi khi thanh toán"}
                    </p>
                    {order.paymentStatus === "refund_pending" && (
                      <button
                        // onClick={() => handleRefundOrder(order._id)}
                        className="border"
                      >
                        Hoàn tiền
                      </button>
                    )}

                    <span className="text-sm font-semibold text-gray-900">
                      {order?.payment_method}
                    </span>
                  </td>

                  {/* Trạng thái đơn hàng */}

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`
                          inline-flex items-center px-3 py-1.5 border-l-4 text-sm font-semibold
                          ${order.status === "pending" ? "text-amber-800 border-amber-400 bg-amber-50/30" : ""}
                          ${order.status === "confirmed" ? "text-[#8b6f5f] border-[#a47b67] bg-[#f5ede6]/30" : ""}
                          ${order.status === "playing" ? "text-purple-800 border-purple-400 bg-purple-50/30" : ""}
                          ${order.status === "completed" ? "text-emerald-800 border-emerald-400 bg-emerald-50/30" : ""}
                          ${order.status === "cancelled" ? "text-rose-800 border-rose-400 bg-rose-50/30" : ""}
                        `}
                    >
                      {order.status === "pending" && "Chờ xác nhận"}
                      {order.status === "confirmed" && "Đã xác nhận"}
                      {order.status === "playing" && "Đang chơi"}
                      {order.status === "completed" && "Hoàn thành"}
                      {order.status === "cancelled" && "Đã hủy"}
                    </div>
                  </td>

                  {/* Thao tác */}
                  {/* Trạng thái đơn hàng */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      onChange={(e) => handleUpdateStatus(e, order?.id)}
                      value={order?.status}
                      className={`
                              px-4 py-2.5 border-2 border-gray-200 rounded-lg  
                              text-sm font-semibold outline-none cursor-pointer 
                              ${order.status === "pending" ? "text-amber-800" : ""}
                              ${order.status === "confirmed" ? "text-[#8b6f5f]" : ""}
                              ${order.status === "playing" ? "text-purple-800" : ""}
                              ${order.status === "completed" ? "text-emerald-800" : ""}
                              ${order.status === "cancelled" ? "text-rose-800" : ""}
                            `}
                    >
                      {(
                        [
                          "pending",
                          "confirmed",
                          "playing",
                          "completed",
                          "cancelled",
                        ] as BookingStatus[]
                      ).map((status) => (
                        <option
                          key={status}
                          value={status}
                          disabled={
                            status !== order?.status &&
                            !allowedTransitions[order.status]?.includes(status)
                          }
                          className="disabled:text-[#1b1b1b]"
                        >
                          {statusLabel[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {(!orders || orders?.length === 0) && (
          <div className="py-12 text-center">
            <div className="mb-3 text-[#1b1b1b]">
              {/* <FontAwesomeIcon icon={faPackage} className="w-12 h-12" /> */}
            </div>
            <h3 className="mb-1 text-sm font-medium text-gray-900">
              Chưa có đơn đặt
            </h3>
            <p className="text-sm text-gray-500">
              Đơn đặt sẽ xuất hiện tại đây
            </p>
          </div>
        )}
      </div>
      <Pagination page={page} totalPage={totalPage} setPage={setPage} />
    </div>
  );
}
