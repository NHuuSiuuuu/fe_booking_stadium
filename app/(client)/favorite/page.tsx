import FavoritePage from "@/app/(client)/favorite/favorite-page";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sân bóng yêu thích",
  description: "Trang danh sách sân bóng yêu thích",
};

export default function Page() {
  return <FavoritePage />;
}
