import Booked from "@/app/(client)/booked/booked";
import Booking from "@/app/(client)/booked/booked";
import envConfig from "@/config";
import { cookies } from "next/headers";

export default async function page() {
  let data = null;
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
    const bookedRes = await fetch(
      `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/booking/my`,
      {
        headers: {
          Cookie: cookieHeader,
        },
        cache: "no-store",
      },
    );
    if (bookedRes.ok) {
      const booked = await bookedRes.json();
      data = booked.data;
    }
    console.log("data", data);
  } catch (err) {}

  return <Booked data={data} />;
}
