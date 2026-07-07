"use client";
import {
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
  Star,
} from "lucide-react";
import Link from "next/link";
import ReviewDialog from "@/components/client/booking-detail/reviewdialog";
import StadiumInfoCard from "@/components/client/booking-detail/stadium-info-card";
import PaymentSummary from "@/components/client/booking-detail/payment-summary";
import ConfirmDeleteDialog from "@/components/client/booking-detail/confirm-delete-dialog";
import useBookingDetail from "@/hooks/useBookingDetail";
import { BookingData } from "@/app/booking/detail/[id]/types";

type BookingStatus = "pending" | "confirmed" | "cancelled";

const STATUS_MAP: Record<
  BookingStatus,
  {
    label: string;
    icon: React.ReactNode; // là bất kỳ thứ gì react render được JSX/render UI thì dùng
    cls: string;
    message: string;
  }
> = {
  pending: {
    label: "Chờ xác nhận",
    icon: <Hourglass size={12} />,
    cls: "bg-yellow-400 text-black",
    message: "Đơn hàng của bạn đã được tiếp nhận",
  },
  confirmed: {
    label: "Đã xác nhận",
    icon: <CheckCircle2 size={12} />,
    cls: "bg-black text-white",
    message: "Người bán đã xác nhận đơn hàng",
  },
  cancelled: {
    label: "Đã huỷ",
    icon: <XCircle size={12} />,
    cls: "bg-red-600 text-white",
    message: "Đơn hàng đã bị hủy",
  },
};

type Props = {
  data: BookingData;
  myReview: any;
};

export default function BookingDetail({
  data,
  myReview: initialReview,
}: Props) {
  const booking = data?.result;
  const stadium = data?.stadiumBooking;

  const {
    myReview,
    isCancelling,
    reviewOpen,
    setReviewOpen,
    rating,
    setRating,
    comment,
    setComment,
    isEditing,
    setIsEditing,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    handleReviewCreate,
    handleEditReview,
    handleReviewUpdate,
    handleDeleteReview,
    handleCancel,
  } = useBookingDetail({
    initialReview,
    bookingId: booking?.id,
  });

  const status = STATUS_MAP[booking?.status] ?? STATUS_MAP["pending"];
  const isCancelled = booking?.status === "cancelled";

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-5xl px-6 py-10 mx-auto">
        {/* Page title row */}
        <div className="flex items-start justify-between mb-8 ">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-[#1b1b1b]  uppercase">
              Chi tiết đơn đặt
            </h1>
            <p className="mt-1 text-sm  text-[#1b1b1b] uppercase">Mã đơn: #</p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-medium uppercase  px-3 py-1.5 ${status.cls}`}
          >
            {status.icon}
            {status.label}
          </span>
        </div>

        <div className="flex flex-col gap-5 ">
          {/* Stadium info */}

          <StadiumInfoCard data={data} stadium={stadium} />

          {/* Booking details */}
          <div className="flex flex-col gap-5 md:flex-row md:justify-center">
            <div className="bg-white w-full md:w-[50%] border border-gray-200">
              <div className="px-5 py-3 bg-black">
                <p className="text-sm font-medium  text-white uppercase">
                  Thông tin đặt sân
                </p>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm  text-[#1b1b1b] uppercase">
                    <Hash size={12} />
                    Mã đơn
                  </div>
                  <span className="text-sm font-medium  text-black">
                    #{booking?.id}
                  </span>
                </div>

                <div className="border-t border-gray-200 border-dashed" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm  text-[#1b1b1b] uppercase">
                    <Calendar size={12} />
                    Ngày đặt
                  </div>
                  <span className="text-sm font-medium tracking-wide text-black uppercase">
                    Thứ {stadium?.day_of_week + 1}{" "}
                    {
                      new Date(booking?.booking_date)
                        .toISOString()
                        .split("T")[0]
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm  text-[#1b1b1b] uppercase">
                    <Clock size={12} />
                    Khung giờ
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium uppercase  border border-black px-3 py-1 text-black">
                    {stadium?.start_time} – {stadium?.end_time}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm  text-[#1b1b1b] uppercase">
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
            <div className="bg-white w-full md:w-[50%] border border-gray-200">
              <div className="px-5 py-3 bg-black">
                <p className="text-sm font-medium  text-white uppercase">
                  Thông tin người đặt
                </p>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm  text-[#1b1b1b] uppercase">
                    <User size={12} />
                    Họ và tên
                  </div>
                  <span className="text-sm font-medium text-black">
                    {booking?.full_name}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm  text-[#1b1b1b] uppercase">
                    <Mail size={12} />
                    Email
                  </div>
                  <span className="text-sm text-black">{booking?.email}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm  text-[#1b1b1b] uppercase">
                    <Phone size={12} />
                    Số điện thoại
                  </div>
                  <span className="text-sm text-black">{booking?.phone}</span>
                </div>

                {booking?.note && (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm  text-[#1b1b1b] uppercase shrink-0">
                      Ghi chú
                    </div>
                    <span className="text-sm text-right text-gray-600">
                      {booking?.note}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tổng thanh toán */}

          <PaymentSummary booking={booking} />
          {/* Đánh giá trải nghiệm */}
          <div className="border border-gray-200">
            <div className="px-5 py-3 bg-black">
              <p className="text-sm font-medium  text-white uppercase">
                {myReview ? "Đánh giá của bạn" : "Đánh giá trải nghiệm"}
              </p>
            </div>
            {myReview ? (
              <div className="flex flex-col gap-3 px-5 py-6 bg-white">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`w-5 h-5 ${
                          index < (myReview.rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-200 fill-transparent"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleEditReview}
                      className="text-xs font-medium uppercase  text-black underline underline-offset-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => setConfirmDeleteOpen(true)}
                      className="text-xs font-medium uppercase  text-[#f30000] underline underline-offset-2"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{myReview.comment}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 px-5 py-10 text-center bg-white">
                <Star className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                <div>
                  <h2 className="text-sm font-medium tracking-wide text-black uppercase">
                    Bạn chưa đánh giá về sân này
                  </h2>
                  <p className="max-w-sm mt-1 text-sm text-gray-500">
                    Hãy chia sẻ trải nghiệm của bạn để giúp mọi người có lựa
                    chọn tốt nhất nhé
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setRating(3);
                    setComment("");
                    setReviewOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 mt-1 text-sm font-medium  text-white uppercase transition-colors bg-black hover:bg-gray-800"
                >
                  <Star size={14} />
                  Đánh giá ngay
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-5">
          <Link
            href="/"
            className="flex items-center justify-center flex-1 
            gap-2 py-4 text-sm font-medium  text-black uppercase transition-all border-2 border-black hover:bg-black hover:text-white"
          >
            <Home size={14} />
            Trang chủ
          </Link>
          <button
            onClick={handleCancel}
            disabled={isCancelled}
            className={`flex items-center justify-center flex-1 gap-2 py-4 text-sm font-medium  uppercase transition-colors
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

      {/* Dialog */}

      <ReviewDialog
        reviewOpen={reviewOpen}
        setReviewOpen={setReviewOpen}
        setRating={setRating}
        setComment={setComment}
        comment={comment}
        rating={rating}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
        handleReviewUpdate={handleReviewUpdate}
        handleReviewCreate={handleReviewCreate}
      />

      <ConfirmDeleteDialog
        confirmDeleteOpen={confirmDeleteOpen}
        setConfirmDeleteOpen={setConfirmDeleteOpen}
        handleDeleteReview={handleDeleteReview}
      />
    </div>
  );
}
