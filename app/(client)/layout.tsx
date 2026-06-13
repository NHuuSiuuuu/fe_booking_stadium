// import Header from "@/components/layout/header";
import { cookies } from "next/headers";
import envConfig from "@/config";
import Header from "@/components/client/layout/header";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;

  // lấy cookie từ request hiện tại
  const cookieStore = await cookies();

  try {

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
    const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/me`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      user = data.user;
      // console.log("res", res);
      // console.log("user", user);
    }
  } catch (err) {
    console.error(err);
  }

  return (
    <>
      <Header initialUser={user} />
      {children}
    </>
  );
}
