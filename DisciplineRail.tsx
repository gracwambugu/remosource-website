import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CtaLink } from "./primitives";
import type { RoleCategory } from "@/lib/remosource-data";
import { cn } from "@/lib/utils";
import { trackConversion } from "@/lib/analytics";

function DisciplineCard({ role }: { role: RoleCategory }) {
  return (
    <article className="flex h-full min-h-[252px] flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-colors duration-300 hover:border-primary/30 motion-reduce:transition-none">
      <h3 className="font-display text-base font-semibold leading-snug text-navy">
        {role.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{role.tagline}</p>
      <ul className="mt-5 flex flex-1 flex-wrap content-start gap-1.5">
        {role.skills.slice(0, 3).map((skill) => (
          <li
            key={skill}
            className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-navy"
          >
            {skill}
          </li>
        ))}
      </ul>
      <CtaLink
        to="/hire"
        search={{ service: role.slug }}
        tone="outline"
        className="mt-6 w-full px-5 py-2.5"
        onClick={() => trackConversion("homepage_cta_clicked", { location: "disciplines", label: "Hire for this", service: role.slug, destination: "/hire" })}
      >
        Hire for this <ArrowRight className="h-4 w-4" />
      </CtaLink>
    </article>
  );
}

export function DisciplineRail({ roles }: { roles: RoleCategory[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const sync = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    setEdges({
      start: t.scrollLeft <= 4,
      end: t.scrollLeft >= t.scrollWidth - t.clientWidth - 4,
    });
  }, []);

  useEffect(() => {
    sync();
    const onUp = () => {
      const t = trackRef.current;
      if (t) t.classList.remove("cursor-grabbing");
      drag.current = null;
    };
    window.addEventListener("pointerup", onUp);
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const scrollByCard = (dir: 1 | -1) => {
    const t = trackRef.current;
    if (!t) return;
    const card = t.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : t.clientWidth * 0.8;
    t.scrollBy({
      left: dir * step,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  const arrow = (dir: 1 | -1, disabled: boolean) => (
    <button
      type="button"
      aria-label={dir === -1 ? "Previous disciplines" : "Next disciplines"}
      onClick={() => scrollByCard(dir)}
      disabled={disabled}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-background text-navy transition-colors hover:bg-secondary disabled:opacity-30 motion-reduce:transition-none"
    >
      {dir === -1 ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
    </button>
  );

  return (
    <div className="mt-10">
      <div className="mb-6 flex items-center justify-end gap-3 lg:-mt-20 lg:mb-12">
        {arrow(-1, edges.start)}
        {arrow(1, edges.end)}
      </div>

      <ul
        ref={trackRef}
        onScroll={sync}
        onPointerDown={(e) => {
          const t = trackRef.current;
          if (!t) return;
          drag.current = { x: e.clientX, left: t.scrollLeft, moved: false };
          t.classList.add("cursor-grabbing");
        }}
        onPointerMove={(e) => {
          const t = trackRef.current;
          if (!t || !drag.current) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 3) drag.current.moved = true;
          t.scrollLeft = drag.current.left - dx;
        }}
        onClickCapture={(e) => {
          if (drag.current?.moved) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className={cn(
          "no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2",
          "cursor-grab",
        )}
      >
        {roles.map((role) => (
          <li
            key={role.slug}
            className="w-[78%] shrink-0 snap-start sm:w-[48%] lg:w-[29.5%]"
          >
            <DisciplineCard role={role} />
          </li>
        ))}
      </ul>
    </div>
  );
}
