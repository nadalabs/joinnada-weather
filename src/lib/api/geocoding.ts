import type { ApiResult, GeoResult } from "@/lib/types";

interface GeocodeApiResponse {
  results?: GeoResult[];
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

function buildGeocodeUrl(capital: string, countryCode: string): string {
  const params = new URLSearchParams({
    name: capital,
    count: "10",
    language: "en",
    countryCode: countryCode.toUpperCase(),
  });

  return `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`;
}

export async function fetchGeocodeCandidates(
  capital: string,
  countryCode: string,
  signal?: AbortSignal
): Promise<ApiResult<GeoResult[]>> {
  try {
    const response = await fetch(buildGeocodeUrl(capital, countryCode), { signal });
    if (!response.ok) {
      return {
        ok: false,
        kind: "http",
        message: `Geocoding request failed with status ${response.status}.`,
      };
    }

    const json = (await response.json()) as GeocodeApiResponse;
    const results = Array.isArray(json.results) ? json.results : [];
    const filtered = results.filter(
      (candidate) => candidate.country_code?.toUpperCase() === countryCode.toUpperCase()
    );

    return { ok: true, data: filtered };
  } catch (error) {
    if (isAbortError(error)) {
      return { ok: false, kind: "aborted", message: "Geocoding request canceled." };
    }

    return {
      ok: false,
      kind: "network",
      message: "Unable to resolve the capital city location right now.",
    };
  }
}
