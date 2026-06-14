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
  const [showList, setShowList] = useState(false);
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
        {/* ══ MOBILE TOPBAR  ══ */}
        <div className="md:hidden absolute top-0 left-0 right-0 z-20 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2 px-3 h-[52px]">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 h-9 border border-slate-200 bg-slate-50 flex-1 min-w-0">
              <Search className="size-[13px] text-slate-400 shrink-0" />
              <input
                placeholder="Tìm sân..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-0 text-[13px] bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>
            {/* Quận */}
            <select
              value={distCode}
              onChange={(e) => setDistCode(e.target.value)}
              className="h-9 border border-slate-200 bg-slate-50 px-2 text-[11px] font-bold text-slate-700 outline-none cursor-pointer shrink-0"
            >
              <option value="">Quận</option>
              {districts?.map((item) => (
                <option value={item.ogc_fid} key={item.ogc_fid}>
                  {item.name_2}
                </option>
              ))}
            </select>
            {/* Loại sân */}
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-9 border border-slate-200 bg-slate-50 px-2 text-[11px] font-bold text-slate-700 outline-none cursor-pointer shrink-0"
            >
              <option value="">Loại</option>
              <option value="5">Sân 5</option>
              <option value="7">Sân 7</option>
              <option value="11">Sân 11</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleFindNearMe}
          disabled={geoLoading}
          className={`md:hidden absolute right-4 z-30 w-9 h-9 flex items-center justify-center shadow-lg transition-all ${
            userPos
              ? "bg-gray-700 top-[68px]"
              : "bg-white border border-slate-200 top-[68px]"
          } ${geoLoading ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
          title="Tìm sân gần tôi nhất"
        >
          {geoLoading ? (
            <Loader className="size-3 text-slate-600" />
          ) : (
            <Crosshair
              className={`size-3 ${userPos ? "text-white" : "text-slate-700"}`}
            />
          )}
        </button>
        {userPos && (
          <button
            onClick={() => setUserPos(null)}
            disabled={geoLoading}
            className={`md:hidden absolute right-4   
            z-30 w-9 h-9 flex items-center justify-center 
            shadow-lg transition-all 
             bg-white border border-slate-200 top-28
         `}
            title="Bỏ lọc tìm sân gần nhất"
          >
            ✕
          </button>
        )}
        <button
          onClick={() => setShowList(true)}
          className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30
          flex items-center gap-2 bg-gray-900 text-white
          text-[11px] font-bold uppercase tracking-wider
          px-3 py-3"
        >
          <List className="size-4" />
          {/* Danh sách ({data?.total} sân) */}
        </button>
        {showList && (
          <>
            <div
              className="md:hidden absolute inset-0 z-30 bg-black/30"
              onClick={() => setShowList(false)}
            />
            <div className="md:hidden absolute bottom-0 left-0 right-0 z-40 bg-white h-[70vh] flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="text-[13px] font-bold uppercase text-slate-800">
                  {/* {data?.total} sân */}
                </span>
                <button onClick={() => setShowList(false)} className="p-1">
                  <X className="size-5 text-slate-400" />
                </button>
              </div>
              <div className="flex-1  h-[70vh]  overflow-y-auto">
                {data?.stadiums?.length === 0 ? (
                  <div className="py-16 text-sm font-bold tracking-widest text-center uppercase text-slate-400">
                    Không tìm thấy sân
                  </div>
                ) : (
                  data?.stadiums?.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(s)}
                      className={`w-full text-left border-b border-slate-100 transition-all cursor-pointer hover:bg-blue-50 border-l-2 ${selected?.id === s.id ? "bg-blue-50 border-l-blue-600" : "bg-white border-l-transparent"}`}
                    >
                      <div className="relative h-[100px] overflow-hidden">
                        <img
                          src={s?.thumbnail?.[0]}
                          alt={s?.name}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                        <div className="absolute flex gap-1 bottom-2 left-2">
                          <span className="text-[12px] font-bold uppercase bg-gray-700/90 text-white px-1.5 py-0.5 rounded-sm">
                            Sân {s?.type}
                          </span>
                        </div>
                      </div>
                      <div className="px-4 py-3">
                        <h3 className="m-0 mb-1 font-bold  uppercase text-[13px] text-slate-700 leading-tight">
                          {s.name}
                        </h3>
                        <p className="m-0 mb-2 text-[11px] text-slate-500 flex items-start gap-1">
                          <span className="shrink-0">📍</span>
                          {s.address}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-bold  text-black">
                            {s?.price?.toLocaleString("vi-VN")}đ
                          </span>
                          <div className="flex items-center gap-2">
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[10px] font-bold  uppercase tracking-wider bg-slate-100 hover:bg-gray-700 hover:text-white text-slate-600 px-2 py-1 rounded-sm transition-colors no-underline"
                            >
                              🗺️ Đi
                            </a>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* ══ DESKTOP SIDEBAR ══ */}
        <div className="hidden md:flex w-[340px] shrink-0 bg-white border-r border-slate-200 flex-col z-10">
          <div className="px-5 pt-5 pb-4 border-b border-slate-100">
            <div className="text-[15px] font-bold uppercase text-slate-800 mb-1">
              Bản đồ sân bóng
            </div>
            <span className="text-slate-500 text-[13px]">
              Tổng {data?.total} sân
            </span>

            <button
              onClick={handleFindNearMe}
              disabled={geoLoading}
              className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 border text-[11px] font-bold uppercase transition-all ${
                userPos
                  ? "bg-gray-700 text-white border-gray-700"
                  : "bg-white text-slate-700 border-slate-300 hover:border-black hover:text-slate-800"
              } ${geoLoading ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
            >
              {geoLoading ? (
                <>
                  <Loader className="size-[14px]" /> Đang định vị...
                </>
              ) : userPos ? (
                <>Đang sắp xếp theo khoảng cách</>
              ) : (
                <>
                  <Crosshair className="size-[14px]" /> Tìm sân gần tôi nhất
                </>
              )}
            </button>

            {userPos && (
              <button
                onClick={() => setUserPos(null)}
                className="w-full mt-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer py-1 transition-colors"
              >
                ✕ Bỏ sắp xếp theo khoảng cách
              </button>
            )}
            {geoError && (
              <p className="text-[10px] text-red-500 font-semibold mt-1.5 m-0">
                {geoError}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2 px-3 h-9 border border-slate-200 bg-slate-50">
              <Search className="size-[14px] text-slate-400" />
              <input
                placeholder="Tìm tên sân, địa chỉ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-sm bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex flex-col flex-1">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-1">
                  Quận
                </div>
                <select
                  value={distCode}
                  onChange={(e) => setDistCode(e.target.value)}
                  className="bg-slate-50 border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="">Tất cả</option>
                  {districts?.map((item) => (
                    <option value={item.ogc_fid} key={item.ogc_fid}>
                      {item.name_2}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col flex-1">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-1">
                  Loại sân
                </div>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="bg-slate-50 border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="">Tất cả</option>
                  <option value="5">5v5</option>
                  <option value="7">7v7</option>
                  <option value="11">11v11</option>
                </select>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {/* danh sách sân như cũ */}
          </div>
        </div>

        {/* ── MAP ── */}
        <div className="relative z-10 flex-1">
          <MapContainer
            center={[21.0285, 105.8542]}
            zoom={13}
            className="w-full h-full"
            zoomControl={false}
          >
            {/* CartoDB Positron — sáng, tối giản, chuyên nghiệp */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              maxZoom={20}
            />

            {flyTarget && (
              <FlyTo
                lat={flyTarget.lat}
                lng={flyTarget.lng}
                zoom={flyTarget.zoom}
              />
            )}

            {/* Vị trí người dùng */}
            {userPos && (
              <>
                <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
                  <Popup>
                    <p className="m-0 font-bold text-[13px]">
                      📍 Vị trí của bạn
                    </p>
                  </Popup>
                </Marker>
                <Circle
                  center={[userPos.lat, userPos.lng]}
                  radius={radius * 1000}
                  pathOptions={{
                    color: "#8a94a8",
                    fillColor: "#4c5362",
                    fillOpacity: 0.06,
                    weight: 1.5,
                    dashArray: "6 4",
                  }}
                />
              </>
            )}

            {/* Markers sân */}
            {data?.stadiums?.map((s) =>
              s?.lat && s?.lng ? (
                <Marker
                  key={s.id}
                  position={[s.lat!, s.lng!]}
                  icon={selected?.id === s.id ? activeIcon : activeIcon}
                  eventHandlers={{ click: () => handleSelect(s) }}
                >
                  <Popup minWidth={280} maxWidth={300}>
                    {/* Popup dùng inline style vì leaflet inject thẳng vào DOM, Tailwind không reach được */}
                    <div>
                      <div
                        style={{
                          position: "relative",
                          margin: "-14px -20px 12px",
                          height: "150px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={s?.thumbnail?.[0]}
                          alt={s?.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
                          }}
                        />

                        <div
                          style={{
                            position: "absolute",
                            bottom: 8,
                            left: 8,
                            display: "flex",
                            gap: 4,
                          }}
                        >
                          <span
                            style={{
                              background: "black",
                              color: "#fff",
                              fontSize: 9,
                              fontWeight: 600,
                              textTransform: "uppercase",
                              padding: "2px 7px",
                              borderRadius: 2,
                            }}
                          >
                            {s?.type}
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          color: "#0f172a",
                          lineHeight: 1.1,
                          marginBottom: 5,
                        }}
                      >
                        {s?.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "black",
                          marginBottom: 12,
                        }}
                      >
                        📍 {s?.address}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 5,
                          marginBottom: 12,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "#f8fafc",
                            borderRadius: 2,
                            padding: "5px 10px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              color: "black",
                              letterSpacing: "0.08em",
                            }}
                          >
                            Sân {s?.type}
                          </span>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "black",
                            }}
                          >
                            {s?.price?.toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8 }}>
                        <Link
                          href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 5,
                            background: "#f1f5f9",
                            color: "#334155",
                            textDecoration: "none",
                            padding: 9,
                            borderRadius: 2,
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          🗺️ Dẫn đường
                        </Link>
                        <Link
                          href={`/stadium/${s?.slug}`}
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#101828",
                            color: "#fff",
                            padding: 9,
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                          }}
                        >
                          Đặt sân →
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ) : null,
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
