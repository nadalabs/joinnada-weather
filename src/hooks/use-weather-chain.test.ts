import { act, renderHook, waitFor } from "@testing-library/react";

import { fetchGeocodeCandidates } from "@/lib/api/geocoding";
import { fetchWeather } from "@/lib/api/weather";
import type { Country, GeoResult } from "@/lib/types";

import { useWeatherChain } from "./use-weather-chain";

jest.mock("@/lib/api/geocoding", () => ({
  fetchGeocodeCandidates: jest.fn(),
}));

jest.mock("@/lib/api/weather", () => ({
  fetchWeather: jest.fn(),
}));

const mockedFetchGeocodeCandidates = jest.mocked(fetchGeocodeCandidates);
const mockedFetchWeather = jest.mocked(fetchWeather);

const country: Country = {
  name: { common: "France", official: "French Republic" },
  cca2: "FR",
  capital: ["Paris"],
  region: "Europe",
};

const geo: GeoResult = {
  id: 1,
  name: "Paris",
  latitude: 48.8566,
  longitude: 2.3522,
  country_code: "FR",
};

describe("useWeatherChain", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("transitions to weatherSuccess on single geocode hit", async () => {
    mockedFetchGeocodeCandidates.mockResolvedValue({ ok: true, data: [geo] });
    mockedFetchWeather.mockResolvedValue({
      ok: true,
      data: {
        timezone: "Europe/Paris",
        current: {
          time: "2026-03-03T12:00",
          temperature_2m: 21,
          weather_code: 1,
          wind_speed_10m: 10,
        },
        current_units: {
          temperature_2m: "°C",
          wind_speed_10m: "km/h",
        },
      },
    });

    const { result } = renderHook(() => useWeatherChain());
    await act(async () => {
      await result.current.selectCountry(country);
    });

    await waitFor(() =>
      expect(result.current.state.status).toBe("weatherSuccess")
    );
  });

  it("enters geoAmbiguous and continues after candidate selection", async () => {
    mockedFetchGeocodeCandidates.mockResolvedValue({
      ok: true,
      data: [geo, { ...geo, id: 2, admin1: "Ile-de-France" }],
    });
    mockedFetchWeather.mockResolvedValue({
      ok: true,
      data: {
        timezone: "Europe/Paris",
        current: {
          time: "2026-03-03T12:00",
          temperature_2m: 19,
          weather_code: 2,
          wind_speed_10m: 12,
        },
        current_units: {
          temperature_2m: "°C",
          wind_speed_10m: "km/h",
        },
      },
    });

    const { result } = renderHook(() => useWeatherChain());
    await act(async () => {
      await result.current.selectCountry(country);
    });

    expect(result.current.state.status).toBe("geoAmbiguous");

    await act(async () => {
      await result.current.selectGeoCandidate(geo);
    });

    await waitFor(() =>
      expect(result.current.state.status).toBe("weatherSuccess")
    );
  });

  it("returns geoError when country has no capital", async () => {
    const { result } = renderHook(() => useWeatherChain());

    await act(async () => {
      await result.current.selectCountry({
        ...country,
        capital: [],
      });
    });

    expect(result.current.state.status).toBe("geoError");
  });
});
