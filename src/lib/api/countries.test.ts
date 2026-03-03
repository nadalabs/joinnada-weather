import { fetchCountries } from "@/lib/api/countries";

describe("fetchCountries", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("requests countries with expected URL and parses response", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [
        {
          name: { common: "Canada", official: "Canada" },
          cca2: "ca",
          capital: ["Ottawa"],
          region: "Americas",
        },
        {
          name: { common: "Brazil", official: "Federative Republic of Brazil" },
          cca2: "br",
          capital: ["Brasilia"],
          region: "Americas",
        },
      ],
    } as Response);

    const result = await fetchCountries();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://restcountries.com/v3.1/all?fields=name,cca2,capital,region",
      { signal: undefined }
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0].name.common).toBe("Brazil");
      expect(result.data[0].cca2).toBe("BR");
    }
  });

  it("returns http error result for non-200 responses", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 503,
    } as Response);

    const result = await fetchCountries();
    expect(result).toEqual({
      ok: false,
      kind: "http",
      message: "Countries request failed with status 503.",
    });
  });
});
