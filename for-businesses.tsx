import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Handshake, ShieldCheck, Target, Timer, Wallet } from "lucide-react";
import { Card, CtaLink, Section, SectionHeading } from "@/components/site/primitives";
import { CtaBanner, FaqList, ProcessSteps, ServiceCard, Testimonials } from "@/components/site/blocks";
import { businessFaqs, businessProcess, engagementModels, roleCategories } from "@/lib/remosource-data";

export const Route = createFileRoute("/for-businesses")({
  head: () => ({
    meta: [
      { title: "For Businesses — Hire Vetted Remote Talent | RemoSource" },
      {
        name: "description",
        content:
          "Tell us what you need. We'll find the right talent. RemoSource sources, assesses and vets remote professionals against your brief, then delivers an explained shortlist.",
      },
      { property: "og:title", content: "For Businesses — Hire Vetted Remote Talent | RemoSource" },
      {
        property: "og:description",
        content:
          "A real recruitment partner for distributed teams: discovery, sourcing, assessment, shortlist, aftercare.",
      },
    ],
  }),
  component: ForBusinesses,
});

const differentiators = [
  {
    icon: Target,
    title: "We recruit to a brief",
    body: "Every search starts with a consultation about outcomes, working hours and team fit — not a keyword search on a database.",
  },
  {
    icon: ShieldCheck,
    title: "Evidence, not adjectives",
    body: "Shortlists arrive with assessment results, interview notes and reference outcomes so you can compare candidates properly.",
  },
  {
    icon: Timer,
    title: "Speed without shortcuts",
    body: "Median first shortlist in 11 days. If a role needs longer to do properly, we tell you before we start.",
  },
  {
    icon: Wallet,
    title: "Transparent commercials",
    body: "One clear fee structure agreed upfront. No hidden margin layered on top of your professional's compensation.",
  },
  {
    icon: Handshake,
    title: "We stay after the placement",
    body: "Onboarding support, 30/60/90-day check-ins and a replacement guarantee if fit fails.",
  },
  {
    icon: BadgeCheck,
    title: "People, not tooling",
    body: "RemoSource is not an AI assistant, a VA agency or an outsourcing vendor. You hire named professionals who work with your team.",
  },
];

function ForBusinesses() {
  return (
    <>
      <Section tone="navy" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 hairline-grid opacity-40" />
        <div className="relative max-w-3xl">
          <SectionHeading
            invert
            eyebrow="For businesses"
            title="Tell us what you need. We'll find the right talent."
            lead="You should not have to sift 400 applications to find one good operator. Give us the brief and we will run the search, the assessments and the interviews — and hand you a shortlist you can actually decide from."
          />
          <div className="mt-10 flex flex-wrap gap-3">
            <CtaLink to="/hire" tone="light" className="px-7">
              Start a hiring brief
            </CtaLink>
            <CtaLink to="/talent" tone="ghost-invert" className="px-7">
              Browse vetted talent
            </CtaLink>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Why RemoSource"
          title="What a recruitment partner should actually do."
          lead="Six commitments that separate us from marketplaces, VA agencies and outsourcing vendors."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((item) => (
            <Card key={item.title} className="h-full">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-navy">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="card">
        <SectionHeading
          eyebrow="Engagement models"
          title="Hire the way the work actually needs to be done."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {engagementModels.map((model) => (
            <Card key={model.title} className="h-full p-6">
              <h3 className="font-display text-base font-semibold text-navy">{model.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{model.detail}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Roles we fill"
          title="Choose a discipline to begin."
          lead="Your selection is carried into the hiring form so you never re-enter the same information."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roleCategories.map((role) => (
            <ServiceCard key={role.slug} role={role} />
          ))}
        </div>
      </Section>

      <Section tone="navy">
        <SectionHeading
          invert
          eyebrow="How hiring works"
          title="We do the vetting. You make the choice."
        />
        <ProcessSteps steps={businessProcess} invert />
      </Section>

      <Testimonials tone="card" />

      <FaqList
        items={businessFaqs}
        title="Questions hiring teams ask us"
        lead="If your question is not here, ask it directly — we answer within one business day."
      />

      <CtaBanner
        title="Build your team without borders."
        lead="Start with a discovery consultation. We will tell you honestly whether we can fill the role, and how long it will take."
        primary={{ to: "/hire", label: "Start a hiring brief" }}
        secondary={{ to: "/contact", label: "Talk to us first" }}
      />
    </>
  );
}
