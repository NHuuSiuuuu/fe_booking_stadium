import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
const openSans = Open_Sans({
  variable: "--font-geist-sans",
  subsets: ["vietnamese"],
});


export const metadata: Metadata = {
  title: {
    template: "%s | NHuu",
    default: "Đặt sân trực tuyến Hà Nội",
  },
  description: "Được tạo bỏi Huu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
