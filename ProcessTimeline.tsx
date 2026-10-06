import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  Globe2,
  Headphones,
  MessagesSquare,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const stepIcons = [MessagesSquare, Globe2, ClipboardCheck, UserCheck, Headphones];

export type ProcessStep = { step: string; title: string; body: string };

export function ProcessSteps({
  steps,
  invert,
}: {
  steps: ProcessStep[];
  invert?: boolean | undefined;
}) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLOListElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);

  const goTo = useCallback(
    (next: number) => {
      const index = Math.max(0, Math.min(steps.length - 1, next));
      setActive(index);
      const track = trackRef.current;
      const card = track?.children[index] as HTMLElement | undefined;
      if (track && card && track.scrollWidth > track.clientWidth + 4) {
        track.scrollTo({
          left: Math.max(0, card.offsetLeft - track.offsetLeft - 8),
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        });
      }
    },
    [steps.length],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onUp = () => {
      drag.current = null;
      track.classList.remove("cursor-grabbing");
    };
    window.addEventListener("pointerup", onUp);
    return () => window.removeEventListener("pointerup", onUp);
  }, []);

  const line = invert ? "bg-white/15" : "bg-navy/12";
  const mutedText = invert ? "text-white/40" : "text-navy/35";
  const accent = invert ? "text-[color:var(--sky)]" : "text-primary";

  return (
    <div className="mt-10 lg:-mt-24">
      <div className="mb-6 flex items-center justify-end gap-3 lg:mb-14">
        <button
          type="button"
          aria-label="Previous stage"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors disabled:opacity-30",
            invert
              ? "border-white/20 text-navy-foreground hover:bg-white/10"
              : "border-border text-navy hover:bg-secondary",
          )}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Next stage"
          onClick={() => goTo(active + 1)}
          disabled={active === steps.length - 1}
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors disabled:opacity-30",
            invert
              ? "border-white/20 text-navy-foreground hover:bg-white/10"
              : "border-border text-navy hover:bg-secondary",
          )}
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Numbers + timeline rail (desktop) */}
      <div className="relative hidden lg:block">
        <div className="flex items-end">
          {steps.map((item, i) => (
            <button
              key={item.step}
              type="button"
              onClick={() => goTo(i)}
              className={cn(
                "flex-1 pb-3 text-left font-display text-sm font-semibold tracking-[0.2em] transition-colors motion-reduce:transition-none",
                i === active ? accent : mutedText,
              )}
            >
              {item.step}
            </button>
          ))}
        </div>
        <div className={cn("relative h-px w-full", line)}>
          <div
            className={cn(
              "absolute left-0 top-0 h-px transition-[width] duration-500 ease-out motion-reduce:transition-none",
              invert ? "bg-[color:var(--sky)]" : "bg-primary",
            )}
            style={{ width: `${((active + 0.5) / steps.length) * 100}%` }}
          />
          <div className="absolute inset-x-0 -top-[3px] flex">
            {steps.map((item, i) => (
              <div key={item.step} className="flex-1">
                <span
                  className={cn(
                    "block h-[7px] w-[7px] rounded-full transition-colors motion-reduce:transition-none",
                    i <= active
                      ? invert
                        ? "bg-[color:var(--sky)]"
                        : "bg-primary"
                      : invert
                        ? "bg-white/25"
                        : "bg-navy/20",
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <ol
        ref={trackRef}
        onPointerDown={(e) => {
          const track = trackRef.current;
          if (!track) return;
          drag.current = { x: e.clientX, left: track.scrollLeft };
          track.classList.add("cursor-grabbing");
        }}
        onPointerMove={(e) => {
          const track = trackRef.current;
          if (!track || !drag.current) return;
          track.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
        }}
        className="no-scrollbar mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 lg:snap-none lg:overflow-visible"
      >
        {steps.map((item, i) => {
          const Icon = stepIcons[i % stepIcons.length]!;
          const isActive = i === active;
          return (
            <li
              key={item.step}
              className="min-w-0 w-[78%] shrink-0 snap-start sm:w-[46%] md:w-[34%] lg:w-auto lg:flex-1 lg:shrink"
            >
              <button
                type="button"
                onClick={() => goTo(i)}
                className={cn(
                  "flex h-full w-full flex-col rounded-2xl border p-5 text-left transition-colors duration-300 motion-reduce:transition-none",
                  invert
                    ? isActive
                      ? "border-white/25 bg-white/[0.07]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20"
                    : isActive
                      ? "border-primary/40 bg-card shadow-card"
                      : "border-border bg-card/60 hover:border-primary/30",
                )}
              >
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-xl",
                    invert
                      ? isActive
                        ? "bg-[color:var(--sky)]/20 text-[color:var(--sky)]"
                        : "bg-white/[0.06] text-white/50"
                      : isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-navy/50",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span
                  className={cn(
                    "mt-4 font-display text-[0.7rem] font-semibold tracking-[0.2em] lg:hidden",
                    isActive ? accent : mutedText,
                  )}
                >
                  {item.step}
                </span>
                <h3
                  className={cn(
                    "mt-2 font-display text-base font-semibold leading-snug lg:mt-4",
                    invert ? "text-navy-foreground" : "text-navy",
                  )}
                >
                  {item.title}
                </h3>
                <p
                  className={cn(
                    "mt-2 flex-1 text-[0.8125rem] leading-relaxed",
                    invert ? "text-white/60" : "text-muted-foreground",
                  )}
                >
                  {item.body}
                </p>
                <ArrowRight
                  className={cn(
                    "mt-4 h-4 w-4 transition-colors motion-reduce:transition-none",
                    isActive
                      ? invert
                        ? "text-[color:var(--sky)]"
                        : "text-primary"
                      : invert
                        ? "text-white/30"
                        : "text-navy/30",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ol>

      {/* Progress dots */}
      <div className="mt-6 flex items-center justify-center gap-2 lg:hidden">
        {steps.map((item, i) => (
          <button
            key={item.step}
            type="button"
            aria-label={`Go to stage ${item.step}`}
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none",
              i === active
                ? cn("w-6", invert ? "bg-[color:var(--sky)]" : "bg-primary")
                : cn("w-1.5", invert ? "bg-white/25" : "bg-navy/20"),
            )}
          />
        ))}
      </div>
    </div>
  );
}
