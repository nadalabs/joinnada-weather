"use client";

import { useRef } from "react";
import { Flag, Globe, Lock, MapPin } from "lucide-react";

import { GeoStep } from "@/components/geo-step";
import { StepCard } from "@/components/step-card";
import { WeatherStep } from "@/components/weather-step";
import type { ChainState, Country, GeoResult } from "@/lib/types";

interface DataChainProps {
  state: ChainState;
  country: Country | null;
  onGeoCandidateSelect: (geo: GeoResult) => void;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

function CountryStepContent({ country }: { country: Country }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gray-200">
          <Flag className="h-5 w-5 text-neutral-950" />
        </div>
        <div className="flex flex-col">
          <span className="text-base leading-6 text-neutral-950">
            {country.name.common}
          </span>
          <span className="text-xs leading-4 text-gray-500">
            {country.cca2}
          </span>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex items-start gap-2">
          <Globe className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-xs leading-4 tracking-tight text-gray-500">
              Region
            </span>
            <span className="text-sm leading-5 text-neutral-950">
              {country.region}
            </span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-xs leading-4 tracking-tight text-gray-500">
              Capital
            </span>
            <span className="text-sm leading-5 text-neutral-950">
              {country.capital[0] ?? "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DataChain({
  state,
  country,
  onGeoCandidateSelect,
}: DataChainProps) {
  const countryFetchedAtRef = useRef<number | null>(null);
  const prevStatusRef = useRef(state.status);

  if (state.status !== "idle" && prevStatusRef.current === "idle") {
    countryFetchedAtRef.current = Date.now();
  }
  prevStatusRef.current = state.status;

  const hasCountry = state.status !== "idle" && country !== null;
  const geoLocked = state.status === "idle";
  const weatherLocked =
    state.status === "idle" ||
    state.status === "loadingGeo" ||
    state.status === "geoError" ||
    state.status === "geoAmbiguous";

  const countrySourceText =
    hasCountry && countryFetchedAtRef.current
      ? `Source: REST Countries API · Fetched ${formatTime(countryFetchedAtRef.current)}`
      : undefined;

  return (
    <div className="flex flex-col gap-4">
      <StepCard
        stepNumber={1}
        title="Country"
        sourceText={hasCountry ? countrySourceText : undefined}
      >
        {hasCountry && country ? (
          <CountryStepContent country={country} />
        ) : (
          <p className="text-sm text-gray-500">Select a country to begin.</p>
        )}
      </StepCard>

      <StepCard
        stepNumber={2}
        title="Geocode"
        locked={geoLocked}
        sourceText={
          !geoLocked &&
          state.status !== "loadingGeo" &&
          state.status !== "geoError"
            ? "Source: Open-Meteo Geocoding API"
            : undefined
        }
      >
        {geoLocked ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lock className="h-4 w-4" />
            <span>Waiting for previous step...</span>
          </div>
        ) : (
          <GeoStep state={state} onCandidateSelect={onGeoCandidateSelect} />
        )}
      </StepCard>

      <StepCard
        stepNumber={3}
        title="Weather"
        locked={weatherLocked}
        sourceText={
          state.status === "weatherSuccess"
            ? `Source: Open-Meteo Forecast API · Timezone: ${state.weather.timezone}`
            : undefined
        }
      >
        {weatherLocked ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lock className="h-4 w-4" />
            <span>Waiting for previous step...</span>
          </div>
        ) : (
          <WeatherStep state={state} />
        )}
      </StepCard>
    </div>
  );
}
