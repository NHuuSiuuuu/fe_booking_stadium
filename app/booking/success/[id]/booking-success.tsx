"use client";
import {
  CheckCircle2,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  Mail,
  Home,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  };
};

export default function BookingSuccess() {
  const { id } = useParams();
  const [data, setData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log(id);
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

  console.log(data);
  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm font-bold uppercase tracking-widest text-gray-400 animate-pulse">
          Đang tải...
        </p>
      </div>
    );
  }

  return (
    // <h1>hehe</h1>
    <div className="min-h-screen bg-[#f5f5f5] ">
      <div className="max-w-2xl px-6 py-12 mx-auto">
        {/* Success header */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center justify-center w-16 h-16 mb-4 bg-black border rounded-full">
            <CheckCircle2 className="text-white size-8" />
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-black uppercase">
            Đặt sân thành công!
          </h1>
          <p className="mt-2 text-xs tracking-widest text-gray-400 uppercase">
            Đơn đặt sân của bạn đã được xác nhận
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white border border-gray-200">
          {/* Card header */}
          <div className="flex items-center justify-between px-5 py-3 bg-black">
            <p className="text-xs font-bold tracking-widest text-white uppercase">
              Chi tiết đơn hàng
            </p>
            <span className="text-xs font-bold tracking-widest text-white border border-white px-2 py-0.5">
              #{id}
            </span>
          </div>

          <div className="p-5 space-y-5">
            {/* Stadium info */}
            <div className="flex items-start gap-4">
              <img
                src={data?.stadiumBooking?.thumbnail}
                alt=""
                className="object-cover w-20 h-20 shrink-0 grayscale"
              />
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-base font-medium tracking-tight text-black uppercase">
                    {data?.stadiumBooking?.name}
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5">
                    Sân {data?.stadiumBooking?.type}
                  </span>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-gray-500 uppercase tracking-wider">
                  <MapPin size={11} />
                  {data?.stadiumBooking?.address}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 border-dashed" />

            {/* Booking details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs tracking-widest text-gray-400 uppercase">
                  <Calendar size={12} />
                  Ngày đặt
                </div>
                <span className="text-sm font-bold tracking-wide text-black uppercase">
                  Thứ {data?.stadiumBooking?.day_of_week + 1}{" "}
                  {
                    new Date(data?.result?.booking_date)
                      .toISOString()
                      .split("T")[0]
                  }
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs tracking-widest text-gray-400 uppercase">
                  <Clock size={12} />
                  Khung giờ
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest border border-black px-3 py-1 text-black">
                  {data?.stadiumBooking?.start_time} –{" "}
                  {data?.stadiumBooking?.end_time}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs tracking-widest text-gray-400 uppercase">
                  <CreditCard size={12} />
                  Thanh toán
                </div>
                <span className="text-sm font-bold tracking-wide text-black uppercase">
                  {data?.result?.payment_method}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 border-dashed" />

            {/* Totals */}
            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-xs tracking-widest text-gray-400 uppercase">
                  Tạm tính
                </span>
                <span className="text-sm text-gray-700">
                  {new Intl.NumberFormat("vi-VN").format(
                    data?.result?.total_price,
                  )}
                  đ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs tracking-widest text-gray-400 uppercase">
                  Giảm giá
                </span>
                <span className="text-sm text-gray-700">
                  -{new Intl.NumberFormat("vi-VN").format(0)}đ
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* Grand total */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium tracking-widest text-black uppercase">
                Tổng tiền
              </span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-medium text-black">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(data?.result?.total_price)}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-1">
                  Đã thanh toán
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Email notice */}
        <div className="flex items-center gap-3 px-4 py-3 mt-4 bg-white border border-gray-300">
          <Mail size={14} className="text-gray-400 shrink-0" />
          <p className="text-xs tracking-widest text-gray-500 uppercase">
            Email xác nhận đã được gửi đến địa chỉ email của bạn
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-4">
          <Link
            href="/"
            className="flex items-center justify-center flex-1 gap-2 py-4 text-xs font-bold tracking-widest text-black uppercase transition-all border-2 border-black hover:bg-black hover:text-white"
          >
            <Home size={14} />
            Trang chủ
          </Link>
          <Link
            href={`/booking/detail/${id}`}
            className="flex items-center justify-center flex-1 gap-2 py-4 text-xs font-bold tracking-widest text-white uppercase transition-colors bg-black hover:bg-gray-800"
          >
            <FileText size={14} />
            Xem chi tiết đơn →
          </Link>
        </div>
      </div>
    </div>
  );
}
