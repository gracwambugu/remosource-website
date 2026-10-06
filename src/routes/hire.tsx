import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";
import { Card, Section, SectionHeading } from "@/components/site/primitives";
import { HiringForm } from "@/components/site/forms";

type HireSearch = { service?: string | undefined; candidate?: string | undefined };

export const Route = createFileRoute("/hire")({
  validateSearch: (search: Record<string, unknown>): HireSearch => ({
    service: typeof search['service'] === "string" ? search['service'] : undefined,
    candidate: typeof search['candidate'] === "string" ? search['candidate'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Start a Hiring Brief — Find Talent | RemoSource" },
      { name: "description", content: "Tell us what you need. Build your role brief, select the exact skills required, and book a discovery consultation with a RemoSource recruiter." },
      { property: "og:title", content: "Start a Hiring Brief — Find Talent | RemoSource" },
      { property: "og:description", content: "Role builder, multi-skill selection and consultation scheduling in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Start a Hiring Brief — Find Talent | RemoSource" },
      { name: "twitter:description", content: "Build a structured role brief and recommended screening criteria for your remote hire." },
    ],
  }),
  component: Hire,
});

function Hire() {
  const { service, candidate } = Route.useSearch();

  return (
    <>
      <Section tone="navy" className="relative overflow-hidden py-16 md:py-20">
        <div className="pointer-events-none absolute inset-0 hairline-grid opacity-40" />
        <div className="relative max-w-3xl">
          <SectionHeading invert eyebrow="Find talent" title="Tell us what you need. We'll find the right talent." lead="Five minutes now saves weeks of screening later. Everything you enter goes straight to the recruiter who will run your search." />
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
          <Card className="p-8">
            <HiringForm initialService={service} candidateReference={candidate} />
          </Card>
          <Card className="p-7 lg:sticky lg:top-28">
            <h3 className="font-display text-lg font-semibold text-navy">What happens next</h3>
            <ol className="mt-5 space-y-4 text-sm text-muted-foreground">
              {[
                "A recruiter reviews your brief within one business day.",
                "You book a 30-minute discovery consultation.",
                "We source and vet against the agreed brief.",
                "You receive an explained shortlist and interview your favourites.",
              ].map((item, i) => (
                <li key={item} className="flex gap-3">
                  <span className="font-display text-xs font-semibold text-primary">0{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 flex gap-2 border-t border-border pt-5 text-xs text-muted-foreground">
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              No obligation, no CV spam, and no charge until you make a hire.
            </p>
          </Card>
        </div>
      </Section>
    </>
  );
}
