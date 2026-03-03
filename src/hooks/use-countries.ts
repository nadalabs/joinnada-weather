"use client";

import { useEffect, useState } from "react";

import { fetchCountries } from "@/lib/api/countries";
import type { Country } from "@/lib/types";

interface UseCountriesState {
  countries: Country[];
  isLoading: boolean;
  error: string | null;
}

let countriesCache: Country[] | null = null;

export function useCountries(): UseCountriesState {
  const [countries, setCountries] = useState<Country[]>(countriesCache ?? []);
  const [isLoading, setIsLoading] = useState<boolean>(countriesCache === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (countriesCache) {
      return;
    }

    const controller = new AbortController();
    void (async () => {
      setIsLoading(true);
      const result = await fetchCountries(controller.signal);

      if (!result.ok) {
        if (result.kind !== "aborted") {
          setError(result.message);
          setIsLoading(false);
        }
        return;
      }

      countriesCache = result.data;
      setCountries(result.data);
      setError(null);
      setIsLoading(false);
    })();

    return () => controller.abort();
  }, []);

  return { countries, isLoading, error };
}
