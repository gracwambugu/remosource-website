import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Building2, Clock3, Globe2, Search, ShieldCheck, Users2 } from "lucide-react";
import { Card, CtaLink, Section, SectionHeading, Stat, buttonClass } from "@/components/site/primitives";
import { CtaBanner, ProcessSteps, Testimonials } from "@/components/site/blocks";
import { DisciplineRail } from "@/components/site/DisciplineRail";
import { HeroVisuals } from "@/components/site/HeroVisuals";
import { trackConversion } from "@/lib/analytics";

import { businessProcess, roleCategories, stats } from "@/lib/remosource-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RemoSource — Build Your Team Without Borders" },
      {
        name: "description",
        content:
          "RemoSource recruits, assesses, interviews and vets remote professionals worldwide, then matches them to your team. Tell us what you need — we'll find the right talent.",
      },
      { property: "og:title", content: "RemoSource — Build Your Team Without Borders" },
      {
        property: "og:description",
        content:
          "Global remote talent recruitment and matching. We do the vetting. You make the choice.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://remosource.com/" },
      { property: "og:image", content: "https://remosource.com/social/remosource-social.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "RemoSource — Build Your Team Without Borders" },
      { name: "twitter:description", content: "Global remote talent recruitment and matching. We do the vetting. You make the choice." },
      { name: "twitter:image", content: "https://remosource.com/social/remosource-social.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://remosource.com/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <section className="navy-panel relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 hairline-grid opacity-50" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 pb-14 pt-20 sm:px-8 sm:pb-16 sm:pt-20 md:gap-14 lg:min-h-[calc(100svh-73px)] lg:grid-cols-[minmax(0,47fr)_minmax(0,53fr)] lg:items-center lg:gap-10 lg:py-12 xl:gap-16">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--sky)]">
              <Globe2 className="h-3.5 w-3.5" /> Remote talent recruitment & matching
            </span>
            <h1 className="mt-7 font-display text-[2.6rem] font-semibold leading-[1.05] text-navy-foreground sm:text-5xl lg:text-[3.75rem]">
              Build your team
              <br />
              <span className="text-[color:var(--sky)]">without borders.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              Tell us what you need. We'll find the right talent. RemoSource recruits, assesses,
              interviews and vets professionals across 40+ countries — then matches them to the
              roles your business actually needs filled.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/hire" onClick={() => trackConversion("homepage_cta_clicked", { location: "hero", label: "Find Talent", destination: "/hire" })} className={buttonClass("light", "px-7")}>
                Find Talent <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/for-talent" onClick={() => trackConversion("homepage_cta_clicked", { location: "hero", label: "Join Talent Network", destination: "/for-talent" })} className={buttonClass("ghost-invert", "px-7")}>
                Join Talent Network
              </Link>
            </div>
            <p className="mt-7 max-w-lg text-sm leading-relaxed text-white/70">
              Not an AI assistant. Not a freelancer marketplace. A recruitment partner with people
              at both ends.
            </p>
          </div>

          <div className="relative flex min-w-0 items-center justify-center">
            <HeroVisuals />
          </div>

        </div>
      </section>

      <section aria-label="Why businesses trust RemoSource" className="border-b border-border bg-card">
        <div className="mx-auto grid w-full max-w-6xl divide-y divide-border px-5 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0">
          {[
            { icon: ShieldCheck, label: "Pre-vetted professionals" },
            { icon: Globe2, label: "40+ countries represented" },
            { icon: Clock3, label: "Fast, thoughtful response" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center justify-center gap-3 py-5 md:px-6 md:py-6">
              <Icon className="h-4.5 w-4.5 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-sm font-semibold text-navy">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <Section tone="card" className="py-14 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Stat key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Two journeys"
          title="One network. Two very different needs."
          lead="Whether you are hiring or looking to be hired, RemoSource runs a real recruitment process — not a listings board."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Card className="flex flex-col p-9">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </span>
            <h3 className="mt-6 font-display text-2xl font-semibold text-navy">
              For businesses
            </h3>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
              Tell us what you need. We'll find the right talent. You get a short, explained
              shortlist of professionals who have already been assessed, interviewed and
              reference-checked against your brief.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-navy">
              {[
                "Role brief and discovery consultation",
                "Targeted global sourcing, not a database dump",
                "Shortlist with evidence behind every name",
                "90-day aftercare and replacement guarantee",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaLink to="/hire" onClick={() => trackConversion("homepage_cta_clicked", { location: "business_journey", label: "Find Talent", destination: "/hire" })}>Find Talent</CtaLink>
              <CtaLink to="/for-businesses" tone="outline" onClick={() => trackConversion("homepage_cta_clicked", { location: "business_journey", label: "How we hire for you", destination: "/for-businesses" })}>
                How we hire for you
              </CtaLink>
            </div>
          </Card>

          <Card className="flex flex-col p-9">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users2 className="h-5 w-5" />
            </span>
            <h3 className="mt-6 font-display text-2xl font-semibold text-navy">For talent</h3>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
              Apply once and be considered for long-term remote roles with international companies.
              We never charge professionals — and your details stay private until you approve an
              introduction.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-navy">
              {[
                "One application, ongoing matching",
                "Skills assessment and structured interview",
                "Roles with real companies, not gig listings",
                "Support before, during and after placement",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaLink to="/apply" onClick={() => trackConversion("homepage_cta_clicked", { location: "talent_journey", label: "Join Talent Network", destination: "/apply" })}>Join Talent Network</CtaLink>
              <CtaLink to="/for-talent" tone="outline" onClick={() => trackConversion("homepage_cta_clicked", { location: "talent_journey", label: "What to expect", destination: "/for-talent" })}>
                What to expect
              </CtaLink>
            </div>
          </Card>
        </div>
      </Section>

      <Section tone="card">
        <SectionHeading
          eyebrow="Disciplines"
          title="The people behind the work."
          lead="From executive support to marketing, finance and customer operations — tell us what you need filled."
        />
        <DisciplineRail roles={roleCategories} />
      </Section>

      <Section tone="navy">
        <SectionHeading
          invert
          eyebrow="Our process"
          title="We do the vetting. You make the choice."
          lead="Five deliberate stages between your brief and your new hire. Nothing is skipped to make a placement faster."
        />
        <ProcessSteps steps={businessProcess} invert />
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading
            eyebrow="Global reach"
            title="Talent from 40+ countries, matched to your working day."
            lead="Time-zone overlap, language, regulatory familiarity and cultural fit are part of the brief — not an afterthought."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { region: "Africa", detail: "Nairobi · Lagos · Kigali · Cape Town" },
              { region: "Latin America", detail: "Bogotá · Buenos Aires · Mexico City" },
              { region: "South & Southeast Asia", detail: "Bengaluru · Manila · Colombo" },
              { region: "Europe & Middle East", detail: "Warsaw · Belgrade · Amman" },
            ].map((item) => (
              <Card key={item.region} className="p-6">
                <p className="font-display text-base font-semibold text-navy">{item.region}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="card">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-border bg-background p-10 md:flex-row md:items-center">
          <div className="max-w-xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Search className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
              Browse vetted professionals available now
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Anonymised, privacy-conscious profiles of candidates who have already cleared our
              full vetting process.
            </p>
          </div>
          <CtaLink to="/talent" className="px-7" onClick={() => trackConversion("homepage_cta_clicked", { location: "talent_pool", label: "View talent pool", destination: "/talent" })}>
            View talent pool <ArrowRight className="h-4 w-4" />
          </CtaLink>
        </div>
      </Section>

      <Testimonials />

      <CtaBanner
        title="Tell us what you need. We'll find the right talent."
        lead="Start with a 30-minute discovery consultation. No obligation, no CV spam — just a clear plan for the role you need to fill."
        primary={{ to: "/hire", label: "Find Talent" }}
        secondary={{ to: "/apply", label: "Join Talent Network" }}
        trackingLocation="final_cta"
      />
    </>
  );
}
