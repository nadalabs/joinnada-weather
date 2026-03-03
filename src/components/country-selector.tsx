"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Country } from "@/lib/types";

interface CountrySelectorProps {
  countries: Country[];
  selectedCountry: Country | null;
  disabled?: boolean;
  isLoading?: boolean;
  error?: string | null;
  onSelect: (country: Country) => void;
}

export function CountrySelector({
  countries,
  selectedCountry,
  disabled = false,
  isLoading = false,
  error,
  onSelect,
}: CountrySelectorProps) {
  const [open, setOpen] = useState(false);

  const triggerLabel = isLoading
    ? "Loading countries..."
    : selectedCountry
      ? selectedCountry.name.common
      : "Search countries...";

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled || isLoading}>
          <button
            role="combobox"
            aria-expanded={open}
            className="inline-flex h-10 w-full items-center gap-2 rounded-[10px] bg-white px-3 outline outline-1 outline-offset-[-1px] outline-black/10 transition-shadow focus:shadow-[0px_0px_0px_2px_rgba(10,10,10,0.05)] focus:outline-neutral-950/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search className="h-4 w-4 shrink-0 text-gray-500" />
            <span
              className={`flex-1 truncate text-left text-sm ${selectedCountry ? "text-neutral-950" : "text-gray-500"}`}
            >
              {triggerLabel}
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search countries..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries.map((country) => (
                  <CommandItem
                    key={country.cca2}
                    value={`${country.name.common} ${country.cca2} ${country.region}`}
                    onSelect={() => {
                      onSelect(country);
                      setOpen(false);
                    }}
                  >
                    <span className="flex-1">
                      {country.name.common} ({country.cca2})
                      {country.region ? ` — ${country.region}` : ""}
                    </span>
                    {selectedCountry?.cca2 === country.cca2 && (
                      <Check className="h-4 w-4 text-teal-900" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
}
