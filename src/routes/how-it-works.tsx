import { createFileRoute } from "@tanstack/react-router";
import { ClipboardCheck, FileSearch, MessagesSquare, ShieldCheck, UserCheck } from "lucide-react";
import { Card, CtaLink, Section, SectionHeading } from "@/components/site/primitives";
import { CtaBanner, FaqList, ProcessSteps } from "@/components/site/blocks";
import { businessFaqs, businessProcess, talentProcess } from "@/lib/remosource-data";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Recruiting, Vetting & Matching | RemoSource" },
      {
        name: "description",
        content:
          "Inside the RemoSource process: discovery, targeted sourcing, skills assessment, structured interviews, background checks, shortlist and 90-day aftercare.",
      },
      { property: "og:title", content: "How It Works — Recruiting, Vetting & Matching | RemoSource" },
      {
        property: "og:description",
        content: "We do the vetting. You make the choice. See exactly what that means.",
      },
    ],
  }),
  component: HowItWorks,
});

const vettingLayers = [
  {
    icon: FileSearch,
    title: "Application screening",
    body: "Every profile is read by a recruiter in that discipline. Roughly 3 in 100 applicants continue past this stage.",
  },
  {
    icon: ClipboardCheck,
    title: "Skills assessment",
    body: "Role-relevant testing or a paid work sample — engineering exercises, financial models, support simulations, design critiques.",
  },
  {
    icon: MessagesSquare,
    title: "Structured interview",
    body: "Competency-based interviewing against a scorecard, plus a written and spoken communication evaluation.",
  },
  {
    icon: ShieldCheck,
    title: "Verification",
    body: "Identity, right-to-work where relevant, credential verification, two professional references and background screening.",
  },
  {
    icon: UserCheck,
    title: "Match review",
    body: "A second recruiter reviews the fit against your brief before any candidate reaches your shortlist.",
  },
];

function HowItWorks() {
  return (
    <>
      <Section tone="navy" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 hairline-grid opacity-40" />
        <div className="relative max-w-3xl">
          <SectionHeading
            invert
            eyebrow="How it works"
            title="We do the vetting. You make the choice."
            lead="Two journeys run through the same standard of rigour: one for companies who need a role filled, one for professionals who want to be placed well."
          />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="For businesses"
          title="From brief to hire in five stages."
          lead="Median time to first shortlist is 11 business days."
        />
        <ProcessSteps steps={businessProcess} />
        <div className="mt-10">
          <CtaLink to="/hire" className="px-7">
            Start a hiring brief
          </CtaLink>
        </div>
      </Section>

      <Section tone="card">
        <SectionHeading
          eyebrow="For talent"
          title="From application to placement."
          lead="Free, transparent, and built to place you somewhere you will stay."
        />
        <ProcessSteps steps={talentProcess} />
        <div className="mt-10">
          <CtaLink to="/apply" className="px-7">
            Apply to the network
          </CtaLink>
        </div>
      </Section>

      <Section tone="navy">
        <SectionHeading
          invert
          eyebrow="Vetting"
          title="Five layers before a name reaches your shortlist."
          lead="This is the part most platforms skip. It is the whole reason we exist."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vettingLayers.map((layer) => (
            <Card key={layer.title} invert className="h-full">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[color:var(--sky)]">
                <layer.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-navy-foreground">
                {layer.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{layer.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="After the hire"
          title="Placement is the midpoint, not the finish line."
          lead="Onboarding guidance, structured 30/60/90-day check-ins with both sides, and a replacement guarantee if the fit fails."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { title: "Day 1–30", body: "Onboarding support, expectation setting and a first check-in with both parties." },
            { title: "Day 31–60", body: "Performance review against the original brief, with coaching where needed." },
            { title: "Day 61–90", body: "Final review, retention planning and confirmation of the guarantee period." },
          ].map((item) => (
            <Card key={item.title} className="h-full">
              <h3 className="font-display text-base font-semibold text-navy">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <FaqList items={businessFaqs} title="Process questions" eyebrow="FAQ" />

      <CtaBanner
        title="Tell us what you need. We'll find the right talent."
        lead="Thirty minutes on a call is usually enough for us to tell you whether we are the right partner."
        primary={{ to: "/hire", label: "Find Talent" }}
        secondary={{ to: "/apply", label: "Join Talent Network" }}
      />
    </>
  );
}
