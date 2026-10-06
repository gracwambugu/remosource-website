import { createFileRoute } from "@tanstack/react-router";
import { Clock3, Mail, MessageCircle } from "lucide-react";
import { Card, Section, SectionHeading } from "@/components/site/primitives";
import { ContactForm } from "@/components/site/forms";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact RemoSource — Talk to a Recruiter" },
      { name: "description", content: "Speak to the RemoSource team about hiring remote talent, joining the talent network or partnering with us. We reply within one business day." },
      { property: "og:title", content: "Contact RemoSource — Talk to a Recruiter" },
      { property: "og:description", content: "Hiring enquiries, talent questions, partnerships and referrals — one place to reach us." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <Section tone="navy" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 hairline-grid opacity-40" />
        <div className="relative max-w-3xl">
          <SectionHeading invert eyebrow="Contact" title="Let's talk about the role you need to fill." lead="Tell us what you need. We'll find the right talent — and if we cannot, we will say so honestly." />
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr]">
          <div className="space-y-4">
            <Card className="p-6">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-display text-base font-semibold text-navy">Email</h3>
              <a href="mailto:enquiries@remosource.com" className="mt-1 block text-sm text-muted-foreground hover:text-primary">enquiries@remosource.com</a>
            </Card>
            <Card className="p-6">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-display text-base font-semibold text-navy">WhatsApp</h3>
              <p className="mt-1 text-sm text-muted-foreground">Choose WhatsApp as your reply channel and a recruiter will message you directly.</p>
            </Card>
            <Card className="p-6">
              <Clock3 className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-display text-base font-semibold text-navy">Response time</h3>
              <p className="mt-1 text-sm text-muted-foreground">Within one business day, across every time zone we operate in.</p>
            </Card>
          </div>
          <Card className="p-8">
            <ContactForm />
          </Card>
        </div>
      </Section>
    </>
  );
}
