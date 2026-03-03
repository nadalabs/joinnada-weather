import { fetchWeather } from "@/lib/api/weather";

describe("fetchWeather", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("parses weather payload when response shape is valid", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        timezone: "Europe/Berlin",
        current: {
          time: "2026-01-01T00:00",
          temperature_2m: 20,
          weather_code: 0,
          wind_speed_10m: 8,
        },
        current_units: {
          temperature_2m: "°C",
          wind_speed_10m: "km/h",
        },
      }),
    } as Response);

    const result = await fetchWeather(1, 2);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.current.temperature_2m).toBe(20);
    }
  });

  it("returns parse error for invalid payload", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ invalid: true }),
    } as Response);

    const result = await fetchWeather(1, 2);
    expect(result).toEqual({
      ok: false,
      kind: "parse",
      message: "Weather API returned an unexpected response shape.",
    });
  });
});
