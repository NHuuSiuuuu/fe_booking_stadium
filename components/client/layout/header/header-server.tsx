import envConfig from "@/config";
import { cookies } from "next/headers";
import Header from "./header";

export async function HeaderServer() {
  let user = null;

  // lấy cookie từ request hiện tại
  const cookieStore = await cookies();

 
    // lấy access_token và refresh_token
    const accessToken = cookieStore.get("access_token")?.value;

    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!accessToken && !refreshToken) {
      return <Header initialUser={null} />;  // khỏi fetch auth/me
    }

    // tạo header cookie gửi sang backend
    const cookieHeader = [
      accessToken ? `access_token=${accessToken}` : "",
      refreshToken ? `refresh_token=${refreshToken}` : "",
    ]
      .filter(Boolean) // xóa thằng nào rỗng
      .join("; "); //"access_token=abc123; refresh_token=xyz999"

    // gọi backend
    const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/me`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if(!res.ok) {
      return <Header initialUser={null} />;
    }

    const data = await res.json();
    user = data.user;

  return <Header initialUser={user} />;
}