"use client";

import { StatCard } from "./stat-card";
import { RevenueChart } from "./revenue-chart";
import { BookingChart } from "./booking-chart";
import { MostUsedStadiumsTable } from "./most-used-stadiums-table";
import { BarChart3, TrendingUp, Activity, Users, Filter } from "lucide-react";

// 1. API Tổng quan thống kê
type StatisticsOverviewProps = {
  data: {
    total_bookings: number;
    total_revenue: number;
    average_revenue: number;
    booking_growth: number;
    revenue_growth: number;
    average_revenue_growth: number;
  };
  message: string;
};

type BookingByMonthProps = {
  data: { total_bookings: number; month: string; total_revenue: number }[];
  message: string;
  status: string;
};

type TopStadiumsProps = {
  data: {
    name: string;
    total_bookings: number;
    total_revenue: number;
  }[];
  message: string;
  status: string;
};

type StatisticalProps = {
  StatisticsOverview: StatisticsOverviewProps;
  BookingByMonth: BookingByMonthProps;
  TopStadiums: TopStadiumsProps;
};

export default function Statistical({
  StatisticsOverview,
  BookingByMonth,
  TopStadiums,
}: StatisticalProps) {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900"> Thống kê</h1>
          <p className="text-gray-600 mt-2">
            Theo dõi hiệu suất kinh doanh sân thể thao
          </p>
        </div>
      </div>

      {/* Thống kê*/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Tổng lượt đặt sân tháng này"
          value={StatisticsOverview.data.total_bookings.toLocaleString("vi-VN")}
          icon={Activity}
          description="So với tháng trước"
          trend={{
            value: StatisticsOverview.data.booking_growth,
            isPositive:
              StatisticsOverview.data.booking_growth > 0 ? true : false,
          }}
        />
        <StatCard
          title="Tổng doanh thu tháng này"
          value={`${(StatisticsOverview.data.total_revenue / 1000000).toFixed(2)}M`}
          icon={TrendingUp}
          description="So với tháng trước"
          trend={{
            value: StatisticsOverview.data.revenue_growth,
            isPositive:
              StatisticsOverview.data.revenue_growth > 0 ? true : false,
          }}
        />
        <StatCard
          title="Doanh thu trung bình tháng này"
          value={`${(StatisticsOverview.data.average_revenue / 1000).toFixed(0)}K`}
          icon={BarChart3}
          description="So với tháng trước"
          trend={{
            value: StatisticsOverview.data.average_revenue_growth,
            isPositive:
              StatisticsOverview.data.average_revenue_growth > 0 ? true : false,
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Lượt đặt theo tháng */}
        <BookingChart BookingByMonth={BookingByMonth} />

        {/* Doanh thu 12 tháng gần nhất */}
        <RevenueChart BookingByMonth={BookingByMonth} />
      </div>

      {/* Top sân được đặt nhiều nhất */}
      <div className="mb-8">
        <MostUsedStadiumsTable TopStadiums={TopStadiums} />
      </div>
    </div>
  );
}
