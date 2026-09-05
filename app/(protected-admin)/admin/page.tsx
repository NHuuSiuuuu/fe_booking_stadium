import Statistical from "@/components/admin/statistical/statistical";
import envConfig from "@/config";
import { cookies } from "next/headers";

export default async function page() {
  const cookeStore = await cookies();
  const access_token = cookeStore.get("access_token")?.value;
  const refresh_token = cookeStore.get("refresh_token")?.value;

  const cookieHeader = [
    access_token ? `access_token=${access_token}` : "",
    refresh_token ? `refresh_token=${refresh_token}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  async function fetchRequiredStatistics(path: string) {
    const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}${path}`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Không tải được dữ liệu thống kê");
    }

    return res.json();
  }

  async function fetchOptionalStatistics(path: string) {
    const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}${path}`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return { data: [], message: "Không có dữ liệu", status: "fallback" };
    }

    return res.json();
  }

  const [
    StatisticsOverview,
    BookingByMonth,
    TopStadiums,
    StatusSummary,
    PaymentSummary,
  ] = await Promise.all([
    fetchRequiredStatistics("/statistics/overview"),
    fetchRequiredStatistics("/statistics/bookings-by-month"),
    fetchRequiredStatistics("/statistics/top-stadiums"),
    fetchOptionalStatistics("/statistics/status-summary"),
    fetchOptionalStatistics("/statistics/payment-summary"),
  ]);

  const BookingsExportUrl = "/api/statistics/bookings-export.csv";

  return (
    <Statistical
      StatisticsOverview={StatisticsOverview}
      BookingByMonth={BookingByMonth}
      TopStadiums={TopStadiums}
      StatusSummary={StatusSummary}
      PaymentSummary={PaymentSummary}
      BookingsExportUrl={BookingsExportUrl}
    />
  );
}
