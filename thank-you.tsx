import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, CheckCircle2, Mail } from "lucide-react";
import { Card, Section, buttonClass } from "@/components/site/primitives";

type ThankYouSearch = { flow?: string | undefined };

export const Route = createFileRoute("/thank-you")({
  validateSearch: (search: Record<string, unknown>): ThankYouSearch => ({
    flow: typeof search['flow'] === "string" ? search['flow'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Thank You — Next Steps | RemoSource" },
      { name: "description", content: "Your submission has been received. Book your consultation slot and see what happens next with RemoSource." },
      { property: "og:title", content: "Thank You — Next Steps | RemoSource" },
      { property: "og:description", content: "Submission received. Here is what happens next." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYou,
});

const copy: Record<string, { title: string; lead: string; scheduling: boolean }> = {
  hire: {
    title: "Brief received. Let's book your discovery consultation.",
    lead: "A recruiter is reviewing your requirements now. Choose a slot below and we will confirm by email within one business day.",
    scheduling: true,
  },
  apply: {
    title: "Application received.",
    lead: "We review every application by hand. If your profile matches live demand, you'll receive an assessment invitation by email within five business days.",
    scheduling: false,
  },
  referral: {
    title: "Referral received.",
    lead: "We'll reach out to your referral, keep you updated on their progress, and confirm your reward once the qualifying period passes.",
    scheduling: false,
  },
  contact: {
    title: "Message received.",
    lead: "We reply within one business day on the channel you selected.",
    scheduling: false,
  },
};

const slots = [
  "Tomorrow · 09:00–09:30",
  "Tomorrow · 14:00–14:30",
  "In 2 days · 11:00–11:30",
  "In 3 days · 16:00–16:30",
];

function ThankYou() {
  const { flow } = Route.useSearch();
  const content = copy[flow ?? "contact"] ?? copy['contact']!;

  return (
    <Section className="py-24 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h1 className="mt-7 font-display text-3xl font-semibold leading-tight text-navy md:text-4xl">
          {content.title}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">{content.lead}</p>
      </div>

      {content.scheduling ? (
        <Card className="mx-auto mt-12 max-w-3xl p-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-navy">
            <CalendarClock className="h-4.5 w-4.5 text-primary" /> Consultation scheduling
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Scheduling placeholder — this will connect to our live calendar. Pick a preferred window
            and a recruiter will confirm it by email.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {slots.map((slot) => (
              <button
                key={slot}
                type="button"
                className="rounded-xl border border-border bg-background px-5 py-4 text-left text-sm font-medium text-navy transition-all hover:border-primary hover:bg-primary/5"
              >
                {slot}
              </button>
            ))}
          </div>
          <p className="mt-6 flex items-center gap-2 border-t border-border pt-5 text-xs text-muted-foreground">
            <Mail className="h-4 w-4 text-primary" /> A confirmation email with the meeting link
            follows every booking.
          </p>
        </Card>
      ) : null}

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Link to="/" className={buttonClass("primary", "px-7")}>
          Back to home
        </Link>
        <Link to="/how-it-works" className={buttonClass("outline", "px-7")}>
          See how it works
        </Link>
      </div>
    </Section>
  );
}
