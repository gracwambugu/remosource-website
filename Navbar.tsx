import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { buttonClass } from "./primitives";
import { RemoSourceLogo } from "./BrandLogo";
import { cn } from "@/lib/utils";
import { trackConversion } from "@/lib/analytics";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/for-businesses", label: "For Businesses" },
  { to: "/for-talent", label: "For Talent" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/talent", label: "Talent" },
  { to: "/about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <RemoSourceLogo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "text-navy bg-secondary" }}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/for-talent" onClick={() => window.location.pathname === "/" && trackConversion("homepage_cta_clicked", { location: "navigation", label: "Join Talent Network", destination: "/for-talent" })} className={buttonClass("outline", "px-5 py-2.5")}>
            Join Talent Network
          </Link>
          <Link to="/hire" onClick={() => window.location.pathname === "/" && trackConversion("homepage_cta_clicked", { location: "navigation", label: "Find Talent", destination: "/hire" })} className={buttonClass("primary", "px-5 py-2.5")}>
            Find Talent
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-navy lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        aria-hidden={!open}
        className={cn(
          "overflow-hidden border-t border-border bg-background transition-[max-height,visibility] duration-300 lg:hidden",
          open ? "visible max-h-[32rem]" : "invisible max-h-0 border-t-0",
        )}
      >
        <div className="space-y-1 px-5 py-4 sm:px-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "text-navy" }}
              onClick={() => {
                setOpen(false);
                trackConversion("homepage_cta_clicked", { location: "mobile_navigation", label: "Find Talent", destination: "/hire" });
              }}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="grid gap-2 pt-3">
            <Link
              to="/hire"
              onClick={() => {
                setOpen(false);
                trackConversion("homepage_cta_clicked", { location: "mobile_navigation", label: "Join Talent Network", destination: "/for-talent" });
              }}
              className={buttonClass("primary", "w-full")}
            >
              Find Talent
            </Link>
            <Link
              to="/for-talent"
              onClick={() => setOpen(false)}
              className={buttonClass("outline", "w-full")}
            >
              Join Talent Network
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
