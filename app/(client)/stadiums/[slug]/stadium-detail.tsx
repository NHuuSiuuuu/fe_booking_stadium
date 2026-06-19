"use client";

import envConfig from "@/config";
import {
  AlarmClock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { io } from "socket.io-client";

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
type User = {
  id: number;
  fullname: string;
  email: string;
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
  const router = useRouter();

  const [activeImg, setActiveImg] = useState(0);
  // Lưu ngày
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // Lưu khung giờ
  const [selectedSlot, setSelectedSlot] = useState<PriceConfig | null>(null);
  // Lấy tháng hiện tại
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const stadium = initialStadium;
  const priceConfig = initialPriceConfig;
  const [bookedSlots, setBookedSlots] = useState<{
    booked: number[];
    holding: number[];
  }>({
    booked: [],
    holding: [],
  });

  // SLot mà mình giữ (khi ấn vào khung giờ)
  const [myHeldSlotId, setMyHeldSlotId] = useState<number | null>(null);

  // holdSlots chỉ chứa slot của người khác
  const [holdSlots, setHoldSlots] = useState<number[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [socketId, setSocketId] = useState<any>(null);
  // -------------------------------------------------------
  useEffect(() => {
    const socket = io(`${envConfig.NEXT_PUBLIC_SOCKET_URL}`);

    socket.on("connect", () => {
      setSocketId(socket.id);
      socket.emit("join-stadium", stadium.id);

      socket.on("sold-held", (data) => {
        // console.log("Khóa các slot", data);
        setHoldSlots((prev) => [...prev, Number(data.price_config_id)]);
      });

      socket.on("sold-released", (data) => {
        // console.log("Mở khóa cho slot:", data);
        setHoldSlots((prev) => prev.filter((id) => id != data.price_config_id));
      });
    });

    // Khi người dùng rời trang
    return () => {
      // console.log("cleanup");

      socket.emit("leave-stadium", stadium.id);
      socket.off("slot-held");
      socket.off("sold-released");
      socket.disconnect();
    };
  }, [stadium.id]);

  // Fetch slot đã được đặt
  useEffect(() => {
    if (!stadium?.id) return;
    if (!stadium?.id || !selectedDate) return;
    const dateStr = selectedDate.toISOString().split("T")[0]; // "2026-04-05"

    fetch(`/api/booking/booked-slots?stadium_id=${stadium.id}&date=${dateStr}`)
      .then((r) => r.json())
      .then((data) => setBookedSlots(data ?? []))
      .catch(console.error);
  }, [selectedDate, stadium?.id, socketId]);

  useEffect(() => {
    fetch(`/api/auth/me`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setUser(data.user))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!stadium?.id) return;
    if (!selectedDate || !stadium?.id || !selectedSlot?.id || !socketId) return;

    const dateStr = selectedDate.toISOString().split("T")[0]; // "2026-04-05"
    fetch(
      `/api/booking/hold-slot?stadium_id=${stadium.id}&date=${dateStr}&price_config_id=${selectedSlot?.id}&socket_id=${socketId}`,
      { credentials: "include" },
    )
      .then((r) => (r.ok ? r.json() : null))
      // .then((data) => console.log("Giữ chỗ thành công:", data))
      .catch(console.error);
  }, [selectedSlot?.id, socketId, selectedDate, stadium?.id]);

  // console.log("currentMonth", currentMonth);
  // console.log("priceConfig", priceConfig);

  // Lấy danh sách các ngày trong tuần kh bị trùng lặp
  // .map((item) => item.day_of_week) → [1, 1, 1, 6, 6]
  // new Set(...) → {1, 6} — loại trùng
  //  [...new Set(...)] → [1, 6]
  const daysPriceConfig = [
    ...new Set(priceConfig?.map((item) => item.day_of_week)),
  ];

  // Today
  const today = new Date();
  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Lấy danh sách ngày trong tháng
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Ngày đầu tiên của tháng
    const firstDay = new Date(year, month, 1);
    // Ngày cuối cùng của tháng
    const lastDay = new Date(year, month + 1, 0); // sang tháng sau - lấy ngày 0 -> quay về cuối tháng hiện tại
    const days = [];
    // Ngày đầu trong tuần - Lấy thứ
    const startDayOfWeek = (firstDay.getDay() + 6) % 7;

    // Thêm ô trống null vào đầu tháng để ngày đầu rơi vào đúng thứ trong tuần
    for (let i = 0; i < startDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++)
      days.push(new Date(year, month, i));
    return days;
  };

  const days = getDaysInMonth();

  const slotsOfDay = priceConfig?.filter(
    (item) => item.day_of_week === selectedDate?.getDay(),
  );
  // console.log("selectedSlot", selectedSlot);
  // console.log("stadium", stadium);
  // console.log("priceConfig", priceConfig);
  // console.log("selectedDate?.getDay()", selectedDate?.getDay());

  const handleBooking = () => {
    if (!selectedDate || !selectedSlot) return;
    // Next.js không truyền state qua navigate như react-router
    // → lưu vào sessionStorage rồi đọc ở trang checkout
    sessionStorage.setItem(
      "checkoutData",
      JSON.stringify({
        slug: stadium?.slug,
        slot: selectedSlot,
        date: selectedDate.toISOString(),
        user,
      }),
    );
    router.push("/checkout");
  };

  const handleSelectSlot = (slot: PriceConfig) => {
    if (myHeldSlotId) {
      setHoldSlots((prev) => prev.filter((id) => id !== myHeldSlotId));
    }

    setMyHeldSlotId(slot.id);
    setSelectedSlot(slot);
  };
  if (!stadium) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm font-bold uppercase tracking-widest text-red-400">
          Không tìm thấy sân
        </p>
      </div>
    );
  }
  // console.log("bookedSlots dmmmm", selectedSlot?.id);
  // console.log("holdSlots", holdSlots);
  // console.log("myHeldSlotId", myHeldSlotId);

  // console.log("socketId", socketId);
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
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Cột trái */}
          <div className="flex-1 space-y-8">
            <div className="space-y-1">
              <div className="relative h-[300px] sm:h-[420px] overflow-hidden">
                <img
                  className="object-cover w-full h-full"
                  src={stadium?.thumbnail?.[activeImg]}
                  alt=""
                />

                <div className="absolute top-4 right-4 bg-black text-white text-[12px] font-black uppercase  px-3 py-1.5">
                  Sân {stadium?.type}v{stadium?.type}
                </div>
                <button
                  onClick={() =>
                    setActiveImg(
                      (p) =>
                        (p - 1 + (stadium?.thumbnail.length ?? 0)) %
                        (stadium?.thumbnail.length ?? 1),
                    )
                  }
                  className="absolute flex items-center justify-center w-8 h-8 text-white -translate-y-1/2 rounded-full left-3 top-1/2 bg-black/50 hover:bg-black/70"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  onClick={() =>
                    setActiveImg(
                      (p) => (p + 1) % (stadium?.thumbnail.length ?? 0),
                    )
                  }
                  className="absolute flex items-center justify-center w-8 h-8 text-white -translate-y-1/2 rounded-full right-3 top-1/2 bg-black/50 hover:bg-black/70"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
              {/* Preview Thumbnail */}
              <div className="grid grid-cols-4 gap-1">
                {stadium?.thumbnail?.map((item, index) => (
                  <button
                    key={index}
                    className={`h-[80px] overflow-hidden border-2 transition-all duration-300`}
                  >
                    <img
                      src={item}
                      alt=""
                      onClick={() => setActiveImg(index)}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>

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
          <div className="w-full lg:w-[340px] space-y-4">
            <div className="p-4 border-2 border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() - 1,
                      ),
                    )
                  }
                  className="text-xs  font-bold uppercase tracking-wider border-2 border-gray-900 px-3 py-1.5 hover:bg-black hover:text-white transition"
                >
                  ←
                </button>

                <span className="text-xs font-black tracking-widest uppercase">
                  Tháng {currentMonth.getMonth() + 1} /{" "}
                  {currentMonth.getFullYear()}
                </span>
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1,
                      ),
                    )
                  }
                  className="text-xs font-bold uppercase tracking-wider border-2 border-gray-900 px-3 py-1.5 hover:bg-black hover:text-white transition"
                >
                  →
                </button>
              </div>

              {/* Lịch */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, i) => (
                  <div
                    key={i}
                    className="text-center text-[11px] font-bold  py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {days.map((date, index) => {
                  if (!date)
                    return <div key={index} className="aspect-square" />;
                  const isSelected =
                    selectedDate &&
                    date.getDate() === selectedDate.getDate() &&
                    date.getMonth() === selectedDate.getMonth() &&
                    date.getFullYear() === selectedDate.getFullYear();
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedSlot(null);
                        setMyHeldSlotId(null); // reset
                      }}
                      className={`aspect-square text-xs font-bold transition-all
                    ${isSelected ? "bg-black text-white" : isToday(date) ? "bg-red-500 text-white" : "hover:bg-gray-100 text-gray-700"}`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              {selectedDate && (
                <div className="mt-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                    Khung giờ - {DAY_MAP[selectedDate.getDay()]}{" "}
                    {selectedDate.getDate()}/{selectedDate.getMonth() + 1}
                  </p>

                  {slotsOfDay.length === 0 ? (
                    <p className="py-4 text-sm text-center text-gray-400">
                      Không có khung giờ nào
                    </p>
                  ) : (
                    <div>
                      {slotsOfDay?.map((slot) => {
                        // Kiểm tra slot đã được đặt chưa
                        const isBooked = bookedSlots?.booked?.includes(slot.id);

                        // Kiểm tra người khsc đang tạmm giữ không
                        const isHeldByOther =
                          (bookedSlots?.holding?.includes(slot.id) &&
                            myHeldSlotId !== slot.id) ||
                          (holdSlots?.includes(slot.id) &&
                            myHeldSlotId !== slot.id);

                        const isLocked = isBooked || isHeldByOther;
                        return (
                          <button
                            key={slot.id}
                            disabled={isLocked}
                            onClick={() => !isLocked && handleSelectSlot(slot)}
                            className={`w-full flex justify-between items-center px-4 py-3 border-2 transition
                       ${
                         isLocked
                           ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50"
                           : selectedSlot?.id === slot.id
                             ? "border-black bg-black text-white"
                             : "border-gray-200 hover:border-black"
                       }`}
                          >
                            <span className="text-sm">
                              {slot.start_time} - {slot.end_time}
                            </span>

                            <span
                              className={`text-sm font-bold ${isBooked ? "text-gray-300" : "text-orange-400"}`}
                            >
                              {isBooked
                                ? "Đã đặt"
                                : isHeldByOther
                                  ? "Đang xem" // ← thay "Đã đặt" bằng "Đang xem"
                                  : `${new Intl.NumberFormat("vi-VN").format(slot.price)}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
            {selectedDate && selectedSlot && (
              <div className="p-4 border-2 border-black">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                  Xác nhận đặt sân
                </p>
                <div className="mb-4 text-sm font-medium text-gray-700 ">
                  <p className="flex items-center gap-1.5">
                    <Calendar className="size-4" />
                    {selectedDate.toLocaleDateString("vi-VN")}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <AlarmClock className="size-4" />
                    {selectedSlot.start_time} — {selectedSlot.end_time}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CircleDollarSign className="size-4" />
                    {new Intl.NumberFormat("vi-VN").format(selectedSlot.price)}đ
                  </p>
                </div>
                <button
                  onClick={handleBooking}
                  className="w-full py-3.5 bg-black text-white text-sm font-black uppercase tracking-widest hover:bg-gray-900 transition"
                >
                  Đặt sân ngay →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
