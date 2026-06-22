import BookingSidebar from "@/app/(client)/stadiums/[slug]/booking-sidebar";
import ImageGallery from "@/app/(client)/stadiums/[slug]/image-gallery";
import { ChevronRight, Clock } from "lucide-react";
import Link from "next/link";

type Stadium = {
  id: number;
  name: string;
  slug: string;
  address: string;
  description: string;
  type: number;
  thumbnail: string[];
  utility: string[];
};
type PriceConfig = {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  price: number;
};

const DAY_MAP: Record<number, string> = {
  0: "Chủ nhật",
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
};
type Props = { initialStadium: Stadium; initialPriceConfig: PriceConfig[] };

export default function StadiumDetail({
  initialStadium,
  initialPriceConfig,
}: Props) {
  const stadium = initialStadium;
  const priceConfig = initialPriceConfig;

  const daysPriceConfig = [
    ...new Set(priceConfig?.map((item) => item.day_of_week)),
  ];

  if (!stadium) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm font-bold uppercase tracking-widest text-red-400">
          Không tìm thấy sân
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="flex items-center max-w-6xl gap-2 px-4 py-3 mx-auto text-sm font-bold  text-gray-500 uppercase sm:px-6">
          <Link href="/" className="transition-colors hover:text-black">
            Trang chủ
          </Link>
          <ChevronRight className="text-gray-500  size-4" />

          <span className="text-black">{stadium?.name}</span>
        </div>
      </div>

      {/*  */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Cột trái */}
          <div className="flex-1 space-y-8">
            <ImageGallery thumbnails={stadium.thumbnail} type={stadium.type} />
            {/* Thông tin sân */}
            <div>
              <h1 className="text-2xl font-black tracking-tight text-black uppercase sm:text-2xl">
                {stadium?.name}
              </h1>
              <p className="mt-1 text-xs font-bold tracking-widest text-gray-400 uppercase">
                📍 {stadium?.address}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {stadium?.description}
              </p>
            </div>
            {/* Tiện ích */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                Tiện ích
              </p>
              <div className="flex flex-wrap gap-2">
                {stadium?.utility.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border-2 border-gray-900 text-gray-900"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Bảng giá */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                Bảng giá
              </p>
              <div className="space-y-3">
                {daysPriceConfig.map((day, index) => (
                  <div
                    key={index}
                    className="overflow-hidden border-2 border-gray-100"
                  >
                    <div className="px-4 py-2 bg-black">
                      <span className="text-[11px] font-black uppercase tracking-widest text-white">
                        {DAY_MAP[day]}
                      </span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {priceConfig
                        .filter((item) => item.day_of_week === day)
                        .map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between px-4 py-3"
                          >
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                              <Clock className="size-3.5" />
                              <span>
                                {item?.start_time} — {item?.end_time}
                              </span>
                            </div>
                            <span className="text-sm font-black text-red-600">
                              {new Intl.NumberFormat("vi-VN").format(
                                item?.price,
                              )}
                              đ
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cột phải */}
          <BookingSidebar
            initialStadium={stadium}
            initialPriceConfig={priceConfig}
          />
        </div>
      </div>
    </div>
  );
}
