import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";
const openSans = Open_Sans({
  variable: "--font-geist-sans",
  subsets: ["vietnamese"],
});


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | NHuu Đặt sân trực tuyến Hà Nội",
    default: "NHuu - Đặt sân trực tuyến Hà Nội | Đặt sân bóng đá dễ dàng",
  },
  description: "Nền tảng đặt sân bóng đá trực tuyến hàng đầu tại Hà Nội. Đặt sân dễ dàng, nhanh chóng, cập nhật lịch trống liên tục và giá cả minh bạch.",
  keywords: ["đặt sân", "bóng đá", "hà nội", "booking stadium", "trực tuyến", "thuê sân bóng", "sân cỏ nhân tạo"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NHuu - Đặt sân trực tuyến Hà Nội",
    description: "Nền tảng đặt sân bóng đá trực tuyến hàng đầu tại Hà Nội. Đặt sân dễ dàng, nhanh chóng và tiện lợi.",
    url: "/",
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "NHuu Booking Stadium",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NHuu - Đặt sân trực tuyến Hà Nội",
    description: "Nền tảng đặt sân bóng đá trực tuyến hàng đầu tại Hà Nội.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={openSans.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
