import ListStadium from "@/components/client/stadium/list-stadium";
import envConfig from "@/config";

export default async function Page() {
  const res = await fetch(`${envConfig.NEXT_PUBLIC_APP_URL}/stadiums?page=1`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Lỗi fetch sân");
  }

  const data = await res.json();
  return <ListStadium initialData={data} />;
}
