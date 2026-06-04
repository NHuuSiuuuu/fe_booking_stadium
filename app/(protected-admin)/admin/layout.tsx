import { AdminLayoutClient } from "@/components/admin/layouts/admin-layout-client";
import envConfig from "@/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user
  try {
    const cookieStore = await cookies();
    // lấy access_token và refresh_token
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    // tạo header cookie gửi sang backend
    const cookieHeader = [
      accessToken ? `access_token=${accessToken}` : "",
      refreshToken ? `refresh_token=${refreshToken}` : "",
    ]
      .filter(Boolean)
      .join("; ");

    const res = await fetch(`${envConfig.NEXT_PUBLIC_APP_URL}/auth/me`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      redirect("/admin/login");
    }

    const data = await res.json();
    user = data.user;

    if (!user?.isAdmin) {
      console.log("Không phải admin");
      redirect("/admin/login");
    }

    console.log("user", user.fullname);
  } catch (err) {
    throw err;
  }

  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>;
}
