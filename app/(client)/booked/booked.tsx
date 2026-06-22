"use client";
import {
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  ChevronRight,
  FileText,
  Hourglass,
  CheckCircle2,
  XCircle,
  Inbox,
  Link,
} from "lucide-react";

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
    icon: <Hourglass size={16} />,
    cls: "bg-yellow-400 text-black",
  },
  confirmed: {
    label: "Đã xác nhận",
    icon: <CheckCircle2 size={16} />,
    cls: "bg-black text-white",
  },
  cancelled: {
    label: "Đã huỷ",
    icon: <XCircle size={16} />,
    cls: "bg-red-600 text-white",
  },
};

type ListBooked = {
  id: number;
  stadium_id: number;
  price_config_id: number;
  booking_date: Date;
  full_name: string;
  email: string;
  phone: number;
  note: string;
  payment_method: string;
  total_price: number;
  status: BookingStatus;
  created_at: string;
  payment_status: string;
  user_id: number;
  stadium_name: string;
  address: string;
  type: string;
  start_time: string;
  end_time: string;
};

type Props = {
  data: ListBooked[];
};

export default function Booked({ data }: Props) {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-[1200px]  px-4 md:px-8 py-10 mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black uppercase">
              Sân đã đặt
            </h1>
            <p className="mt-1 text-xs tracking-widest text-gray-900 uppercase">
              {data?.length ?? 0} đơn hàng
            </p>
          </div>
        </div>

        {/* Empty state */}
        {data?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-20 bg-white border border-gray-200">
            <Inbox size={40} className="text-gray-300" />
            <p className="text-xs tracking-widest text-gray-900 uppercase">
              Bạn chưa có đơn đặt sân nào
            </p>
            <Link
              href="/"
              className="px-6 py-3 mt-2 text-xs font-bold tracking-widest text-white uppercase transition-colors bg-black hover:bg-gray-800"
            >
              Tìm sân ngay →
            </Link>
          </div>
        )}

        {/* Booking list */}
        <div className="flex flex-col gap-4">
          {data?.map((booking) => {
            const status = STATUS_MAP[booking.status] ?? STATUS_MAP["pending"];
            return (
              <div
                key={booking.id}
                className="transition-colors bg-white border border-gray-200 hover:border-gray-400"
              >
                {/* Card top bar */}
                <div className="flex items-center justify-between px-5 py-3 bg-black">
                  <span className="text-xs font-bold tracking-widest text-white uppercase">
                    {/* #{booking.id?.slice(0, 8).toUpperCase()} */}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest px-2.5 py-1 ${status.cls}`}
                  >
                    {status.icon}
                    {status.label}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Stadium info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-medium tracking-tight text-black uppercase">
                          {booking.stadium_name}
                        </p>
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5">
                          Sân {booking.type}
                        </span>
                      </div>

                      <p className="flex items-center gap-1.5 text-xs text-gray-900 uppercase tracking-wider">
                        <MapPin size={11} />
                        {booking.address}
                      </p>

                      <div className="flex items-center gap-4 pt-1">
                        <p className="flex items-center gap-1.5 text-xs text-gray-900 uppercase tracking-wider">
                          <Calendar size={11} />
                          {
                            new Date(booking.booking_date)
                              .toISOString()
                              .split("T")[0]
                          }
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest border border-black px-2.5 py-0.5 text-black">
                          <Clock size={10} />
                          {booking.start_time} – {booking.end_time}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-900 uppercase tracking-wider">
                        <CreditCard size={11} />
                        {booking.payment_method}
                      </div>
                    </div>

                    {/* Price + action */}
                    <div className="flex flex-col items-end justify-between gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-gray-900 mb-0.5">
                          Tổng tiền
                        </p>
                        <p className="text-xl font-medium text-black">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(booking.total_price)}
                        </p>
                      </div>
                      <Link
                        to={`/booking-detail/${booking.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                      >
                        <FileText size={12} />
                        Chi tiết →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
