import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { Card, Section, SectionHeading } from "@/components/site/primitives";
import { TalentApplicationForm } from "@/components/site/forms";
import { talentProcess } from "@/lib/remosource-data";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply — Join the RemoSource Talent Network" },
      { name: "description", content: "Apply once to be assessed, interviewed and matched to long-term remote roles with international companies. Always free for professionals." },
      { property: "og:title", content: "Apply — Join the RemoSource Talent Network" },
      { property: "og:description", content: "One application, ongoing matching, complete privacy until you consent to an introduction." },
    ],
  }),
  component: Apply,
});

function Apply() {
  return (
    <>
      <Section tone="navy" className="relative overflow-hidden py-16 md:py-20">
        <div className="pointer-events-none absolute inset-0 hairline-grid opacity-40" />
        <div className="relative max-w-3xl">
          <SectionHeading invert eyebrow="Talent application" title="Join the network. Build your career without borders." lead="One application opens you to every matching role we recruit for. It is free, and it always will be." />
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
          <Card className="p-8">
            <TalentApplicationForm />
          </Card>
          <Card className="p-7 lg:sticky lg:top-28">
            <h3 className="font-display text-lg font-semibold text-navy">Your journey</h3>
            <ol className="mt-5 space-y-4 text-sm text-muted-foreground">
              {talentProcess.map((step) => (
                <li key={step.step} className="flex gap-3">
                  <span className="font-display text-xs font-semibold text-primary">{step.step}</span>
                  <span>
                    <span className="block font-medium text-navy">{step.title}</span>
                    {step.body}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-6 flex gap-2 border-t border-border pt-5 text-xs text-muted-foreground">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Your name and contact details are shared with a company only after you approve the introduction.
            </p>
          </Card>
        </div>
      </Section>
    </>
  );
}
