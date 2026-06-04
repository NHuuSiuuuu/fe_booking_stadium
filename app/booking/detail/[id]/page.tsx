import BookingDetail from "@/app/booking/detail/[id]/booking-detail";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Chi tiết đặt sân",
  description: "Trang chi tiết đặt sân thành công",
};

export default function page() {
  return (
    <div>
      <BookingDetail />
    </div>
  );
}
