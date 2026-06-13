import DetailForm from "@/app/(protected-admin)/admin/stadiums/detail/[id]/detail-form";
import envConfig from "@/config";
import { cookies } from "next/headers";

type Props = {
  params: Promise<{ id: number }>;
};

export default async function page({ params }: Props) {
  const { id } = await params;
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

  // Load sân
  const stadiumRes = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/stadium/detail/${id}`,
    {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    },
  );
  if (!stadiumRes.ok) {
    throw new Error("Lỗi fetch sân");
  }

  const stadiumData = await stadiumRes.json();
  const stadium = stadiumData[0] ?? null;
  return <DetailForm initialStadium={stadium} />;
}
