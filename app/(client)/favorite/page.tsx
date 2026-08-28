import FavoritePage from "@/app/(client)/favorite/favorite-page";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sân bóng yêu thích",
  description: "Trang danh sách sân bóng yêu thích",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <FavoritePage />;
}
