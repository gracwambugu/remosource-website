import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CalendarClock, CheckCircle2 } from "lucide-react";
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

const CAL_BOOKING_URL = "https://cal.com/remosource/30min";

type CalEmbedFunction = ((...args: unknown[]) => void) & {
  q: unknown[][];
  loaded?: boolean;
  ns: Record<string, CalEmbedFunction>;
};

function CalBookingEmbed() {
  const embedRef = useRef<HTMLDivElement>(null);
  const [embedFailed, setEmbedFailed] = useState(false);

  useEffect(() => {
    const embed = embedRef.current;
    if (!embed) return;

    const calWindow = window as Window & { Cal?: CalEmbedFunction };
    const namespace = "remosourceHiring";
    const selector = "#cal-booking-inline";
    let script = document.querySelector<HTMLScriptElement>(
      'script[src="https://app.cal.com/embed/embed.js"]',
    );
    if (!calWindow.Cal) {
      const cal = ((...args: unknown[]) => {
        cal.q.push(args);
      }) as CalEmbedFunction;
      cal.q = [];
      cal.ns = {};
      cal.loaded = true;
      calWindow.Cal = cal;
      script = document.createElement("script");
      script.src = "https://app.cal.com/embed/embed.js";
      script.async = true;
      document.head.appendChild(script);
    }

    const cal = calWindow.Cal;
    if (!cal) {
      setEmbedFailed(true);
      return;
    }
    cal("init", namespace, { origin: "https://cal.com" });
    const calNamespace = (cal.ns[namespace] ??= ((...args: unknown[]) => {
      calNamespace.q.push(args);
    }) as CalEmbedFunction);
    calNamespace.q ??= [];
    cal("initNamespace", namespace);
    calNamespace("inline", {
      elementOrSelector: selector,
      calLink: "remosource/30min",
    });
    calNamespace("ui", {
      layout: "month_view",
      styles: { branding: { brandColor: "#286b73" } },
    });

    const failEmbed = () => setEmbedFailed(true);
    script?.addEventListener("error", failEmbed, { once: true });

    const observer = new MutationObserver(() => {
      if (embed.querySelector("iframe")) {
        clearTimeout(loadTimer);
        observer.disconnect();
      }
    });
    observer.observe(embed, { childList: true, subtree: true });
    const loadTimer = setTimeout(() => {
      if (!embed.querySelector("iframe")) setEmbedFailed(true);
      observer.disconnect();
    }, 12_000);

    return () => {
      clearTimeout(loadTimer);
      observer.disconnect();
      script?.removeEventListener("error", failEmbed);
    };
  }, []);

  return (
    <>
      {embedFailed ? (
        <p className="mt-5 rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground" role="status">
          The embedded calendar could not load. You can still book using the link below.
        </p>
      ) : null}
      <div
        id="cal-booking-inline"
        ref={embedRef}
        className="mt-6 min-h-[680px] w-full min-w-0 overflow-hidden rounded-xl border border-border bg-background"
        aria-label="Cal.com RemoSource hiring consultation booking calendar"
      />
      <a
        href={CAL_BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass("primary", "mt-5 inline-flex px-6")}
      >
        Book a consultation
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </>
  );
}

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
            <CalendarClock className="h-4.5 w-4.5 text-primary" />
            <h2 className="font-display text-lg">Book a consultation</h2>
          </div>
          <p id="consultation-description" className="mt-2 text-sm text-muted-foreground">
            Choose a convenient time to discuss your hiring requirements with the RemoSource team.
            Booking is optional; your hiring request has already been received.
          </p>
          <div aria-describedby="consultation-description">
            <CalBookingEmbed />
          </div>
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
