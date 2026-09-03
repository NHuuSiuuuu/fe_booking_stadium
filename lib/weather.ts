export type WeatherConditions = {
  interval: number;
  precipitation_probability: number;
  temperature_2m: number;
  time: string;
  weather_code: number;
};

export const DEFAULT_WEATHER: WeatherConditions = {
  interval: 0,
  precipitation_probability: 0,
  temperature_2m: 0,
  time: "",
  weather_code: 0,
};

export function normalizeWeatherData(data: unknown): WeatherConditions {
  if (!data || typeof data !== "object") return DEFAULT_WEATHER;

  const current = (data as { current?: unknown }).current;
  if (!current || typeof current !== "object") return DEFAULT_WEATHER;

  const record = current as Partial<WeatherConditions>;
  if (
    typeof record.interval !== "number" ||
    typeof record.precipitation_probability !== "number" ||
    typeof record.temperature_2m !== "number" ||
    typeof record.time !== "string" ||
    typeof record.weather_code !== "number"
  ) {
    return DEFAULT_WEATHER;
  }

  return {
    interval: record.interval,
    precipitation_probability: record.precipitation_probability,
    temperature_2m: record.temperature_2m,
    time: record.time,
    weather_code: record.weather_code,
  };
}

export async function resolveWeatherData(
  loadWeather: () => Promise<unknown>,
): Promise<WeatherConditions> {
  try {
    return normalizeWeatherData(await loadWeather());
  } catch {
    return DEFAULT_WEATHER;
  }
}
