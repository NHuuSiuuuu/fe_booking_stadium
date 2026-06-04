"use client";
import dynamic from "next/dynamic";

// Leaflet cần window/DOM nên PHẢI tắt SSR
// Nếu không sẽ bị lỗi: "window is not defined"
const MapLeaflet = dynamic(
  () => import("@/components/client/stadium/map-leaflet"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-sm font-bold uppercase tracking-widest text-slate-400 animate-pulse">
          Đang tải bản đồ...
        </div>
      </div>
    ),
  },
);

export default function MapLeafletClient() {
  return <MapLeaflet/>
}
