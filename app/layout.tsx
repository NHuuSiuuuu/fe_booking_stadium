import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
const openSans = Open_Sans({
  variable: "--font-geist-sans",
  subsets: ["vietnamese"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://booking-stadium.vercel.app"),
  title: {
    template: "%s | NHuu Đặt sân trực tuyến Hà Nội",
    default: "NHuu - Đặt sân trực tuyến Hà Nội | Đặt sân bóng đá dễ dàng",
  },
  description: "Nền tảng đặt sân bóng đá trực tuyến hàng đầu tại Hà Nội. Đặt sân dễ dàng, nhanh chóng, cập nhật lịch trống liên tục và giá cả minh bạch.",
  keywords: ["đặt sân", "bóng đá", "hà nội", "booking stadium", "trực tuyến", "thuê sân bóng", "sân cỏ nhân tạo"],
  openGraph: {
    title: "NHuu - Đặt sân trực tuyến Hà Nội",
    description: "Nền tảng đặt sân bóng đá trực tuyến hàng đầu tại Hà Nội. Đặt sân dễ dàng, nhanh chóng và tiện lợi.",
    url: "https://booking-stadium.vercel.app",
    siteName: "NHuu Booking Stadium",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NHuu - Đặt sân trực tuyến Hà Nội",
    description: "Nền tảng đặt sân bóng đá trực tuyến hàng đầu tại Hà Nội.",
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
