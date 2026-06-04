"use client";
import {
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  Home,
  User,
  Phone,
  Mail,
  Hash,
  CheckCircle2,
  XCircle,
  Hourglass,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type BookingStatus = "pending" | "confirmed" | "cancelled";

const STATUS_MAP: Record<
  BookingStatus,
  {
    label: string;
    icon: React.ReactNode; // là bất kỳ thứ gì react render được JSX/render UI thì dùng
    cls: string;
    
  }
> = {
  pending: {
    label: "Chờ xác nhận",
    icon: <Hourglass size={12} />,
    cls: "bg-yellow-400 text-black",
  },
  confirmed: {
    label: "Đã xác nhận",
    icon: <CheckCircle2 size={12} />,
    cls: "bg-black text-white",
  },
  cancelled: {
    label: "Đã huỷ",
    icon: <XCircle size={12} />,
    cls: "bg-red-600 text-white",
  },
};

type BookingData = {
  stadiumBooking: {
    thumbnail: string;
    name: string;
    type: number;
    address: string;
    start_time: string;
    end_time: string;
    day_of_week: string;
  };

  result: {
    payment_method: string;
    total_price: number;
    booking_date: string;
    status: BookingStatus;
    full_name: string;
    email: string;
    phone: string;
    note?: string;
    id: string;
    payment_status: string;
  };
};
export default function BookingDetail() {
  const { id } = useParams();
  const [data, setData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    fetch(`/api/booking/success/${id}`)
      .then((res) => res.json())
      .then((payload) => setData(payload.data))
      .catch(() => {
        console.error;
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!data || isCancelling) return;
    setIsCancelling(true);

    try {
      const res = await fetch(`/api/booking/cancel/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Hủy đơn thất bại");
      }

      setData((prev) =>
        prev
          ? {
              ...prev,
              result: {
                ...prev.result,
                status: "cancelled",
              },
            }
          : prev,
      );
      // console.log("res", res);
    } catch (err) {
      console.error(err);
      alert("Không thể hủy đơn. Vui lòng thử lại.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm font-bold uppercase tracking-widest text-gray-400 animate-pulse">
          Đang tải...
        </p>
      </div>
    );
  }

  const booking = data?.result;
  const stadium = data?.stadiumBooking;
  const status = STATUS_MAP[booking.status] ?? STATUS_MAP["pending"];
  console.log("status", status);
  const isCancelled = booking?.status === "cancelled";
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-5xl px-6 py-10 mx-auto">
        {/* Page title row */}
        <div className="flex items-start justify-between mb-8 ">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-black uppercase">
              Chi tiết đơn đặt
            </h1>
            <p className="mt-1 text-sm tracking-widest text-gray-400 uppercase">
              Mã đơn: #{id}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest px-3 py-1.5 ${status.cls}`}
          >
            {status.icon}
            {status.label}
          </span>
        </div>

        <div className="flex flex-col gap-5 ">
          {/* Stadium info */}
          <div className="bg-white border border-gray-200">
            <div className="px-5 py-3 bg-black">
              <p className="text-sm font-medium tracking-widest text-white uppercase">
                Thông tin sân
              </p>
            </div>
            <div className="flex items-start gap-4 p-5">
              <img
                src={data?.stadiumBooking?.thumbnail}
                alt=""
                className="object-cover w-20 h-20 shrink-0 "
              />
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <p className="text-base font-medium tracking-tight text-black uppercase">
                    {stadium?.name}
                  </p>
                  <span className="text-[10px] font-medium uppercase tracking-widest bg-black text-white px-2 py-0.5">
                    Sân {stadium?.type}
                  </span>
                </div>
                <p className="flex items-center gap-1.5 text-sm text-gray-500 uppercase tracking-wider">
                  <MapPin size={11} />
                  {stadium?.address}
                </p>
              </div>
            </div>
          </div>

          {/* Booking details */}
          <div className="bg-white border border-gray-200">
            <div className="px-5 py-3 bg-black">
              <p className="text-sm font-medium tracking-widest text-white uppercase">
                Thông tin đặt sân
              </p>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm tracking-widest text-gray-400 uppercase">
                  <Hash size={12} />
                  Mã đơn
                </div>
                <span className="text-sm font-medium tracking-widest text-black">
                  #{booking?.id}
                </span>
              </div>

              <div className="border-t border-gray-200 border-dashed" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm tracking-widest text-gray-400 uppercase">
                  <Calendar size={12} />
                  Ngày đặt
                </div>
                <span className="text-sm font-medium tracking-wide text-black uppercase">
                  Thứ {stadium?.day_of_week + 1}{" "}
                  {new Date(booking?.booking_date).toISOString().split("T")[0]}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm tracking-widest text-gray-400 uppercase">
                  <Clock size={12} />
                  Khung giờ
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-widest border border-black px-3 py-1 text-black">
                  {stadium?.start_time} – {stadium?.end_time}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm tracking-widest text-gray-400 uppercase">
                  <CreditCard size={12} />
                  Thanh toán
                </div>
                <span className="text-sm font-medium tracking-wide text-black uppercase">
                  {booking?.payment_method}
                </span>
              </div>
            </div>
          </div>

          {/* Customer info */}
          <div className="bg-white border border-gray-200">
            <div className="px-5 py-3 bg-black">
              <p className="text-sm font-medium tracking-widest text-white uppercase">
                Thông tin người đặt
              </p>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm tracking-widest text-gray-400 uppercase">
                  <User size={12} />
                  Họ và tên
                </div>
                <span className="text-sm font-medium text-black">
                  {booking?.full_name}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm tracking-widest text-gray-400 uppercase">
                  <Mail size={12} />
                  Email
                </div>
                <span className="text-sm text-black">{booking?.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm tracking-widest text-gray-400 uppercase">
                  <Phone size={12} />
                  Số điện thoại
                </div>
                <span className="text-sm text-black">{booking?.phone}</span>
              </div>

              {booking?.note && (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm tracking-widest text-gray-400 uppercase shrink-0">
                    Ghi chú
                  </div>
                  <span className="text-sm text-right text-gray-600">
                    {booking?.note}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Payment summary */}
          <div className="bg-white border border-gray-200">
            <div className="px-5 py-3 bg-black">
              <p className="text-sm font-medium tracking-widest text-white uppercase">
                Tổng thanh toán
              </p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm tracking-widest text-gray-400 uppercase">
                  Tạm tính
                </span>
                <span className="text-sm text-gray-700">
                  {new Intl.NumberFormat("vi-VN").format(booking?.total_price)}đ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm tracking-widest text-gray-400 uppercase">
                  Giảm giá
                </span>
                <span className="text-sm text-gray-700">
                  -{new Intl.NumberFormat("vi-VN").format(0)}đ
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-sm font-medium tracking-widest text-black uppercase">
                  Tổng tiền
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-medium text-black">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(booking?.total_price)}
                  </span>
                  <span
                    className={`${
                      booking?.payment_method === "online" &&
                      booking?.payment_status === "paid"
                        ? "block"
                        : "hidden"
                    } text-[10px] font-medium uppercase tracking-widest bg-black text-white px-2 py-1`}
                  >
                    Đã thanh toán
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-5">
          <Link
            href="/"
            className="flex items-center justify-center flex-1 
            gap-2 py-4 text-sm font-medium tracking-widest text-black uppercase transition-all border-2 border-black hover:bg-black hover:text-white"
          >
            <Home size={14} />
            Trang chủ
          </Link>
          <button
            onClick={handleCancel}
            // disabled={isCancelled || mutate.isPending}
            disabled={isCancelled}
            className={`flex items-center justify-center flex-1 gap-2 py-4 text-sm font-medium tracking-widest uppercase transition-colors
            ${
              isCancelled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }
          `}
          >
            {isCancelled ? "Đã huỷ" : isCancelling ? "Đang huỷ..." : "Huỷ"}
          </button>
        </div>
      </div>
    </div>
  );
}
