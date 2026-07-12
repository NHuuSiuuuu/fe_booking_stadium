import BookingProcess from "@/components/client/home/booking-process";
import DistrictPriceTable from "@/components/client/home/district-price-table";
import NearByStadiums from "@/components/client/home/near-by-stadiums";
import Overview from "@/components/client/home/overview";
import Weather from "@/components/client/home/weather/weather";
import WeatherSkeleton from "@/components/client/home/weather/weather-skeleton";
import ListStadium from "@/components/client/stadium/list-stadium";
import ListStadiumSkeleton from "@/components/client/stadium/list-stadium-skeleton";
import StadiumHomeSkeleton from "@/components/client/stadium/stadium-home-skeleton";
import envConfig from "@/config";
import { Suspense } from "react";

export default async function Page() {
  return (
    <>
      <Suspense fallback={<StadiumHomeSkeleton count={6} />}>
        <ListStadiumServer />
      </Suspense>

      <Suspense fallback={<WeatherSkeleton />}>
        <WeatherServer />
      </Suspense>

      <Suspense fallback={<ListStadiumSkeleton count={6} />}>
        <NearByStadiumsServer />
      </Suspense>

      <DistrictPriceTable />
      <Overview />
      <BookingProcess />
    </>
  );
}

async function ListStadiumServer() {
  const [stadiumRes, districtsRes] = await Promise.all([
    fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/stadiums?limit=6`, {
      next: {
        revalidate: 60,
      },
    }),
    fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/districts`, {
      next: {
        revalidate: 60,
      },
    }),
  ]);

  if (!stadiumRes.ok || !districtsRes.ok) {
    throw new Error("Lỗi fetch danh sách sân");
  }

  const [data, districts] = await Promise.all([
    stadiumRes.json(),
    districtsRes.json(),
  ]);

  return (
    <ListStadium initialData={data} districts={districts?.districts ?? []} />
  );
}

async function WeatherServer() {
  const LAT = 21.0285;
  const LNG = 105.8542;

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(LAT));
  url.searchParams.set("longitude", String(LNG));
  url.searchParams.set(
    "current",
    ["temperature_2m", "precipitation_probability", "weather_code"].join(","),
  );
  url.searchParams.set("timezone", "Asia/Bangkok");

  const weatherRes = await fetch(url.toString(), {
    next: {
      revalidate: 1800,
    },
  });

  if (!weatherRes.ok) {
    console.log("Lỗi fetch thời tiết");
  }

  const weather = await weatherRes.json();

  return <Weather initialData={weather.current} />;
}

async function NearByStadiumsServer() {
  const stadiumRes = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/stadiums?limit=6`,
    {
      next: {
        revalidate: 60,
      },
    },
  );

  if (!stadiumRes.ok) {
    throw new Error("Lỗi fetch sân gần bạn");
  }

  const data = await stadiumRes.json();

  return <NearByStadiums initialData={data} />;
}
