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

  const fetchStatistics = async (path: string) => {
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
  };

  const [
    StatisticsOverview,
    BookingByMonth,
    TopStadiums,
    StatusSummary,
    PaymentSummary,
  ] = await Promise.all([
    fetchStatistics("/statistics/overview"),
    fetchStatistics("/statistics/bookings-by-month"),
    fetchStatistics("/statistics/top-stadiums"),
    fetchStatistics("/statistics/status-summary"),
    fetchStatistics("/statistics/payment-summary"),
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
