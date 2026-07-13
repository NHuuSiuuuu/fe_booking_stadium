// Bản đồ trung tâm
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      // url của trang chủ
      url: "https://booking-stadium.vercel.app",
      // thời gian cập nhật cuối cùng
      lastModified: new Date(),
      // tần suất cập nhật (yearly, daily, weekly, monthly, yearly, never)
      changeFrequency: "weekly",
      // độ ưu tiên (0.0 - 1.0)
      priority: 1,
    },
    {
      // url của trang danh sách sân
      url: "https://booking-stadium.vercel.app/stadiums",
      lastModified: new Date(),
      // Trang này thay đổi thường xuyên (thêm, sửa, xóa sân, giá)
      changeFrequency: "daily",
      // Trang danh sách sân là quan trọng thứ 2 sau trang chủ
      priority: 0.8,
    },
    {
      url: "https://booking-stadium.vercel.app/map",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://booking-stadium.vercel.app/favorite",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
