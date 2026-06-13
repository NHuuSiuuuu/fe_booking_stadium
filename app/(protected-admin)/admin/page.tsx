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

  const resStatisticsOverview = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/statistics/overview`,
    {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    },
  );
  if (!resStatisticsOverview.ok) {
    throw new Error("Lỗi");
  }

  const resBookingByMonth = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/statistics/bookings-by-month`,
    {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    },
  );
  if (!resBookingByMonth.ok) {
    throw new Error("Lỗi");
  }

  const resTopStadiums = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/statistics/top-stadiums`,
    {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    },
  );
  if (!resTopStadiums.ok) {
    throw new Error("Lỗi");
  }

  const StatisticsOverview = await resStatisticsOverview.json();
  const BookingByMonth = await resBookingByMonth.json();
  const TopStadiums = await resTopStadiums.json();

  console.log("TopStadiums", TopStadiums);
  return (
    <Statistical
      StatisticsOverview={StatisticsOverview}
      BookingByMonth={BookingByMonth}
      TopStadiums={TopStadiums}
    />
  );
}
