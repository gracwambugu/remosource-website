import { Link } from "@tanstack/react-router";
import { Mail, MessageCircle } from "lucide-react";
import { RemoSourceLogo } from "./BrandLogo";

const columns = [
  {
    title: "For Businesses",
    links: [
      { to: "/for-businesses", label: "Why RemoSource" },
      { to: "/hire", label: "Start a hiring brief" },
      { to: "/how-it-works", label: "Our process" },
      { to: "/talent", label: "Browse vetted talent" },
    ],
  },
  {
    title: "For Talent",
    links: [
      { to: "/for-talent", label: "Join the network" },
      { to: "/apply", label: "Apply now" },
      { to: "/how-it-works", label: "What to expect" },
      { to: "/referral-program", label: "Referral programme" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About RemoSource" },
      { to: "/contact", label: "Contact" },
      { to: "/referral-program", label: "Refer & earn" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="navy-panel">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <RemoSourceLogo invert />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
              Build your team without borders. We recruit, assess, interview and vet remote
              professionals, then match them to the companies that need them.
            </p>
            <div className="mt-6 space-y-2 text-sm text-white/65">
              <a
                href="mailto:enquiries@remosource.com"
                className="flex items-center gap-2 transition-colors hover:text-[color:var(--sky)]"
              >
                <Mail className="h-4 w-4" /> enquiries@remosource.com
              </a>
              <Link
                to="/contact"
                className="flex items-center gap-2 transition-colors hover:text-[color:var(--sky)]"
              >
                <MessageCircle className="h-4 w-4" /> Message us on WhatsApp
              </Link>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--sky)]">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/65 transition-colors hover:text-navy-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RemoSource. Global remote talent recruitment & matching.</p>
          <p>Candidate privacy protected · Never a fee for professionals</p>
        </div>
      </div>
    </footer>
  );
}
