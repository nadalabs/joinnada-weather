"use client";

import { useMemo, useState } from "react";

import { CountrySelector } from "@/components/country-selector";
import { DataChain } from "@/components/data-chain";
import { useCountries } from "@/hooks/use-countries";
import { useWeatherChain } from "@/hooks/use-weather-chain";
import type { Country } from "@/lib/types";

export function CountryExplorer() {
  const {
    countries,
    isLoading: countriesLoading,
    error: countriesError,
  } = useCountries();
  const { state, selectCountry, selectGeoCandidate } = useWeatherChain();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const selectorDisabled = useMemo(
    () => state.status === "loadingGeo" || state.status === "loadingWeather",
    [state.status]
  );

  return (
    <main className="min-h-screen bg-zinc-100">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-10">
        <header className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-medium tracking-tight text-neutral-700">
            Country Weather Explorer
          </h1>
          <p className="text-sm text-gray-500">
            Explore a capital&apos;s current weather
          </p>
          <span className="mt-1 inline-flex items-center rounded-full bg-teal-900 px-3 py-1 text-xs leading-4 tracking-tight text-white">
            3-hop API demo
          </span>
        </header>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-500">
            Select a Country
          </label>
          <CountrySelector
            countries={countries}
            selectedCountry={selectedCountry}
            disabled={selectorDisabled}
            isLoading={countriesLoading}
            error={countriesError}
            onSelect={(country) => {
              setSelectedCountry(country);
              void selectCountry(country);
            }}
          />
        </div>

        <DataChain
          state={state}
          country={selectedCountry}
          onGeoCandidateSelect={(geo) => void selectGeoCandidate(geo)}
        />
      </div>
    </main>
  );
}
