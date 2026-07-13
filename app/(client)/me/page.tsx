import MePage from "@/app/(client)/me/me-setting";
import envConfig from "@/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken && !refreshToken) {
    redirect("/login");
  }

  const cookieHeader = [
    accessToken ? `access_token=${accessToken}` : "",
    refreshToken ? `refresh_token=${refreshToken}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/me`, {
    headers: {
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/login");
  }

  const data = await res.json();
  const user = data.user;

  return <MePage initialUser={user} />;
}