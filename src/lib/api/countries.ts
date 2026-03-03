import type { ApiResult, Country } from "@/lib/types";

const COUNTRIES_URL =
  "https://restcountries.com/v3.1/all?fields=name,cca2,capital,region";

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function fetchCountries(
  signal?: AbortSignal
): Promise<ApiResult<Country[]>> {
  try {
    const response = await fetch(COUNTRIES_URL, { signal });

    if (!response.ok) {
      return {
        ok: false,
        kind: "http",
        message: `Countries request failed with status ${response.status}.`,
      };
    }

    const json = (await response.json()) as unknown;
    if (!Array.isArray(json)) {
      return {
        ok: false,
        kind: "parse",
        message: "Countries API returned an unexpected response shape.",
      };
    }

    const countries = json
      .filter(isRecord)
      .map((item) => {
        const name = isRecord(item.name) ? item.name : null;
        const common = typeof name?.common === "string" ? name.common : null;
        const official =
          typeof name?.official === "string" ? name.official : common;
        const cca2 = typeof item.cca2 === "string" ? item.cca2 : null;
        const region = typeof item.region === "string" ? item.region : "";
        const capital = Array.isArray(item.capital)
          ? item.capital.filter((value): value is string => typeof value === "string")
          : [];

        if (!common || !official || !cca2) {
          return null;
        }

        return {
          name: { common, official },
          cca2: cca2.toUpperCase(),
          region,
          capital,
        } satisfies Country;
      })
      .filter((country): country is Country => country !== null)
      .sort((a, b) => a.name.common.localeCompare(b.name.common));

    return { ok: true, data: countries };
  } catch (error) {
    if (isAbortError(error)) {
      return { ok: false, kind: "aborted", message: "Countries request canceled." };
    }

    return {
      ok: false,
      kind: "network",
      message: "Unable to load countries. Please check your connection.",
    };
  }
}
