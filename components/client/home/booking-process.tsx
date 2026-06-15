"use client";

import { Search, CalendarDays, ClipboardCheck, Goal } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Tìm sân",
    description: "Lọc theo quận, loại sân hoặc tìm kiếm trên bản đồ.",
    icon: Search,
  },
  {
    number: "02",
    title: "Chọn khung giờ",
    description: "Xem lịch trống theo ngày và chọn thời gian phù hợp.",
    icon: CalendarDays,
  },
  {
    number: "03",
    title: "Xác nhận",
    description: "Điền thông tin và hoàn tất đặt sân chỉ trong vài giây.",
    icon: ClipboardCheck,
  },
  {
    number: "04",
    title: "Ra sân",
    description: "Nhận xác nhận và đến sân thi đấu đúng lịch.",
    icon: Goal,
  },
];

export default function BookingProcess() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 py-12 sm:px-6">
      <p className="text-[13px] font-bold uppercase text-slate-900 mb-1">
        Hướng dẫn
      </p>

      <h2 className="text-2xl font-bold text-slate-900 mb-1">
        Quy Trình Đặt Sân
      </h2>

      <p className="text-[13px] font-bold uppercase text-slate-400 mb-8">
        Chỉ 4 bước · Dưới 3 phút
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 border border-slate-200">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.number}
              className={`relative ${
                index !== steps.length - 1 ? "border-r border-slate-200" : ""
              } p-5 md:p-8 bg-white hover:bg-slate-50 transition-colors`}
            >
              {/* Số bước */}
              <div className="absolute top-4 right-4 text-4xl md:text-5xl font-black text-slate-900 ">
                {step.number}
              </div>

              {/* Icon */}
              <div className="mb-4">
                <Icon className="size-6 md:size-8 text-[#B4BCC9]" />
              </div>

              {/* Tiêu đề */}
              <h3 className="text-sm md:text-lg font-bold uppercase text-slate-900 mb-2">
                {step.title}
              </h3>

              {/* Mô tả */}
              <p className="text-[12px] md:text-sm text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
