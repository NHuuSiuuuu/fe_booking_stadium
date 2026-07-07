import StadiumDetail from "@/app/(client)/stadiums/[slug]/stadium-detail";
import ReviewSection from "@/components/client/reviews/review";
import envConfig from "@/config";
import { cookies } from "next/headers";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function page({ params }: Props) {
  const { slug } = await params;

  // Giải mã token từ cookie để lấy currentUserId
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  let currentUserId: number | null = null;

  if (token) {
    try {
      const base64Payload = token.split(".")[1];
      const payloadBuffer = Buffer.from(base64Payload, "base64");
      const payload = JSON.parse(payloadBuffer.toString("utf-8"));
      currentUserId = payload.id || null;
    } catch (error) {
      console.error("Lỗi decode token:", error);
    }
  }

  // Load sân
  const stadiumRes = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/stadium/${slug}`,
    {
      next: {
        revalidate: 60,
      },
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
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/price-config/${stadium.id}`,
    {
      cache: "no-store",
    },
  );
  if (!priceConfigRes.ok) {
    throw new Error("Lỗi fetch sân");
  }

  priceConfig = await priceConfigRes.json();

  // Load đánh giá sân
  const reviewRes = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/reviews/stadium/${stadium.id}`,
    {
      next: {
        revalidate: 60,
      },
    },
  );
  if (!reviewRes.ok) {
    throw new Error("Lỗi fetch sân");
  }

  const reviewsResult = (await reviewRes.json()) ?? null;
  const statistics = reviewsResult.result.statistics;
  const avg_rating = reviewsResult.result.avg_rating;
  const total_reviews = reviewsResult.result.total_reviews;
  const reviews = reviewsResult.result.reviews;


  return (
    <>
      <StadiumDetail
        initialStadium={stadium}
        initialPriceConfig={priceConfig}
      />
      <ReviewSection
        total_reviews={total_reviews}
        avg_rating={avg_rating}
        ratingStatistics={statistics}
        reviews={reviews}
        currentUserId={currentUserId}
      />
    </>
  );
}
