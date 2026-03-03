export interface Country {
  name: { common: string; official: string };
  cca2: string;
  capital: string[];
  region: string;
}

export interface GeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  admin1?: string;
}

export interface WeatherResult {
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  current_units: {
    temperature_2m: string;
    wind_speed_10m: string;
  };
}

export interface FetchedMeta {
  fetchedAt: number;
  provider: "REST Countries" | "Open-Meteo Geocoding" | "Open-Meteo Forecast";
}

export type ApiErrorKind = "aborted" | "network" | "http" | "parse";

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; kind: ApiErrorKind; message: string };

export type ChainState =
  | { status: "idle" }
  | { status: "loadingGeo"; country: Country }
  | { status: "geoError"; country: Country; message: string }
  | {
      status: "geoAmbiguous";
      country: Country;
      candidates: GeoResult[];
      meta: FetchedMeta;
    }
  | {
      status: "loadingWeather";
      country: Country;
      geo: GeoResult;
      geoMeta: FetchedMeta;
    }
  | {
      status: "weatherSuccess";
      country: Country;
      geo: GeoResult;
      weather: WeatherResult;
      geoMeta: FetchedMeta;
      weatherMeta: FetchedMeta;
    }
  | {
      status: "weatherError";
      country: Country;
      geo: GeoResult;
      geoMeta: FetchedMeta;
      message: string;
    };
