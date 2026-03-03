"use client";

import { Lock } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface StepCardProps {
  stepNumber: number;
  title: string;
  locked?: boolean;
  sourceText?: string;
  children: ReactNode;
}

export function StepCard({
  stepNumber,
  title,
  locked = false,
  sourceText,
  children,
}: StepCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] outline-black/10",
        locked && "opacity-50"
      )}
    >
      <div className="flex h-12 items-center gap-2.5 border-b border-black/10 pl-4 pr-4">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-900">
          <span className="text-xs leading-4 text-white">{stepNumber}</span>
        </div>
        <span className="text-base font-medium text-neutral-950">{title}</span>
        {locked && <Lock className="ml-auto h-3.5 w-3.5 text-gray-500" />}
      </div>

      <div className="px-4 py-4">{children}</div>

      {sourceText && (
        <div className="border-t border-black/10 bg-gray-200/30 px-4 pb-2 pt-2.5">
          <p className="text-xs leading-4 tracking-tight text-gray-500">
            {sourceText}
          </p>
        </div>
      )}
    </div>
  );
}
