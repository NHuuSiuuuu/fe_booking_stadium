import BookingSuccess from "@/app/booking/success/[id]/booking-success";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Đăt sân thành công",
  description: "Trang đặt sân thành công",
};

export default function page() {
  return <BookingSuccess />;
}
