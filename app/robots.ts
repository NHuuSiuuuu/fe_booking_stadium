// File này để nói với bot tìm kiếm rằng trang web này cho phép bot tìm kiếm truy cập vào trang nào, không cho phép bot truy cập vào trang nào
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      // Áp dụng cho tất cả bot tìm kiếm (Google, Bing, Yahoo,...)
      userAgent: "*",

      // Cho phép truy cập toàn bộ trang
      allow: "/",

      // Chặn bot truy cập các trang quản trị
      disallow: ["/admin/"],
    },
    // Đường dẫn đến sitemap để các bot tìm kiếm dễ dàng thu thập thông tin trang web
    sitemap: "https://booking-stadium.vercel.app/sitemap.xml",

    // URL chính thức của trang web
    host:"https://booking-stadium.vercel.app",
  };
}
