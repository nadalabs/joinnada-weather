"use client";

import { Loader2, Navigation } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ChainState, GeoResult } from "@/lib/types";

interface GeoStepProps {
  state: ChainState;
  onCandidateSelect: (geo: GeoResult) => void;
}

function CandidateRow({
  candidate,
  selected,
  onClick,
}: {
  candidate: GeoResult;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-16 w-full items-center gap-3 rounded-[10px] px-3 text-left outline outline-1 outline-offset-[-1px] transition-colors",
        selected
          ? "bg-gray-950/5 outline-teal-900 shadow-[0px_0px_0px_1px_rgba(3,2,19,0.20)]"
          : "outline-black/10 hover:bg-gray-50"
      )}
    >
      <Navigation
        className={cn(
          "h-4 w-4 shrink-0",
          selected ? "text-teal-900" : "text-gray-500"
        )}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-sm font-medium leading-5">
          <span className={selected ? "text-teal-900" : "text-neutral-950"}>
            {candidate.name}
          </span>
          {candidate.admin1 && (
            <span className="text-gray-500">, {candidate.admin1}</span>
          )}
        </p>
        <p className="text-xs font-medium leading-4 text-gray-500">
          {candidate.latitude.toFixed(4)}°N, {candidate.longitude.toFixed(4)}°E
        </p>
      </div>
      {selected && (
        <span className="shrink-0 rounded-full bg-teal-900 px-2 py-0.5 text-[10px] font-medium leading-4 tracking-tight text-white">
          Selected
        </span>
      )}
    </button>
  );
}

export function GeoStep({ state, onCandidateSelect }: GeoStepProps) {
  switch (state.status) {
    case "loadingGeo":
      return (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Resolving coordinates for {state.country.capital[0]}…</span>
        </div>
      );

    case "geoError":
      return <p className="text-sm text-red-600">{state.message}</p>;

    case "geoAmbiguous":
      return (
        <div className="flex flex-col gap-3">
          <p className="text-xs leading-4 text-gray-500">
            Multiple results found. Select one:
          </p>
          <div className="flex flex-col gap-2">
            {state.candidates.map((candidate) => (
              <CandidateRow
                key={candidate.id}
                candidate={candidate}
                selected={false}
                onClick={() => onCandidateSelect(candidate)}
              />
            ))}
          </div>
        </div>
      );

    case "loadingWeather":
    case "weatherSuccess":
    case "weatherError":
      return (
        <div className="flex flex-col gap-2">
          <CandidateRow
            candidate={state.geo}
            selected={true}
            onClick={() => {}}
          />
        </div>
      );

    default:
      return null;
  }
}
