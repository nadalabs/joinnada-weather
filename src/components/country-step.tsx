"use client";

import { Flag, Globe, MapPin } from "lucide-react";

import type { Country } from "@/lib/types";

interface CountryStepProps {
  country: Country;
}

export function CountryStep({ country }: CountryStepProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gray-200">
          <Flag className="h-5 w-5 text-neutral-950" />
        </div>
        <div className="flex flex-col">
          <span className="text-base leading-6 text-neutral-950">
            {country.name.common}
          </span>
          <span className="text-xs leading-4 text-gray-500">
            {country.cca2}
          </span>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex items-start gap-2">
          <Globe className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-xs leading-4 tracking-tight text-gray-500">
              Region
            </span>
            <span className="text-sm leading-5 text-neutral-950">
              {country.region}
            </span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-xs leading-4 tracking-tight text-gray-500">
              Capital
            </span>
            <span className="text-sm leading-5 text-neutral-950">
              {country.capital[0] ?? "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
