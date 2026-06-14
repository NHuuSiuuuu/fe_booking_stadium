"use client";

import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import { useCallback, useEffect, useState } from "react";
import L from "leaflet";
import useDebounce from "@/hooks/useDebounce";
// import { Crosshair, Loader, Search } from "lucide-react";
import { Search, Loader, Crosshair, X, List } from "lucide-react";
import Link from "next/link";

type UserPos = {
  lat: number;
  lng: number;
};

type District = {
  ogc_fid: number;
  name_2: string;
};
type FlyTarget = UserPos & { zoom: number };

type Stadium = {
  id: number;
  slug: string;
  name: string;
  address: string;
  type: string;
  price: number;
  thumbnail: string[];
  start_time: string;
  end_time: string;
  featured: boolean;
  description: string;
  district_id: number;
  lat?: number;
  lng?: number;
};

type StadiumsResponse = {
  stadiums: Stadium[];
  pageCurrent: number;
  totalPage: number;
  total: any;
};

export default function MapLeaflet() {
  // ── Custom  marker
  function makeIcon(color = "#2563eb", size = 36) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 10}" viewBox="0 0 36 46">
      <filter id="s" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.25)"/>
      </filter>
      <circle cx="18" cy="18" r="16" fill="${color}" filter="url(#s)"/>
      <circle cx="18" cy="18" r="10" fill="white" opacity="0.25"/>
      <text x="18" y="23" text-anchor="middle" font-size="13" font-family="Arial" fill="white">⚽</text>
      <polygon points="18,46 12,32 24,32" fill="${color}"/>
    </svg>`;
    return L.divIcon({
      html: svg,
      className: "",
      iconSize: [size, size + 10],
      iconAnchor: [size / 2, size + 10],
      popupAnchor: [0, -(size + 6)],
    });
  }

  const activeIcon = makeIcon("#0f172a");
  const userIcon = makeIcon("#ef4444", 32);

  // Ra lệnh cho bản đồ bay tới vị trí
  function FlyTo({ lat, lng, zoom = 16 }: FlyTarget) {
    const map = useMap();
    if (lat != null && lng != null)
      map.flyTo([lat, lng], zoom, { duration: 1.2 });
    return null;
  }

  const [selected, setSelected] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  // Lưu bị trí user
  const [userPos, setUserPos] = useState<UserPos | null>(null);
  const [radius, setRadius] = useState(10); // km

  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [flyTarget, setFlyTarget] = useState<FlyTarget | null>(null);
  const [distCode, setDistCode] = useState("");
  const [districts, setDistricts] = useState<District[]>([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [data, setData] = useState<StadiumsResponse>();
  const debounceValue = useDebounce(search, 500);
  /* =======================
    API danh sách stadium
  =======================*/
  const fetchStadiums = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = `/api/stadiums?page=${page}`;
      if (debounceValue) url += `&keyword=${debounceValue}`;
      if (userPos) {
        url += `&lat=${userPos.lat}&lng=${userPos.lng}&radius=${radius}`;
      }

      if (type) url += `&filter=type:${type}`;
      if (distCode) url += `&filter=dist:${distCode}`;

      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) throw new Error("Lỗi");

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [type, distCode, page, debounceValue, userPos, radius]);

  useEffect(() => {
    fetchStadiums();
  }, [fetchStadiums]);

  // const totalPage = data?.totalPage || 0;

  useEffect(() => {
    fetch(`api/districts`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts ?? []))
      .catch(console.error);
  }, []);

  const handleFindNearMe = () => {
    // API lấy vị trí
    if (!navigator.geolocation) {
      setGeoError("Trình duyệt không hỗ trợ định vị");
      return;
    }
    setGeoLoading(true);
    setGeoError("");
    // Lấy bị trí thật
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude }; //  Tạo obj vĩ độ và kinh độ
        setUserPos(p);
        setGeoLoading(false); // Tắt loading
        setFlyTarget({ ...p, zoom: 13 }); // Cho map bay tới đó
      },
      // Nếu bị lỗi
      () => {
        setGeoError("Không lấy được vị trí");
        setGeoLoading(false);
      },
    );
  };

  const handleSelect = (s: any) => {
    setSelected(s);
    setFlyTarget({ lat: s.lat, lng: s.lng, zoom: 16 });
  };
  console.log(userPos);

  return (
<div className="flex flex-col h-screen">
  <div className="relative flex flex-1 overflow-hidden">

 




  </div>
</div>
  );
}
