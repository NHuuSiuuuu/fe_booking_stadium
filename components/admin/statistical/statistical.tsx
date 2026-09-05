"use client";

import { StatCard } from "./stat-card";
import { RevenueChart } from "./revenue-chart";
import { BookingChart } from "./booking-chart";
import { MostUsedStadiumsTable } from "./most-used-stadiums-table";
import {
  Activity,
  BarChart3,
  ClipboardCheck,
  CreditCard,
  Download,
  TrendingUp,
} from "lucide-react";

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

type StatusSummaryProps = {
  data: {
    status: "pending" | "confirmed" | "completed" | "cancelled" | string;
    total_bookings: number;
    total_revenue: number;
  }[];
  message: string;
  status: string;
};

type PaymentSummaryProps = {
  data: {
    payment_method: string;
    payment_status: string;
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
  StatusSummary: StatusSummaryProps;
  PaymentSummary: PaymentSummaryProps;
  BookingsExportUrl: string;
};

const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

const paymentMethodLabels: Record<string, string> = {
  cash: "Tiền mặt",
  online: "Online",
};

const paymentStatusLabels: Record<string, string> = {
  paid: "Đã thanh toán",
  unpaid: "Chưa thanh toán",
  refunded: "Đã hoàn tiền",
};

function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value) || 0);
}

export default function Statistical({
  StatisticsOverview,
  BookingByMonth,
  TopStadiums,
  StatusSummary,
  PaymentSummary,
  BookingsExportUrl,
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
        <a
          href={BookingsExportUrl}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-100"
        >
          <Download className="h-4 w-4" />
          Tải báo cáo CSV
        </a>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-lg border border-gray-200/60 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/50 px-5 py-4">
            <ClipboardCheck className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-semibold text-gray-900">
              Trạng thái đơn đặt
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {StatusSummary.data.map((item) => (
              <div
                key={item.status}
                className="grid grid-cols-[1fr_auto] gap-4 px-5 py-4"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {statusLabels[item.status] ?? item.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    {Number(item.total_bookings).toLocaleString("vi-VN")} đơn
                  </p>
                </div>
                <div className="text-right font-semibold text-gray-900">
                  {formatCurrency(item.total_revenue)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-gray-200/60 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/50 px-5 py-4">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">
              Phương thức thanh toán
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {PaymentSummary.data.map((item) => (
              <div
                key={`${item.payment_method}-${item.payment_status}`}
                className="grid grid-cols-[1fr_auto] gap-4 px-5 py-4"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {paymentMethodLabels[item.payment_method] ??
                      item.payment_method}
                  </p>
                  <p className="text-sm text-gray-500">
                    {paymentStatusLabels[item.payment_status] ??
                      item.payment_status}
                    {" · "}
                    {Number(item.total_bookings).toLocaleString("vi-VN")} đơn
                  </p>
                </div>
                <div className="text-right font-semibold text-gray-900">
                  {formatCurrency(item.total_revenue)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
