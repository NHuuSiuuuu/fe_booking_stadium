import { Star } from "lucide-react";

type Review = {
  id: number;
  user_id: number;
  stadium_id: number;
  booking_id: number;
  rating: number;
  comment: string;
  created_at: Date;
  update_at: Date;
  fullname: string;
};

type Props = {
  review: Review;
  currentUserId?: number | null;
};

export default function ReviewCard({ review, currentUserId }: Props) {
  console.log("review đay", review);
  const initial = review.fullname?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <div className="relative h-[200px] mt-6 border p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Người đánh giá */}
        {/* Avatar */}
        <div className="flex justify-start md:justify-center items-center gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center rounded-full justify-center bg-black text-base font-black text-white sm:h-12 sm:w-12 sm:text-lg">
            {initial}
          </div>
          <div className="block">
            <h3 className="text-sm font-semibold sm:text-base">
              {review.fullname}
            </h3>
            <p className="text-[10px] text-gray-500 sm:text-sm">
              {new Date(review.created_at).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex gap-1">
          {Array.from({ length: review.rating }).map((_, index) => (
            <Star
              key={index}
              size={16}
              className="sm:h-[18px] sm:w-[18px]"
              fill="#facc15"
              color="#facc15"
            />
          ))}
        </div>
      </div>

      {/* Nội dung */}
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-700 sm:mt-5 sm:text-base sm:leading-7">
        {review.comment}
      </p>

      {/* Update */}
      {review.update_at && (
        <p className="mt-4 text-xs text-[#1b1b1b] sm:text-sm">
          Đã chỉnh sửa:{" "}
          {new Date(review.update_at).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}

      {/* Action */}
      {/* {review.user_id === currentUserId && (
        // <div className="absolute bottom-4 right-4 flex gap-3">
        //   <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
        //     Sửa
        //   </button>

        //   <button className="text-sm font-medium text-[#f30000] hover:text-red-700">
        //     Xóa
        //   </button>
        // </div>
      )} */}
    </div>
  );
}
