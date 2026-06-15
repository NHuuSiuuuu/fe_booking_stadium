import BookingProcess from "@/components/client/home/booking-process";
import DistrictPriceTable from "@/components/client/home/district-price-table";
import NearByStadiums from "@/components/client/home/near-by-stadiums";
import Overview from "@/components/client/home/overview";
import Weather from "@/components/client/home/weather";
import ListStadium from "@/components/client/stadium/list-stadium";
import envConfig from "@/config";

export default async function Page() {
  const LAT = 21.0285;
  const LNG = 105.8542;

  const res = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/stadiums?page=1`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Lỗi fetch sân");
  }

  const data = await res.json();

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(LAT));
  url.searchParams.set("longitude", String(LNG));
  url.searchParams.set(
    "current",
    ["temperature_2m", "precipitation_probability", "weather_code"].join(","),
  );
  url.searchParams.set("timezone", "Asia/Bangkok");

  const resWeather = await fetch(url.toString());
  if (!resWeather.ok) throw new Error();
  const json = await resWeather.json();
  const c = json.current;
  // console.log("c",c)
  return (
    <>
      <ListStadium initialData={data} />
      <Weather initialData={c} />
      <NearByStadiums initialData={data}/>
      <DistrictPriceTable/>
      <Overview/>
      <BookingProcess/>
    </>
  );
}
