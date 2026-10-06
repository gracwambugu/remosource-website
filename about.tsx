import { createFileRoute } from "@tanstack/react-router";
import { Card, Section, SectionHeading, Stat } from "@/components/site/primitives";
import { CtaBanner, Testimonials } from "@/components/site/blocks";
import { stats } from "@/lib/remosource-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About RemoSource — Global Remote Talent Recruitment" },
      { name: "description", content: "RemoSource is a global remote talent recruitment and matching partner. We recruit, assess, interview, vet and match professionals to companies building teams without borders." },
      { property: "og:title", content: "About RemoSource — Global Remote Talent Recruitment" },
      { property: "og:description", content: "Who we are, what we believe, and how we hold our standard across 40+ countries." },
    ],
  }),
  component: About,
});

const values = [
  { title: "Rigour over volume", body: "We would rather send three candidates we can defend than thirty we cannot." },
  { title: "Dignity in hiring", body: "Professionals are assessed on capability, never priced down because of where they live." },
  { title: "Honest timelines", body: "If a role is hard, we say so before you sign anything." },
  { title: "Privacy by default", body: "Candidate identities are protected until the candidate chooses otherwise." },
  { title: "Long-term matches", body: "We optimise for the twelve-month outcome, not the placement fee." },
  { title: "Global by design", body: "Talent is evenly distributed. Opportunity is not. Our whole business exists to close that gap." },
];

function About() {
  return (
    <>
      <Section tone="navy" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 hairline-grid opacity-40" />
        <div className="relative max-w-3xl">
          <SectionHeading
            invert
            eyebrow="About us"
            title="Build your team without borders."
            lead="RemoSource is a recruitment and matching partner for remote work. We are not an AI assistant, a virtual-assistant agency, a cheap freelancer marketplace or an outsourcing vendor. We are recruiters — people who source, assess, interview and vet other people."
          />
        </div>
      </Section>

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            <h2 className="font-display text-3xl font-semibold text-navy">Why we exist</h2>
            <p>Exceptional professionals in Nairobi, Bogotá, Manila and Warsaw are still overlooked by companies who never learned how to hire outside their own postcode. Meanwhile those same companies burn months on searches that end in a mediocre local compromise.</p>
            <p>RemoSource closes that gap with process, not promises. Every company gets a discovery consultation, a targeted search and a shortlist backed by evidence. Every professional gets a fair assessment, honest feedback and a placement built to last.</p>
            <p>The name carries our intent: purpose and work, brought together. We do the vetting. You make the choice.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {stats.map((s) => (
              <Card key={s.label} className="p-6">
                <Stat value={s.value} label={s.label} />
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="card">
        <SectionHeading eyebrow="What we stand for" title="Six commitments we hold in every search." />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <Card key={v.title} className="h-full">
              <h3 className="font-display text-lg font-semibold text-navy">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Testimonials />

      <CtaBanner
        title="Work with a partner that takes hiring seriously."
        lead="Whether you are building a team or looking for your next role, start the conversation today."
        primary={{ to: "/hire", label: "Find Talent" }}
        secondary={{ to: "/contact", label: "Contact us" }}
      />
    </>
  );
}
