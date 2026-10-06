import { Link } from "@tanstack/react-router";
import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  tone = "default",
  id,
}: {
  children: ReactNode;
  className?: string | undefined;
  tone?: "default" | "card" | "navy";
  id?: string | undefined;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 md:py-28",
        tone === "card" && "bg-card",
        tone === "navy" && "navy-panel",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, invert }: { children: ReactNode; invert?: boolean | undefined }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em]",
        invert
          ? "border-white/20 bg-white/5 text-[color:var(--sky)]"
          : "border-border bg-secondary text-primary",
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  invert,
  align = "left",
}: {
  eyebrow?: string | undefined;
  title: ReactNode;
  lead?: ReactNode | undefined;
  invert?: boolean | undefined;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        invert && "text-navy-foreground",
      )}
    >
      {eyebrow ? <Eyebrow invert={invert}>{eyebrow}</Eyebrow> : null}
      <h2
        className={cn(
          "mt-5 text-3xl font-semibold leading-[1.12] md:text-[2.65rem]",
          invert ? "text-navy-foreground" : "text-navy",
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed md:text-lg",
            invert ? "text-white/70" : "text-muted-foreground",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}

type ButtonTone = "primary" | "outline" | "ghost-invert" | "light";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60";

const buttonTones: Record<ButtonTone, string> = {
  primary: "bg-primary text-primary-foreground shadow-card hover:bg-primary/90 hover:-translate-y-0.5",
  outline: "border border-navy/25 text-navy hover:border-navy hover:bg-navy hover:text-navy-foreground",
  "ghost-invert": "border border-white/25 text-navy-foreground hover:bg-white/10",
  light: "bg-white text-navy hover:bg-white/90 hover:-translate-y-0.5",
};

export function CtaLink({
  to,
  search,
  children,
  tone = "primary",
  className,
  onClick,
}: {
  to: string;
  search?: Record<string, string> | undefined;
  children: ReactNode;
  tone?: ButtonTone;
  className?: string | undefined;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
}) {
  return (
    <Link
      to={to as never}
      search={search as never}
      className={cn(buttonBase, buttonTones[tone], className)}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

export function buttonClass(tone: ButtonTone = "primary", className?: string) {
  return cn(buttonBase, buttonTones[tone], className);
}

export function Card({
  children,
  className,
  invert,
}: {
  children: ReactNode;
  className?: string | undefined;
  invert?: boolean | undefined;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-7 transition-all duration-300",
        invert
          ? "border-white/12 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]"
          : "border-border bg-card shadow-card hover:-translate-y-1 hover:border-primary/35",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Stat({ value, label, invert }: { value: string; label: string; invert?: boolean | undefined }) {
  return (
    <div>
      <div
        className={cn(
          "font-display text-3xl font-semibold md:text-4xl",
          invert ? "text-[color:var(--sky)]" : "text-primary",
        )}
      >
        {value}
      </div>
      <div
        className={cn(
          "mt-2 text-sm leading-snug",
          invert ? "text-white/65" : "text-muted-foreground",
        )}
      >
        {label}
      </div>
    </div>
  );
}
