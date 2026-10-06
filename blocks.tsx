import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight, BadgeCheck, Clock3, Globe2, Quote, ShieldCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CtaLink, Section, SectionHeading, buttonClass } from "./primitives";
import type { RoleCategory } from "@/lib/remosource-data";
import { testimonials } from "@/lib/remosource-data";
import { trackConversion } from "@/lib/analytics";

export function ServiceCard({ role }: { role: RoleCategory }) {
  return (
    <Card className="flex h-full flex-col">
      <h3 className="font-display text-lg font-semibold text-navy">{role.name}</h3>
      <p className="mt-1.5 text-sm font-medium text-primary">{role.tagline}</p>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
        {role.description}
      </p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {role.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-navy"
          >
            {skill}
          </span>
        ))}
        {role.skills.length > 4 ? (
          <span className="rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground">
            +{role.skills.length - 4} more
          </span>
        ) : null}
      </div>
      <CtaLink
        to="/hire"
        search={{ service: role.slug }}
        tone="outline"
        className="mt-6 w-full px-5 py-2.5"
      >
        Hire for this <ArrowRight className="h-4 w-4" />
      </CtaLink>
    </Card>
  );
}

export function TalentCard({
  talent,
}: {
  talent: {
    id: string;
    role: string;
    region: string;
    timezone: string;
    experience: string;
    languages: string[];
    skills: string[];
    availability: string;
    vetting: string;
  };
}) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Candidate {talent.id}
          </p>
          <h3 className="mt-2 font-display text-lg font-semibold text-navy">{talent.role}</h3>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          <BadgeCheck className="h-3.5 w-3.5" /> {talent.vetting}
        </span>
      </div>

      <dl className="mt-5 space-y-2.5 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Globe2 className="h-4 w-4 text-primary" /> {talent.region} · {talent.timezone}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock3 className="h-4 w-4 text-primary" /> {talent.experience} experience ·{" "}
          {talent.availability}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" /> Languages:{" "}
          {talent.languages.join(", ")}
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {talent.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-navy"
          >
            {skill}
          </span>
        ))}
      </div>

      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        Identity and contact details are withheld until the candidate consents to an introduction.
      </p>

      <CtaLink
        to="/hire"
        search={{ candidate: talent.id }}
        tone="primary"
        className="mt-5 w-full px-5 py-2.5"
      >
        Request an introduction
      </CtaLink>
    </Card>
  );
}

export { ProcessSteps } from "./ProcessTimeline";

export function Testimonials({ tone = "default" }: { tone?: "default" | "card" }) {
  return (
    <Section tone={tone}>
      <SectionHeading
        eyebrow="Proof"
        title="Companies and professionals who stayed."
        lead="Recruitment is judged twelve months later, not on day one."
      />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <Card key={t.name} className="flex h-full flex-col">
            <Quote className="h-6 w-6 text-[color:var(--sky)]" />
            <p className="mt-5 flex-1 text-sm leading-relaxed text-navy">“{t.quote}”</p>
            <div className="mt-6 border-t border-border pt-5">
              <p className="text-sm font-semibold text-navy">{t.name}</p>
              <p className="text-xs text-muted-foreground">
                {t.title} · {t.location}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export function FaqList({
  items,
  title,
  lead,
  eyebrow = "FAQ",
}: {
  items: { q: string; a: string }[];
  title: string;
  lead?: string | undefined;
  eyebrow?: string | undefined;
}) {
  return (
    <Section>
      <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
      <Accordion type="single" collapsible className="mt-12 w-full">
        {items.map((item) => (
          <AccordionItem key={item.q} value={item.q} className="border-border">
            <AccordionTrigger className="text-left font-display text-base font-semibold text-navy hover:no-underline">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}

export function CtaBanner({
  title,
  lead,
  primary,
  secondary,
  trackingLocation,
}: {
  title: ReactNode;
  lead: string;
  primary: { to: string; label: string };
  secondary?: { to: string; label: string } | undefined;
  trackingLocation?: string | undefined;
}) {
  return (
    <Section tone="navy" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 hairline-grid opacity-40" />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl font-semibold leading-tight text-navy-foreground md:text-[2.6rem]">
          {title}
        </h2>
        <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">{lead}</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to={primary.to as never}
            onClick={() => trackingLocation && trackConversion("homepage_cta_clicked", { location: trackingLocation, label: primary.label, destination: primary.to })}
            className={buttonClass("light", "px-7")}
          >
            {primary.label} <ArrowRight className="h-4 w-4" />
          </Link>
          {secondary ? (
            <Link
              to={secondary.to as never}
              onClick={() => trackingLocation && trackConversion("homepage_cta_clicked", { location: trackingLocation, label: secondary.label, destination: secondary.to })}
              className={buttonClass("ghost-invert", "px-7")}
            >
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
