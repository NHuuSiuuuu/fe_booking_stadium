"use client";
import { Star } from "lucide-react";
// Dùng để bỏ qua lỗi type của @splidejs/react-splide
// @ts-expect-error
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import ReviewCard from "@/components/client/reviews/review-card";

type statisticsRes = [
  {
    rating: number;
    count: number;
  },
];

type reviewsRes = [
  {
    id: number;
    user_id: number;
    stadium_id: number;
    booking_id: number;
    rating: number;
    comment: string;
    created_at: Date;
    update_at: Date;
    fullname: string;
  },
];

type Props = {
  avg_rating: number;
  ratingStatistics: statisticsRes;
  total_reviews: number;
  reviews: reviewsRes;
  currentUserId?: number | null;
};

export default function ReviewSection({
  ratingStatistics,
  avg_rating,
  total_reviews,
  reviews,
  currentUserId,
}: Props) {
  console.log("total_reviews", total_reviews);
  console.log("reviews", reviews);
  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-10">
      {/* Header */}

      {total_reviews == 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <Star className="mb-4 h-12 w-12 text-gray-300" />

          <h3 className="text-lg font-semibold text-gray-800">
            Chưa có đánh giá nào
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Hãy là người đầu tiên chia sẻ trải nghiệm của bạn về sân này.
          </p>

          <button className="mt-6 rounded bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80">
            Viết đánh giá
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {ratingStatistics.map((item) => (
            <div key={item.rating} className="flex items-center gap-4">
              <span className="w-10 text-sm font-medium inline-flex items-center">
                {item.rating}{" "}
                <Star className="size-[10px] text-yellow-400 fill-yellow-400" />
              </span>

              <div className="h-2 flex-1 overflow-hidden  bg-gray-200">
                <div
                  className="h-full rounded-full bg-black"
                  style={{
                    width: `${(item.count / total_reviews) * 100}%`,
                  }}
                />
              </div>

              <span className="w-10 text-right text-sm text-gray-500">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Reviews */}
      {reviews.length === 1 ? (
        <ReviewCard currentUserId={currentUserId} review={reviews[0]} />
      ) : (
        <div className="mt-8 space-y-5">
          <Splide
            options={{
              rewind: true, // đi đến cuối sẽ dừng
              // type: "slide",
              // rewind: true, // đi đến cuối sẽ dừng
              interval: 9000, // khoảng thời gian chuyển slide: 3s
              arrows: false, // nút bấm
              pagination: true,

              type: "loop",
              autoplay: true,
              speed: 800,
              perMove: 1, // mỗi lần chuyển bnh slide
              perPage: 2, // hiển thị bao nhiêu sản phẩm tren màn hình
              flickPower: 3000,
              gap: 10,
              breakpoints: {
                1280: { perPage: 2, pagination: true }, // >=1280

                1024: { perPage: 2, pagination: true }, // >=1024 = md
                768: {
                  perPage: 2,
                  arrows: false,
                }, // <1024
              },
            }}
          >
            {reviews.map((review) => (
              <SplideSlide key={review.id}>
                <div className=" border h-[240px]  p-4 sm:p-6 relative">
                  <div className="flex flex-col  sm:gap-0 gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {/* Thông tin người đánh giá */}
                    <div className="flex gap-3 sm:gap-4">
                      <div className="flex justify-center items-center gap-2">
                        <div className="flex h-10 w-10 shrink-0 items-center rounded-full justify-center bg-black text-base font-black text-white sm:h-12 sm:w-12 sm:text-lg">
                          {review.fullname?.charAt(0)?.toUpperCase() ?? "?"}
                        </div>
                        <div className="block">
                          <h3 className="text-sm font-semibold sm:text-base">
                            {review.fullname}
                          </h3>
                          <p className="text-[10px] text-gray-500 sm:text-sm">
                            {new Date(review.created_at).toLocaleString(
                              "vi-VN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 sm:justify-end">
                      {[...Array(review.rating)].map((_, index) => (
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

                  {/* Nội dung đánh giá */}
                  <p className="mt-4 text-sm leading-6 line-clamp-3 text-gray-700  sm:mt-5 sm:text-base sm:leading-7">
                    {review.comment}
                  </p>

                  {review.update_at !== null ? (
                    <p className="mt-4 text-xs text-[#1b1b1b] sm:mt-5 sm:text-sm">
                      update
                      {new Date(review.update_at).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  ) : (
                    ""
                  )}

                  {review.user_id === currentUserId &&
                    currentUserId != null && (
                      <div className="absolute bottom-4 right-4 flex items-center gap-3">
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">
                          Sửa
                        </button>
                        <button className="text-sm font-medium text-[#f30000] hover:text-red-700 transition">
                          Xóa
                        </button>
                      </div>
                    )}
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </div>
      )}
    </section>
  );
}
