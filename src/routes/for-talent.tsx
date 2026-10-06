import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, HeartHandshake, Lock, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { Card, CtaLink, Section, SectionHeading } from "@/components/site/primitives";
import { CtaBanner, FaqList, ProcessSteps } from "@/components/site/blocks";
import { roleCategories, talentFaqs, talentProcess } from "@/lib/remosource-data";

export const Route = createFileRoute("/for-talent")({
  head: () => ({
    meta: [
      { title: "For Talent — Join the RemoSource Global Network" },
      {
        name: "description",
        content:
          "Apply once and be matched to long-term remote roles with international companies. RemoSource never charges professionals, and your details stay private until you consent.",
      },
      { property: "og:title", content: "For Talent — Join the RemoSource Global Network" },
      {
        property: "og:description",
        content:
          "Get assessed, interviewed and matched to real remote roles. Free for professionals, always.",
      },
    ],
  }),
  component: ForTalent,
});

const promises = [
  {
    icon: Wallet,
    title: "Always free for you",
    body: "No application fees, no placement fees, no commission taken out of your pay. Companies pay us.",
  },
  {
    icon: Lock,
    title: "Your privacy is protected",
    body: "Public profiles show a reference ID, region and skills only. Your name reaches a company after you approve it.",
  },
  {
    icon: Sparkles,
    title: "Roles worth having",
    body: "Long-term positions with international companies — not gigs, task boards or hour-billed micro-work.",
  },
  {
    icon: ShieldCheck,
    title: "A fair assessment",
    body: "You are evaluated on demonstrated skill and communication, not on how cheaply you will work.",
  },
  {
    icon: HeartHandshake,
    title: "A recruiter who stays",
    body: "The same person guides you through assessment, interviews, offer and your first months on the job.",
  },
  {
    icon: BadgeCheck,
    title: "Feedback either way",
    body: "If you are not matched, we tell you why and what would make you a stronger candidate next time.",
  },
];

function ForTalent() {
  return (
    <>
      <Section tone="navy" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 hairline-grid opacity-40" />
        <div className="relative max-w-3xl">
          <SectionHeading
            invert
            eyebrow="For talent"
            title="Your skills deserve a border-free market."
            lead="You do not need to send another hundred applications into silence. Apply once to RemoSource, get properly assessed, and be matched to companies that are actively hiring for what you do."
          />
          <div className="mt-10 flex flex-wrap gap-3">
            <CtaLink to="/apply" tone="light" className="px-7">
              Join Talent Network
            </CtaLink>
            <CtaLink to="/how-it-works" tone="ghost-invert" className="px-7">
              See the process
            </CtaLink>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Our promises"
          title="What you get from being in the network."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {promises.map((item) => (
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
          eyebrow="Your journey"
          title="Five steps from application to placement."
          lead="Most professionals complete assessment and interview within two weeks of applying."
        />
        <ProcessSteps steps={talentProcess} />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Disciplines we place"
          title="Where our clients are hiring."
          lead="Apply under the discipline closest to your work — you can select multiple skills inside it."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roleCategories.map((role) => (
            <Card key={role.slug} className="h-full p-6">
              <h3 className="font-display text-base font-semibold text-navy">{role.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{role.tagline}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10">
          <CtaLink to="/apply" className="px-7">
            Start your application
          </CtaLink>
        </div>
      </Section>

      <FaqList
        items={talentFaqs}
        title="Questions professionals ask us"
        lead="Straight answers, before you spend time on an application."
      />

      <CtaBanner
        title="Build your career without borders."
        lead="One application. Real assessment. Roles with companies that want long-term teammates."
        primary={{ to: "/apply", label: "Join Talent Network" }}
        secondary={{ to: "/referral-program", label: "Refer a colleague" }}
      />
    </>
  );
}
