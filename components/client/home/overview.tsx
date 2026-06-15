"use client";

import { CalendarCheck, Goal, Star, Users } from "lucide-react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export default function Overview() {
  const { ref, inView } = useInView({
    triggerOnce: true, // chỉ chạy 1 lần
    threshold: 0.3, // hiện 30% section thì kích hoạt
  });
  return (
    <section ref={ref} className="max-w-[1200px] mx-auto px-4 py-10 sm:px-6">
      <p className="text-[13px] font-bold uppercase text-slate-900 mb-1">
        Thống kê
      </p>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">
        Tổng Quan Hệ Thống
      </h2>
      <p className="text-[13px] font-bold uppercase text-slate-400 mb-6">
        Cập nhật theo thời gian thực
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 border border-slate-200 ">
        <div
          className={` p-5 md:p-8 bg-white transition-colors hover:bg-slate-50 border-r border-slate-200
              `}
        >
          <div className="text-center text-[11px] md:text-[14px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            <Goal /> Sân bóng
          </div>
          <div className="text-center text-2xl md:text-4xl font-black text-slate-900 leading-none mb-3">
            {inView ? (
              <CountUp
                start={0}
                end={10}
                duration={2.75}
                decimals={0}
              ></CountUp>
            ) : (
              "0"
            )}
          </div>
          <div className="text-center text-[11px] md:text-[13px] font-medium text-slate-600">
            +3 tháng này
          </div>
        </div>

        {/* Người dùng  */}
        <div
          className={` p-5 md:p-8 bg-white transition-colors hover:bg-slate-50 border-r border-slate-200`}
        >
          <div className="text-center text-[11px] md:text-[14px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            <Users /> Người dùng
          </div>

          <div className="text-center text-2xl md:text-4xl font-black text-slate-900 leading-none mb-3">
            {inView ? (
              <CountUp
                start={0}
                end={8930}
                duration={2.75}
                separator="."
              ></CountUp>
            ) : (
              "0"
            )}
          </div>

          <div className="text-center text-[11px] md:text-[13px] font-medium text-slate-600">
            +12% tháng này
          </div>
        </div>

        {/* Lượt đặt sân */}
        <div
          className={`
              p-5 md:p-8
              bg-white
              transition-colors
              hover:bg-slate-50
              border-r border-slate-200
              `}
        >
          <div className="text-[11px] text-center text-center md:text-[14px] font-bold  uppercase tracking-widest text-slate-500 mb-2">
            <CalendarCheck /> Lượt đặt sân
          </div>

          <div className="text-2xl md:text-4xl text-center font-black text-slate-900 leading-none mb-3">
            {inView ? (
              <CountUp
                start={0}
                end={1240}
                duration={2.75}
                separator="."
              ></CountUp>
            ) : (
              "0"
            )}
          </div>

          <div className="text-[11px] text-center text-center md:text-[13px] font-medium text-slate-600">
            +24% tháng này
          </div>
        </div>

        {/* Đánh giá */}
        <div
          className={` p-5 md:p-8 bg-white transition-colors hover:bg-slate-50`}
        >
          <div className="text-[11px] text-center md:text-[14px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            <Star /> Đánh giá TB
          </div>

          <div className="text-2xl text-center md:text-4xl font-black text-slate-900 leading-none mb-3">
            {inView ? (
              <CountUp
                start={0}
                end={4.8}
                duration={2.75}
                //   separator="."
                decimals={1}
              ></CountUp>
            ) : (
              "0"
            )}
          </div>

          <div className="text-[11px] text-center md:text-[13px] font-medium text-slate-600">
            Từ 2.100 đánh giá
          </div>
        </div>
      </div>
    </section>
  );
}
