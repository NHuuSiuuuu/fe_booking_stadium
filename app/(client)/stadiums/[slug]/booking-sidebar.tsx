"use client";

import envConfig from "@/config";
import { AlarmClock, Calendar, CircleDollarSign } from "lucide-react";
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

export default function BookingSidebar({
  initialStadium,
  initialPriceConfig,
}: Props) {
  const router = useRouter();

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
    if (!selectedDate || !stadium?.id) {
      return;
    }

    const socket = io(`${envConfig.NEXT_PUBLIC_SOCKET_URL}`);

    socket.on("connect", () => {
      setSocketId(socket.id);
      socket.emit("join-stadium", stadium.id);

      socket.on("sold-held", (data) => {
        // console.log("Khóa các slot", data);
        setHoldSlots((prev) => [...prev, Number(data.price_config_id)]);
      });

      socket.on("sold-released", (data) => {
        setHoldSlots((prev) => prev.filter((id) => id !== Number(data.price_config_id)));
      });
    });

    return () => {
      socket.emit("leave-stadium", stadium.id);
      socket.off("sold-held");
      socket.off("sold-released");
      socket.disconnect();
      setSocketId(null);
    };
  }, [selectedDate, stadium.id]);

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

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot) return;

    let currentUser = user;
    if (!currentUser) {
      try {
        const res = await fetch(`/api/auth/me`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          currentUser = data.user;
          setUser(data.user);
        }
      } catch (error) {
        console.error(error);
      }
    }

    // Next.js không truyền state qua navigate như react-router
    // → lưu vào sessionStorage rồi đọc ở trang checkout
    sessionStorage.setItem(
      "checkoutData",
      JSON.stringify({
        slug: stadium?.slug,
        slot: selectedSlot,
        date: selectedDate.toISOString(),
        user: currentUser,
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
    // <div className="max-w-[1200px] mx-auto px-8 py-10">
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Cột phải */}
      <div className="w-full lg:w-[340px] space-y-4">
        <div className="p-4 border-1 ">
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
              Tháng {currentMonth.getMonth() + 1} / {currentMonth.getFullYear()}
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
              <div key={i} className="text-center text-[11px] font-bold  py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {days.map((date, index) => {
              if (!date) return <div key={index} className="aspect-square" />;
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
              <p className="text-[10px] font-black uppercase tracking-widest text-[#1b1b1b] mb-3">
                Khung giờ - {DAY_MAP[selectedDate.getDay()]}{" "}
                {selectedDate.getDate()}/{selectedDate.getMonth() + 1}
              </p>

              {slotsOfDay.length === 0 ? (
                <p className="py-4 text-sm text-center text-[#1b1b1b]">
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
            <p className="text-[10px] font-black uppercase tracking-widest text-[#1b1b1b] mb-3">
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
    // </div>
  );
}
