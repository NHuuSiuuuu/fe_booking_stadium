"use client";

import {
  Sun,
  CloudSun,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Umbrella,
  MapPin,
} from "lucide-react";

type WeatherRes = {
  interval: number;
  precipitation_probability: number;
  temperature_2m: number;
  time: string;
  weather_code: number;
};

type WeatherProp = {
  initialData: WeatherRes;
};

function getWeatherInfo(code: number) {
  if (code === 0) return { Icon: Sun, color: "text-yellow-400" };
  if (code <= 2) return { Icon: CloudSun, color: "text-yellow-400" };
  if (code === 3) return { Icon: Cloud, color: "text-slate-100" };
  if (code <= 49) return { Icon: Cloud, color: "text-slate-100" };
  if (code <= 59) return { Icon: CloudDrizzle, color: "text-sky-400" };
  if (code <= 69) return { Icon: CloudRain, color: "text-sky-400" };
  if (code <= 79) return { Icon: CloudSnow, color: "text-sky-200" };
  if (code <= 84) return { Icon: CloudRain, color: "text-sky-400" };
  if (code <= 99)
    return {
      Icon: CloudLightning,
      color: "text-amber-400",
    };
  return { label: "Không rõ", Icon: Cloud, color: "text-slate-100" };
}

function getPlayCondition(temp: number, rain: number) {
  if (rain >= 70) return { label: "Không nên đá", color: "text-red-500" };
  if (rain >= 40) return { label: "Cẩn thận mưa", color: "text-yellow-500" };
  if (temp >= 38) return { label: "Quá nóng", color: "text-red-500" };
  if (temp >= 34) return { label: "Hơi nóng", color: "text-yellow-500" };
  return { label: "Rất tốt ", color: "text-green-500" };
}

export default function Weather({ initialData }: WeatherProp) {
  console.log("initialData", initialData);
  const { Icon: WeatherIcon, color: iconColor } = getWeatherInfo(
    initialData.weather_code,
  );
  const play = getPlayCondition(
    initialData.temperature_2m,
    initialData.precipitation_probability,
  );

  return (
    <div className="bg-[#1b2c45] px-4 md:px-13 py-1 md:py-4">
      <div className="flex items-center justify-between gap-2">
        {/* LEFT */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <WeatherIcon
            className={`w-6 h-6 md:w-10 md:h-10 shrink-0 ${iconColor}`}
          />

          <div className="min-w-0">
            <div className="flex items-center gap-1 text-[10px] md:text-sm text-slate-100">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">Hà Nội</span>
            </div>

            <div className="text-xl md:text-4xl font-bold text-white">
              {initialData.temperature_2m}°
            </div>
          </div>
        </div>

        {/* CENTER */}
        <div className="flex-1 text-center">
          <div className="text-[9px] md:text-sm uppercase tracking-wider text-slate-100">
            Điều kiện <span className="hidden md:inline">thi đấu</span>
          </div>

          <div className={`text-sm md:text-2xl font-semibold ${play.color}`}>
            {play.label}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-end gap-1 flex-1">
          <Umbrella className="w-4 h-4 md:w-5 md:h-5 text-sky-400 shrink-0" />

          <div className="text-right">
            <div className="text-[10px] md:text-sm text-slate-100">
              <span className="hidden md:inline">Khả năng </span>mưa
            </div>

            <div className="text-sm md:text-lg font-semibold text-white">
              {initialData.precipitation_probability}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
