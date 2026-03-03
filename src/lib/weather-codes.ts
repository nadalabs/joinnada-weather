import type { LucideIcon } from "lucide-react";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
} from "lucide-react";

export interface WeatherCodeInfo {
  label: string;
  icon: LucideIcon;
  iconColor: string;
}

const WEATHER_CODE_MAP: Record<number, WeatherCodeInfo> = {
  0: { label: "Clear sky", icon: Sun, iconColor: "text-amber-500" },
  1: { label: "Mainly clear", icon: Sun, iconColor: "text-amber-500" },
  2: { label: "Partly cloudy", icon: Cloud, iconColor: "text-gray-400" },
  3: { label: "Overcast", icon: Cloud, iconColor: "text-gray-500" },
  45: { label: "Fog", icon: CloudFog, iconColor: "text-gray-400" },
  48: { label: "Depositing rime fog", icon: CloudFog, iconColor: "text-gray-400" },
  51: { label: "Light drizzle", icon: CloudDrizzle, iconColor: "text-blue-400" },
  53: { label: "Moderate drizzle", icon: CloudDrizzle, iconColor: "text-blue-400" },
  55: { label: "Dense drizzle", icon: CloudDrizzle, iconColor: "text-blue-500" },
  56: { label: "Light freezing drizzle", icon: CloudDrizzle, iconColor: "text-sky-400" },
  57: { label: "Dense freezing drizzle", icon: CloudDrizzle, iconColor: "text-sky-500" },
  61: { label: "Slight rain", icon: CloudRain, iconColor: "text-blue-400" },
  63: { label: "Moderate rain", icon: CloudRain, iconColor: "text-blue-500" },
  65: { label: "Heavy rain", icon: CloudRain, iconColor: "text-blue-600" },
  66: { label: "Light freezing rain", icon: CloudRain, iconColor: "text-sky-400" },
  67: { label: "Heavy freezing rain", icon: CloudRain, iconColor: "text-sky-600" },
  71: { label: "Slight snowfall", icon: CloudSnow, iconColor: "text-sky-300" },
  73: { label: "Moderate snowfall", icon: CloudSnow, iconColor: "text-sky-400" },
  75: { label: "Heavy snowfall", icon: CloudSnow, iconColor: "text-sky-500" },
  77: { label: "Snow grains", icon: CloudSnow, iconColor: "text-sky-300" },
  80: { label: "Slight rain showers", icon: CloudRain, iconColor: "text-blue-400" },
  81: { label: "Moderate rain showers", icon: CloudRain, iconColor: "text-blue-500" },
  82: { label: "Violent rain showers", icon: CloudRain, iconColor: "text-blue-600" },
  85: { label: "Slight snow showers", icon: CloudSnow, iconColor: "text-sky-300" },
  86: { label: "Heavy snow showers", icon: CloudSnow, iconColor: "text-sky-500" },
  95: { label: "Thunderstorm", icon: CloudLightning, iconColor: "text-violet-500" },
  96: { label: "Thunderstorm with slight hail", icon: CloudLightning, iconColor: "text-violet-500" },
  99: { label: "Thunderstorm with heavy hail", icon: CloudLightning, iconColor: "text-violet-600" },
};

const FALLBACK_WEATHER_CODE: WeatherCodeInfo = {
  label: "Unknown weather",
  icon: Cloud,
  iconColor: "text-gray-400",
};

export function getWeatherCodeInfo(code: number): WeatherCodeInfo {
  return WEATHER_CODE_MAP[code] ?? FALLBACK_WEATHER_CODE;
}
