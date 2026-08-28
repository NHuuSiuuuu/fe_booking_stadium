// Bản đồ trung tâm
import envConfig from "@/config";
import { absoluteUrl } from "@/lib/seo";
import { MetadataRoute } from "next";
import type { Stadium } from "@/types/stadium";

async function getStadiumUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/stadiums?limit=1000`, {
      next: {
        revalidate: 3600,
      },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const stadiums: Stadium[] = data.stadiums ?? data.data ?? [];

    if (!Array.isArray(stadiums)) {
      return [];
    }

    return stadiums
      .filter((stadium) => stadium.slug)
      .map((stadium) => ({
        url: absoluteUrl(`/stadiums/${stadium.slug}`),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      // url của trang chủ
      url: absoluteUrl("/"),
      // thời gian cập nhật cuối cùng
      lastModified: new Date(),
      // tần suất cập nhật (yearly, daily, weekly, monthly, yearly, never)
      changeFrequency: "weekly",
      // độ ưu tiên (0.0 - 1.0)
      priority: 1,
    },
    {
      // url của trang danh sách sân
      url: absoluteUrl("/stadiums"),
      lastModified: new Date(),
      // Trang này thay đổi thường xuyên (thêm, sửa, xóa sân, giá)
      changeFrequency: "daily",
      // Trang danh sách sân là quan trọng thứ 2 sau trang chủ
      priority: 0.8,
    },
    {
      url: absoluteUrl("/map"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  return [...staticRoutes, ...(await getStadiumUrls())];
}
