"use client";

import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";

import { CountryStep } from "@/components/country-step";
import { GeoStep } from "@/components/geo-step";
import { StepCard } from "@/components/step-card";
import { WeatherStep } from "@/components/weather-step";
import { formatTime } from "@/lib/utils";
import type { ChainState, GeoResult } from "@/lib/types";

interface DataChainProps {
  state: ChainState;
  onGeoCandidateSelect: (geo: GeoResult) => void;
}

function WaitingContent() {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Lock className="h-4 w-4" />
      <span>Waiting for previous step…</span>
    </div>
  );
}

export function DataChain({ state, onGeoCandidateSelect }: DataChainProps) {
  const [countryFetchedAt, setCountryFetchedAt] = useState<number | null>(null);
  const prevStatusRef = useRef(state.status);

  useEffect(() => {
    if (state.status !== "idle" && prevStatusRef.current === "idle") {
      setCountryFetchedAt(Date.now());
    }
    prevStatusRef.current = state.status;
  }, [state.status]);

  const hasCountry = state.status !== "idle";
  const geoLocked = state.status === "idle";
  const weatherLocked =
    state.status === "idle" ||
    state.status === "loadingGeo" ||
    state.status === "geoError" ||
    state.status === "geoAmbiguous";

  const countrySourceText =
    hasCountry && countryFetchedAt
      ? `Source: REST Countries API · Fetched ${formatTime(countryFetchedAt)}`
      : undefined;

  const geoSourceText =
    !geoLocked &&
    state.status !== "loadingGeo" &&
    state.status !== "geoError"
      ? "Source: Open-Meteo Geocoding API"
      : undefined;

  const weatherSourceText =
    state.status === "weatherSuccess"
      ? `Source: Open-Meteo Forecast API · Timezone: ${state.weather.timezone}`
      : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StepCard
          stepNumber={1}
          title="Country"
          sourceText={hasCountry ? countrySourceText : undefined}
        >
          {hasCountry ? (
            <CountryStep country={state.country} />
          ) : (
            <p className="text-sm text-gray-500">Select a country to begin.</p>
          )}
        </StepCard>

        <StepCard
          stepNumber={2}
          title="Geocode"
          locked={geoLocked}
          sourceText={geoSourceText}
        >
          {geoLocked ? (
            <WaitingContent />
          ) : (
            <GeoStep state={state} onCandidateSelect={onGeoCandidateSelect} />
          )}
        </StepCard>
      </div>

      <StepCard
        stepNumber={3}
        title="Weather"
        locked={weatherLocked}
        sourceText={weatherSourceText}
      >
        {weatherLocked ? (
          <WaitingContent />
        ) : (
          <WeatherStep state={state} />
        )}
      </StepCard>
    </div>
  );
}
