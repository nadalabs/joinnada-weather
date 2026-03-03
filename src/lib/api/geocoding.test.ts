import { fetchGeocodeCandidates } from "@/lib/api/geocoding";

describe("fetchGeocodeCandidates", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("filters geocoding results to selected country code", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            id: 1,
            name: "Paris",
            latitude: 48.86,
            longitude: 2.35,
            country_code: "FR",
          },
          {
            id: 2,
            name: "Paris",
            latitude: 33.66,
            longitude: -95.55,
            country_code: "US",
          },
        ],
      }),
    } as Response);

    const result = await fetchGeocodeCandidates("Paris", "FR");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
      expect(result.data[0].country_code).toBe("FR");
    }
  });
});
