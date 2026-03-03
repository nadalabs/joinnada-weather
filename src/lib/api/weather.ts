import type { ApiResult, WeatherResult } from "@/lib/types";

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

function buildWeatherUrl(latitude: number, longitude: number): string {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,weather_code,wind_speed_10m",
    timezone: "auto",
  });

  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
}

function isValidWeatherPayload(value: unknown): value is WeatherResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;
  const current = payload.current as Record<string, unknown> | undefined;
  const units = payload.current_units as Record<string, unknown> | undefined;

  return Boolean(
    typeof payload.timezone === "string" &&
      current &&
      units &&
      typeof current.time === "string" &&
      typeof current.temperature_2m === "number" &&
      typeof current.weather_code === "number" &&
      typeof current.wind_speed_10m === "number" &&
      typeof units.temperature_2m === "string" &&
      typeof units.wind_speed_10m === "string"
  );
}

export async function fetchWeather(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<ApiResult<WeatherResult>> {
  try {
    const response = await fetch(buildWeatherUrl(latitude, longitude), { signal });

    if (!response.ok) {
      return {
        ok: false,
        kind: "http",
        message: `Weather request failed with status ${response.status}.`,
      };
    }

    const json = (await response.json()) as unknown;
    if (!isValidWeatherPayload(json)) {
      return {
        ok: false,
        kind: "parse",
        message: "Weather API returned an unexpected response shape.",
      };
    }

    return { ok: true, data: json };
  } catch (error) {
    if (isAbortError(error)) {
      return { ok: false, kind: "aborted", message: "Weather request canceled." };
    }

    return {
      ok: false,
      kind: "network",
      message: "Unable to load weather data right now.",
    };
  }
}
