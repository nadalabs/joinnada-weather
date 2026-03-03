"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { fetchGeocodeCandidates } from "@/lib/api/geocoding";
import { fetchWeather } from "@/lib/api/weather";
import type { ChainState, Country, FetchedMeta, GeoResult } from "@/lib/types";

interface UseWeatherChainResult {
  state: ChainState;
  selectCountry: (country: Country) => Promise<void>;
  selectGeoCandidate: (geo: GeoResult) => Promise<void>;
  reset: () => void;
}

function getGeoMeta(): FetchedMeta {
  return { fetchedAt: Date.now(), provider: "Open-Meteo Geocoding" };
}

function getWeatherMeta(): FetchedMeta {
  return { fetchedAt: Date.now(), provider: "Open-Meteo Forecast" };
}

export function useWeatherChain(): UseWeatherChainResult {
  const [state, setState] = useState<ChainState>({ status: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const loadWeather = useCallback(
    async (
      country: Country,
      geo: GeoResult,
      geoMeta: FetchedMeta,
      signal: AbortSignal
    ) => {
      setState({ status: "loadingWeather", country, geo, geoMeta });
      const weatherResult = await fetchWeather(geo.latitude, geo.longitude, signal);

      if (!weatherResult.ok) {
        if (weatherResult.kind === "aborted") {
          return;
        }

        setState({
          status: "weatherError",
          country,
          geo,
          geoMeta,
          message: weatherResult.message,
        });
        return;
      }

      setState({
        status: "weatherSuccess",
        country,
        geo,
        weather: weatherResult.data,
        geoMeta,
        weatherMeta: getWeatherMeta(),
      });
    },
    []
  );

  const selectCountry = useCallback(
    async (country: Country) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (!country.capital[0]) {
        setState({
          status: "geoError",
          country,
          message: "This country does not have a listed capital in the data source.",
        });
        return;
      }

      setState({ status: "loadingGeo", country });
      const geoResult = await fetchGeocodeCandidates(
        country.capital[0],
        country.cca2,
        controller.signal
      );

      if (!geoResult.ok) {
        if (geoResult.kind === "aborted") {
          return;
        }

        setState({ status: "geoError", country, message: geoResult.message });
        return;
      }

      if (geoResult.data.length === 0) {
        setState({
          status: "geoError",
          country,
          message: "No geocoding candidates found for this capital city.",
        });
        return;
      }

      const geoMeta = getGeoMeta();
      if (geoResult.data.length > 1) {
        setState({
          status: "geoAmbiguous",
          country,
          candidates: geoResult.data,
          meta: geoMeta,
        });
        return;
      }

      await loadWeather(country, geoResult.data[0], geoMeta, controller.signal);
    },
    [loadWeather]
  );

  const selectGeoCandidate = useCallback(
    async (geo: GeoResult) => {
      if (state.status !== "geoAmbiguous") {
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      await loadWeather(state.country, geo, state.meta, controller.signal);
    },
    [loadWeather, state]
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({ status: "idle" });
  }, []);

  return { state, selectCountry, selectGeoCandidate, reset };
}
