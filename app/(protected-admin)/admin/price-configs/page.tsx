import PriceConfig from "@/app/(protected-admin)/admin/price-configs/price-config";
import envConfig from "@/config";
import { cookies } from "next/headers";

type Props = {
  searchParams: Promise<{ page?: string; keyword?: string }>;
};

export default async function page({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const page = resolvedParams.page || 1;
  const keyword = resolvedParams.keyword || "";

  // lấy cookie từ request hiện tại
  const cookieStore = await cookies();

  // lấy access_token và refresh_token
  const accessToken = cookieStore.get("access_token")?.value;

  const refreshToken = cookieStore.get("refresh_token")?.value;

  // tạo header cookie gửi sang backend
  const cookieHeader = [
    accessToken ? `access_token=${accessToken}` : "",
    refreshToken ? `refresh_token=${refreshToken}` : "",
  ]
    .filter(Boolean) // xóa thằng nào rỗng
    .join("; "); //"access_token=abc123; refresh_token=xyz999"

  // gọi backend
  let url = `${envConfig.NEXT_PUBLIC_APP_URL}/stadiums?page=${page}`;
  if (keyword) {
    url += `&keyword=${keyword}`;
  }
  const res = await fetch(`${url}`, {
    headers: {
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Không fetch được danh sách sân");
  }
  const data = await res.json();

  return (
    <div>
      <PriceConfig initialPriceConfig={data}/>
    </div>
  );
}
