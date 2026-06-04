import MapLeafletClient from "@/app/(client)/map/map-leaflet-client";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Bản đồ",
  description: "Trang bản đồ sân bóng",
};


export default function Page() {
  return <MapLeafletClient />;
}
