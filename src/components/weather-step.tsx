"use client";

import { Loader2, Thermometer, Wind } from "lucide-react";

import { cn } from "@/lib/utils";
import { getWeatherCodeInfo } from "@/lib/weather-codes";
import type { ChainState } from "@/lib/types";

type WeatherStepState = Extract<
  ChainState,
  | { status: "loadingWeather" }
  | { status: "weatherSuccess" }
  | { status: "weatherError" }
>;

interface WeatherStepProps {
  state: WeatherStepState;
}

export function WeatherStep({ state }: WeatherStepProps) {
  switch (state.status) {
    case "loadingWeather":
      return (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Fetching weather for {state.geo.name}…</span>
        </div>
      );

    case "weatherError":
      return <p className="text-sm text-red-600">{state.message}</p>;

    case "weatherSuccess": {
      const { weather } = state;
      const info = getWeatherCodeInfo(weather.current.weather_code);
      const Icon = info.icon;

      return (
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center gap-2">
            <Icon className={cn("h-8 w-8", info.iconColor)} />
            <span className="text-xs leading-4 text-gray-500">
              {info.label}
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-baseline gap-1">
              <Thermometer className="h-4 w-4 self-center text-gray-500" />
              <span className="text-3xl leading-9 tracking-tight text-neutral-950">
                {weather.current.temperature_2m}
              </span>
              <span className="text-sm text-gray-500">
                {weather.current_units.temperature_2m}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-neutral-950">
                {weather.current.wind_speed_10m}{" "}
                {weather.current_units.wind_speed_10m}
              </span>
            </div>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
