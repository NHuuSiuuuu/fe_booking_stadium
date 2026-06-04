import StadiumDetail from "@/app/(client)/stadiums/[slug]/stadium-detail";
import envConfig from "@/config";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function page({ params }: Props) {
  const { slug } = await params;

  // Load sân
  const stadiumRes = await fetch(
    `${envConfig.NEXT_PUBLIC_APP_URL}/stadium/${slug}`,
    {
      cache: "no-store",
    },
  );
  if (!stadiumRes.ok) {
    throw new Error("Lỗi fetch sân");
  }

  const stadiumData = await stadiumRes.json();
  const stadium = stadiumData[0] ?? null;

  // Load cấu hình giá sân
  let priceConfig = [];
  const priceConfigRes = await fetch(
    `${envConfig.NEXT_PUBLIC_APP_URL}/price-config/${stadium.id}`,
    {
      cache: "no-store",
    },
  );
  if (!priceConfigRes.ok) {
    throw new Error("Lỗi fetch sân");
  }

  priceConfig = await priceConfigRes.json();
  console.log("priceConfig", priceConfig);
  return (
    <div>
      <StadiumDetail
        initialStadium={stadium}
        initialPriceConfig={priceConfig}
      />
    </div>
  );
}
