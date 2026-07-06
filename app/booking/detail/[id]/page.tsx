import BookingDetail from "@/app/booking/detail/[id]/booking-detail";
import envConfig from "@/config";
import { Metadata } from "next";
import { cookies } from "next/headers";
export const metadata: Metadata = {
  title: "Chi tiết đặt sân",
  description: "Trang chi tiết đặt sân thành công",
};

export default async function page({ params }: any) {
  const { id } = await params;
  const cookieStore = await cookies();

  const bookingRes = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/booking/success/${id}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );
  if (!bookingRes.ok) {
    throw new Error("Lỗi fetch sân");
  }
  const booking = await bookingRes.json();
  const bookingId = booking.data?.result?.stadium_id;
  const myReviewRes = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/reviews/my-review/${bookingId}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );
  if (!myReviewRes.ok) {
    throw new Error("Lỗi fetch review");
  }
  const myReview = await myReviewRes.json();

  return (
    <>
      <BookingDetail data={booking.data} myReview={myReview.review} />
    </>
  );
}
