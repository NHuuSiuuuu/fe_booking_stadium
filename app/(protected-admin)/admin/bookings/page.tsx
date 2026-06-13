import Bookings from "@/app/(protected-admin)/admin/bookings/bookings";
import envConfig from "@/config";
import { cookies } from "next/headers";

type Props = {
  searchParams: Promise<{
    page?: string;
    keyword?: string;
    sort?: string;
    filter?: string;
  }>;
};



export default async function page({ searchParams }: Props) {
  const resoledParams = await searchParams;
  const page = resoledParams.page || 1;
  const keyword = resoledParams.keyword || "";
  const sort = resoledParams.sort;
  const filterStatus = resoledParams.filter;

  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token")?.value;
  const refresh_token = cookieStore.get("refresh_token")?.value;

  const cookieHeader = [
    access_token ? `access_token=${access_token}` : "",
    refresh_token ? `refresh_token=${refresh_token}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  let url = `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/booking/get?page=${page}`;

  if (keyword) {
    url += `&keyword=${keyword}`;
  }

  if (sort) {
    url += `&sort=${sort}`;
  }

  if (filterStatus) {
    console.log("filter status server", filterStatus)
    url += `&filter=${filterStatus}`;
  }
  const res = await fetch(url, {
    headers: {
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Không fetch được danh sách bookings");
  }
  const data = await res.json();

  console.log("resoledParams", resoledParams);
  console.log("data", data);
    console.log("filter status server", filterStatus)

  return <Bookings initialPriceConfig={data} />;
}
