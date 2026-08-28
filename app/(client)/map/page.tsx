import MapLeafletClient from "@/app/(client)/map/map-leaflet-client";
import { publicPageMetadata } from "@/lib/seo";
import { Metadata } from "next";

export const metadata: Metadata = publicPageMetadata({
  title: "Bản đồ sân bóng đá Hà Nội",
  description:
    "Xem vị trí các sân bóng đá tại Hà Nội trên bản đồ, tìm sân gần bạn và lọc theo bán kính để chọn địa điểm thuận tiện.",
  pathname: "/map",
});


export default function Page() {
  return <MapLeafletClient />;
}
