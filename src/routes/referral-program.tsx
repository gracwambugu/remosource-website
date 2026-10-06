import { createFileRoute } from "@tanstack/react-router";
import { Card, Section, SectionHeading } from "@/components/site/primitives";
import { CtaBanner } from "@/components/site/blocks";
import { ReferralForm } from "@/components/site/forms";

export const Route = createFileRoute("/referral-program")({
  head: () => ({
    meta: [
      { title: "Referral Programme — Refer & Earn | RemoSource" },
      { name: "description", content: "Refer a professional or a hiring company to RemoSource and earn a reward when the placement is confirmed. Transparent terms, global payouts." },
      { property: "og:title", content: "Referral Programme — Refer & Earn | RemoSource" },
      { property: "og:description", content: "Earn when your referral is placed. Simple terms, paid globally." },
    ],
  }),
  component: ReferralProgram,
});

const tiers = [
  { title: "Refer a professional", reward: "USD 150", body: "Paid once your referral completes vetting and stays 60 days in their placement." },
  { title: "Refer a company", reward: "USD 500", body: "Paid on the company's first confirmed placement through RemoSource." },
  { title: "Refer a team build-out", reward: "USD 1,500", body: "For introductions that lead to three or more placements within twelve months." },
];

const steps = [
  { title: "Submit the introduction", body: "Share their details with their permission. We take it from there." },
  { title: "We run our process", body: "Your referral goes through the same assessment and vetting as everyone else." },
  { title: "You get paid", body: "Once the qualifying period passes, we pay via bank transfer, mobile money, PayPal or Wise." },
];

function ReferralProgram() {
  return (
    <>
      <Section tone="navy" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 hairline-grid opacity-40" />
        <div className="relative max-w-3xl">
          <SectionHeading invert eyebrow="Referral programme" title="Good people know good people." lead="Introduce a professional or a hiring company to RemoSource and share in the outcome when the match works." />
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.title} className="h-full">
              <p className="font-display text-3xl font-semibold text-primary">{tier.reward}</p>
              <h3 className="mt-4 font-display text-lg font-semibold text-navy">{tier.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tier.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="card">
        <SectionHeading eyebrow="How it works" title="Three steps, no paperwork." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Card key={step.title} className="h-full">
              <span className="font-display text-sm font-semibold tracking-[0.2em] text-primary">0{i + 1}</span>
              <h3 className="mt-4 font-display text-lg font-semibold text-navy">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Submit a referral" title="Make an introduction." lead="Please confirm your referral is happy to hear from us before submitting." />
        <Card className="mt-12 p-8">
          <ReferralForm />
        </Card>
      </Section>

      <CtaBanner
        title="Build your team without borders."
        lead="Hiring yourself? Start a brief and we will run the search for you."
        primary={{ to: "/hire", label: "Find Talent" }}
        secondary={{ to: "/apply", label: "Join Talent Network" }}
      />
    </>
  );
}
