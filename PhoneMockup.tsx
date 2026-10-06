import { useCallback, useEffect, useRef, useState } from "react";
import {
  BarChart3,
  Bell,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
  Headphones,
  LayoutGrid,
  MapPin,
  Menu,
  MessageCircle,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  User,
  Users,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { RemoSourceLogo } from "./BrandLogo";

type Match = {
  role: string;
  location: string;
  match: number;
  skills: string[];
  extra: number;
  Icon: LucideIcon;
};

export const talentMatches: Match[] = [
  {
    role: "Senior Executive Assistant",
    location: "Nairobi · GMT+3",
    match: 96,
    skills: ["Calendar Mgmt", "Inbox Mgmt", "Research"],
    extra: 3,
    Icon: Briefcase,
  },
  {
    role: "Full-Stack Engineer",
    location: "Lagos · GMT+1",
    match: 94,
    skills: ["React", "Node.js", "AWS"],
    extra: 4,
    Icon: Code2,
  },
  {
    role: "Financial Analyst",
    location: "Bengaluru · GMT+5:30",
    match: 91,
    skills: ["Financial Modeling", "Excel", "SQL"],
    extra: 2,
    Icon: BarChart3,
  },
  {
    role: "Customer Success Manager",
    location: "Manila · GMT+8",
    match: 89,
    skills: ["SaaS", "Communications", "CRM"],
    extra: 3,
    Icon: Headphones,
  },
];

const glassCard =
  "rounded-2xl border border-white/12 bg-gradient-to-b from-white/[0.10] to-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-md";

function MatchRing({ value }: { value: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative h-[54px] w-[54px] shrink-0">
      <svg viewBox="0 0 52 52" className="h-full w-full -rotate-90">
        <circle
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          strokeWidth="3.5"
          stroke="currentColor"
          className="text-white/10"
        />
        <circle
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          strokeWidth="3.5"
          strokeLinecap="round"
          stroke="currentColor"
          className="text-[color:var(--sky)]"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-[12px] font-semibold text-navy-foreground">{value}%</span>
        <span className="mt-0.5 text-[7px] uppercase tracking-wide text-white/55">Match</span>
      </div>
    </div>
  );
}

function ScreenHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: string }) {
  return (
    <div className="px-4 pb-3 pt-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--sky)]">
        {eyebrow}
      </p>
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <h3 className="min-w-0 font-display text-[15px] font-semibold leading-snug text-navy-foreground">
          {title}
        </h3>
        {action ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[color:var(--sky)]/40 bg-white/[0.07] px-3 py-2 text-[11px] font-medium text-navy-foreground backdrop-blur-md">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[color:var(--sky)]" /> {action}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function MatchesScreen() {
  return (
    <>
      <ScreenHeader
        eyebrow="Live matching"
        title="We're finding the best professionals for you."
        action="Filters"
      />
      <div className="space-y-2.5 px-4">
        {talentMatches.map(({ role, location, match, skills, extra, Icon }) => (
          <div key={role} className={`${glassCard} p-3`}>
            <div className="flex gap-3">
              <div className="relative shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/12 bg-white/[0.06]">
                  <Icon className="h-5 w-5 text-navy-foreground" />
                </div>
                <span className="absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[color:var(--navy)]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[color:var(--sky)]">
                  <ShieldCheck className="h-3 w-3 shrink-0" /> RemoSource verified
                </p>
                <p className="mt-1 truncate text-[13px] font-semibold text-navy-foreground">{role}</p>
                <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-white/55">
                  <MapPin className="h-3 w-3 shrink-0" /> {location}
                </p>
              </div>
              <MatchRing value={match} />
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {[...skills, `+${extra}`].map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-white/12 bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/75"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={`mx-4 mt-3 flex items-center gap-2.5 p-3 ${glassCard}`}>
        <ShieldCheck className="h-4 w-4 shrink-0 text-[color:var(--sky)]" />
        <p className="min-w-0 flex-1 text-[11px] leading-snug text-white/70">
          Every profile passes assessment, interview and reference checks.
        </p>
        <ChevronRight className="h-4 w-4 shrink-0 text-white/45" />
      </div>
    </>
  );
}

function VettingScreen() {
  const scores = [
    { label: "Role capability", value: 96 },
    { label: "Communication", value: 92 },
    { label: "Reliability", value: 94 },
    { label: "References", value: 100 },
  ];
  return (
    <>
      <ScreenHeader eyebrow="Vetting report" title="Senior Executive Assistant · Nairobi" />
      <div className="space-y-2.5 px-4">
        <div className={`${glassCard} p-4`}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/[0.06]">
              <Briefcase className="h-5 w-5 text-navy-foreground" />
            </div>
            <div className="min-w-0">
              <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[color:var(--sky)]">
                <ShieldCheck className="h-3 w-3 shrink-0" /> Assessed 8 Aug
              </p>
              <p className="mt-1 truncate text-[13px] font-semibold text-navy-foreground">
                Candidate RS-2041
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-white/55">
                <Star className="h-3 w-3 shrink-0 text-[color:var(--sky)]" /> 7 yrs · EN / SW
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2.5">
            {scores.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-[10px] text-white/65">
                  <span>{s.label}</span>
                  <span className="font-semibold text-navy-foreground">{s.value}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[color:var(--sky)]"
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {[
          { Icon: FileText, text: "Structured interview transcript attached" },
          { Icon: CheckCircle2, text: "Two employer references verified" },
          { Icon: ShieldCheck, text: "Identity and right-to-work confirmed" },
        ].map(({ Icon, text }) => (
          <div key={text} className={`flex items-center gap-2.5 p-3 ${glassCard}`}>
            <Icon className="h-4 w-4 shrink-0 text-[color:var(--sky)]" />
            <p className="min-w-0 flex-1 text-[11px] leading-snug text-white/70">{text}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function IntroScreen() {
  return (
    <>
      <ScreenHeader eyebrow="Introductions" title="Book your consultation and meet the shortlist." />
      <div className="space-y-2.5 px-4">
        <div className={`${glassCard} p-4`}>
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--sky)]">
            <CalendarCheck className="h-3.5 w-3.5" /> Tuesday, 26 Aug
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {["09:00", "11:30", "14:00", "15:30", "17:00", "18:30"].map((t, i) => (
              <span
                key={t}
                className={
                  i === 1
                    ? "rounded-lg border border-[color:var(--sky)]/60 bg-[color:var(--sky)]/15 py-1.5 text-center text-[11px] font-semibold text-navy-foreground"
                    : "rounded-lg border border-white/12 bg-white/[0.05] py-1.5 text-center text-[11px] text-white/70"
                }
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.06] px-3 py-2.5">
            <Video className="h-4 w-4 shrink-0 text-[color:var(--sky)]" />
            <p className="min-w-0 flex-1 text-[11px] text-white/70">30-min discovery call</p>
            <ChevronRight className="h-4 w-4 shrink-0 text-white/45" />
          </div>
        </div>
        {[
          { name: "Senior Executive Assistant", meta: "Nairobi · 96% match", Icon: Briefcase },
          { name: "Full-Stack Engineer", meta: "Lagos · 94% match", Icon: Code2 },
          { name: "Financial Analyst", meta: "Bengaluru · 91% match", Icon: BarChart3 },
        ].map(({ name, meta, Icon }) => (
          <div key={name} className={`flex items-center gap-3 p-3 ${glassCard}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/[0.06]">
              <Icon className="h-4 w-4 text-navy-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-navy-foreground">{name}</p>
              <p className="truncate text-[11px] text-white/55">{meta}</p>
            </div>
            <span className="shrink-0 rounded-full bg-[color:var(--sky)]/15 px-2.5 py-1 text-[10px] font-semibold text-[color:var(--sky)]">
              Intro sent
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

const screens = [
  { id: "matches", label: "Matches", render: () => <MatchesScreen /> },
  { id: "vetting", label: "Vetting", render: () => <VettingScreen /> },
  { id: "intro", label: "Introductions", render: () => <IntroScreen /> },
];

export function PhoneMatchingMockup() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragStart = useRef<number | null>(null);

  const go = useCallback((next: number) => {
    setIndex(((next % screens.length) + screens.length) % screens.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % screens.length), 5200);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div
      className="relative mx-auto w-full max-w-[232px] sm:max-w-[252px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative">
        <div className="relative rounded-[2.75rem] border border-white/20 bg-white/[0.07] p-[3px] shadow-[0_24px_48px_-30px_rgba(0,0,0,0.62)]">

          <div className="rounded-[2.6rem] border border-white/10 bg-white/[0.04] p-2">
            <div className="relative flex aspect-[0.492/1] flex-col overflow-hidden rounded-[2.25rem] border border-white/12 bg-[color:var(--navy)]/85">
              {/* specular reflection */}
              <div className="pointer-events-none absolute inset-0 z-20 rounded-[2.25rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]" />

              {/* status bar */}
              <div className="relative z-10 flex items-center justify-between px-6 pt-3 text-[11px] font-semibold text-navy-foreground">
                <span>9:41</span>
                <div className="absolute left-1/2 top-2 h-6 w-24 -translate-x-1/2 rounded-full bg-black/85" />
                <span className="flex items-center gap-1 text-white/70">
                  <span className="h-2 w-3 rounded-[2px] bg-white/70" />
                  <span className="h-2.5 w-4 rounded-[2px] bg-white/70" />
                </span>
              </div>

              {/* app bar */}
              <div className="relative z-10 mt-3 flex items-center justify-between border-b border-white/10 px-5 pb-3">
                <Menu className="h-4 w-4 text-white/70" />
                <RemoSourceLogo size="compact" invert className="gap-1.5" />
                <Bell className="h-4 w-4 text-white/70" />
              </div>

              {/* carousel viewport */}
              <div
                className="relative z-10 min-h-0 flex-1 touch-pan-y overflow-hidden"
                onPointerDown={(e) => {
                  dragStart.current = e.clientX;
                }}
                onPointerUp={(e) => {
                  if (dragStart.current === null) return;
                  const dx = e.clientX - dragStart.current;
                  dragStart.current = null;
                  if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
                }}
                onPointerLeave={() => {
                  dragStart.current = null;
                }}
              >
                <div
                  className="flex w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ transform: `translateX(-${index * 100}%)` }}
                >
                  {screens.map((s, i) => (
                    <div
                      key={s.id}
                      className="w-full shrink-0"
                      aria-hidden={i !== index}
                      style={{ opacity: i === index ? 1 : 0.5, transition: "opacity 400ms" }}
                    >
                      {s.render()}
                    </div>
                  ))}
                </div>
              </div>

              {/* tab bar */}
              <div className="relative z-10 mt-auto grid grid-cols-4 gap-1 border-t border-white/10 bg-white/[0.04] px-3 pb-5 pt-3 backdrop-blur-md">
                {[
                  { label: "Dashboard", Icon: LayoutGrid },
                  { label: "Matches", Icon: Users },
                  { label: "Messages", Icon: MessageCircle },
                  { label: "Profile", Icon: User },
                ].map(({ label, Icon }, i) => {
                  const active = i === 1;
                  return (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <Icon className={active ? "h-4 w-4 text-[color:var(--sky)]" : "h-4 w-4 text-white/50"} />
                      <span
                        className={
                          active
                            ? "text-[9px] font-semibold text-[color:var(--sky)]"
                            : "text-[9px] text-white/50"
                        }
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="absolute bottom-1.5 left-1/2 z-20 h-1 w-28 -translate-x-1/2 rounded-full bg-white/40" />
            </div>
          </div>
        </div>

        {/* carousel controls */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label="Previous screen"
            onClick={() => go(index - 1)}
            className="hidden h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-white/70 backdrop-blur-md transition hover:bg-white/15 hover:text-navy-foreground sm:flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            {screens.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Show ${s.label} screen`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={
                  i === index
                    ? "h-2 w-7 rounded-full bg-[color:var(--sky)] transition-all"
                    : "h-2 w-2 rounded-full bg-white/25 transition-all hover:bg-white/45"
                }
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next screen"
            onClick={() => go(index + 1)}
            className="hidden h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-white/70 backdrop-blur-md transition hover:bg-white/15 hover:text-navy-foreground sm:flex"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-white/65">
          Swipe through the matching flow · {screens[index]?.label}
        </p>
      </div>
    </div>
  );
}
