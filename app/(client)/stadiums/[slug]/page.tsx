import StadiumDetail from "@/app/(client)/stadiums/[slug]/stadium-detail";
import ScrollToTop from "@/app/(client)/stadiums/[slug]/scroll-to-top";
import ReviewSection from "@/components/client/reviews/review";
import envConfig from "@/config";
import { absoluteUrl, publicPageMetadata, SITE_NAME } from "@/lib/seo";
import type { Stadium } from "@/types/stadium";
import type { Metadata } from "next";
import { cookies } from "next/headers";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function getStadiumBySlug(slug: string): Promise<Stadium | null> {
  const stadiumRes = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/stadium/${slug}`,
    {
      next: {
        revalidate: 60,
      },
    },
  );

  if (!stadiumRes.ok) {
    return null;
  }

  const stadiumData = await stadiumRes.json();
  if (Array.isArray(stadiumData)) {
    return stadiumData[0] ?? null;
  }

  if (Array.isArray(stadiumData.data)) {
    return stadiumData.data[0] ?? null;
  }

  return stadiumData.stadium ?? stadiumData.data ?? stadiumData.result ?? null;
}

function buildStadiumDescription(stadium: Stadium) {
  if (stadium.description) {
    return stadium.description;
  }

  const price = stadium.price ?? stadium.min_price;
  const priceText = price ? ` Giá từ ${price.toLocaleString("vi-VN")}đ.` : "";

  return `Đặt ${stadium.name} tại ${stadium.address}. Xem lịch trống, bảng giá, đánh giá và giữ chỗ sân bóng nhanh chóng tại Hà Nội.${priceText}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const stadium = await getStadiumBySlug(slug);

  if (!stadium) {
    return publicPageMetadata({
      title: "Không tìm thấy sân bóng",
      description: "Không tìm thấy thông tin sân bóng cần đặt tại Hà Nội.",
      pathname: `/stadiums/${slug}`,
    });
  }

  return publicPageMetadata({
    title: `${stadium.name} - Đặt sân bóng tại Hà Nội`,
    description: buildStadiumDescription(stadium),
    pathname: `/stadiums/${slug}`,
    image: stadium.thumbnail?.[0],
  });
}

function StadiumPageJsonLd({ stadium }: { stadium: Stadium }) {
  const image = stadium.thumbnail?.[0];
  const price = stadium.price ?? stadium.min_price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: stadium.name,
    description: buildStadiumDescription(stadium),
    url: absoluteUrl(`/stadiums/${stadium.slug}`),
    image: image ? absoluteUrl(image) : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: stadium.address,
      addressLocality: "Hà Nội",
      addressCountry: "VN",
    },
    geo:
      stadium.lat != null && stadium.lng != null
        ? {
            "@type": "GeoCoordinates",
            latitude: stadium.lat,
            longitude: stadium.lng,
          }
        : undefined,
    priceRange: price ? `${price.toLocaleString("vi-VN")} VND` : undefined,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}

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

  const stadium = await getStadiumBySlug(slug);

  if (!stadium?.id) {
    throw new Error("Không tìm thấy sân");
  }

  // Load cấu hình giá và đánh giá sân đồng thời sau khi đã có stadium.id
  const [priceConfigRes, reviewRes] = await Promise.all([
    fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/price-config/${stadium.id}`, {
      next: {
        revalidate: 60,
      },
    }),
    fetch(
      `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/reviews/stadium/${stadium.id}`,
      {
        next: {
          revalidate: 60,
        },
      },
    ),
  ]);

  if (!priceConfigRes.ok || !reviewRes.ok) {
    throw new Error("Lỗi fetch dữ liệu sân");
  }

  const [priceConfig, reviewsResult] = await Promise.all([
    priceConfigRes.json(),
    reviewRes.json(),
  ]);

  const statistics = reviewsResult.result.statistics;
  const avg_rating = reviewsResult.result.avg_rating;
  const total_reviews = reviewsResult.result.total_reviews;
  const reviews = reviewsResult.result.reviews;
  const detailStadium = {
    ...stadium,
    description: stadium.description ?? "",
    type: Number(stadium.type),
    thumbnail: stadium.thumbnail ?? [],
    utility: stadium.utility ?? [],
  };

  return (
    <>
      <ScrollToTop />
      <StadiumPageJsonLd stadium={detailStadium} />
      <StadiumDetail
        initialStadium={detailStadium}
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
