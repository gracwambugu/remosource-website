import { useState } from "react";
import {
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  MapPin,
  MoreHorizontal,
  ShieldCheck,
  Smartphone,
  Users2,
} from "lucide-react";
import { RemoSourceMark } from "./BrandLogo";
import { PhoneMatchingMockup, talentMatches } from "./PhoneMockup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trackConversion } from "@/lib/analytics";

type HeroVisual = "phone" | "dashboard" | "profiles";

function MatchBadge({ value }: { value: number }) {
  return (
    <span className="inline-flex min-w-12 items-center justify-center rounded-full border border-sky/35 bg-sky/10 px-2 py-1 text-xs font-semibold text-sky">
      {value}%
    </span>
  );
}

function DashboardPreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-white/20 bg-card shadow-[0_28px_70px_-38px_oklch(0.08_0.03_245/0.85)]">
      <div className="flex h-9 items-center gap-2 border-b border-border bg-secondary px-3">
        <span className="h-2.5 w-2.5 rounded-full bg-primary/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-sky/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-navy/20" />
        <div className="mx-auto flex h-5 w-2/5 items-center justify-center rounded bg-background text-[8px] font-medium text-muted-foreground">
          app.remosource.com
        </div>
        <MoreHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="grid min-h-[350px] grid-cols-[62px_minmax(0,1fr)] sm:min-h-[390px] sm:grid-cols-[86px_minmax(0,1fr)]">
        <aside className="border-r border-border bg-navy px-2 py-4 text-navy-foreground sm:px-3">
          <div className="flex items-center justify-center gap-1 text-[9px] font-semibold sm:text-[11px]">
            <RemoSourceMark className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">RemoSource</span>
          </div>
          <div className="mt-7 space-y-2">
            {[
              { icon: LayoutDashboard, label: "Overview", active: true },
              { icon: Users2, label: "Matches", active: false },
              { icon: BriefcaseBusiness, label: "Roles", active: false },
            ].map(({ icon: Icon, label, active }) => (
              <div
                key={label}
                className={`flex items-center gap-2 rounded-md px-2 py-2 text-[9px] sm:text-[10px] ${active ? "bg-white/10 text-navy-foreground" : "text-white/55"}`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">{label}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="min-w-0 bg-background p-3 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-primary">Live matching</p>
              <h3 className="mt-1 text-sm font-semibold text-navy sm:text-lg">Your shortlist is taking shape.</h3>
            </div>
            <Bell className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            {[
              ["12", "Sourced"],
              ["7", "Assessed"],
              ["4", "Shortlisted"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-md border border-border bg-card p-2.5 sm:p-3">
                <p className="text-base font-semibold text-navy sm:text-xl">{value}</p>
                <p className="mt-0.5 text-[8px] text-muted-foreground sm:text-[10px]">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-md border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
              <p className="text-[10px] font-semibold text-navy sm:text-xs">Top matches</p>
              <span className="text-[8px] font-medium text-primary sm:text-[10px]">View shortlist</span>
            </div>
            {talentMatches.slice(0, 3).map(({ role, location, match, skills, Icon }, index) => (
              <div key={role} className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 px-3 py-3 ${index > 0 ? "border-t border-border" : ""}`}>
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-primary sm:h-9 sm:w-9">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-semibold text-navy sm:text-xs">{role}</p>
                  <p className="mt-0.5 truncate text-[8px] text-muted-foreground sm:text-[10px]">{location} · {skills.slice(0, 2).join(" · ")}</p>
                </div>
                <MatchBadge value={match} />
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-[9px] text-navy sm:text-[10px]">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
            Every profile is assessed, interviewed and reference-checked.
          </div>
        </div>
      </div>
    </div>
  );
}

function TalentProfileStack() {
  return (
    <div className="relative mx-auto flex w-full max-w-[440px] flex-col items-center overflow-hidden px-1 pb-12 pt-2">
      {talentMatches.slice(0, 3).map(({ role, location, match, skills, extra, Icon }, index) => (
        <article
          key={role}
          className={`relative w-full origin-top rounded-lg border border-white/20 bg-navy-soft p-5 shadow-[0_24px_60px_-36px_oklch(0.08_0.03_245/0.9)] ${index > 0 ? "-mt-24 sm:-mt-20" : ""}`}
          style={{ zIndex: 3 - index, scale: `${1 - index * 0.05}`, translate: `0 ${index * 6}px` }}
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-white/15 bg-white/[0.06] text-sky">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-sky">
                <BadgeCheck className="h-3 w-3" /> RemoSource verified
              </p>
              <h3 className="mt-1 truncate text-sm font-semibold text-navy-foreground">{role}</h3>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-white/60">
                <MapPin className="h-3 w-3" /> {location}
              </p>
            </div>
            <MatchBadge value={match} />
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {[...skills, `+${extra}`].map((skill) => (
              <span key={skill} className="rounded-md border border-white/12 bg-white/[0.05] px-2 py-1 text-[10px] text-white/75">{skill}</span>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-white/60">
            <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-sky" /> Vetting complete</span>
            <span className="flex items-center gap-1">View profile <ChevronRight className="h-3 w-3" /></span>
          </div>
        </article>
      ))}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[10px] text-white/60">
        <Clock3 className="h-3.5 w-3.5 text-sky" /> Privacy-conscious profiles
      </div>
    </div>
  );
}

const options: Array<{ value: HeroVisual; label: string; Icon: typeof Smartphone }> = [
  { value: "phone", label: "Phone", Icon: Smartphone },
  { value: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { value: "profiles", label: "Profiles", Icon: Users2 },
];

export function HeroVisuals() {
  const [value, setValue] = useState<HeroVisual>("dashboard");

  return (
    <Tabs
      value={value}
      onValueChange={(next) => {
        const visual = next as HeroVisual;
        setValue(visual);
        trackConversion("hero_visual_changed", { visual });
      }}
      className="flex w-full min-w-0 flex-col items-center"
    >
      <TabsList aria-label="Compare hero visual treatments" className="order-2 mt-5 h-10 border border-white/15 bg-white/[0.06] p-1 text-white/60">
        {options.map(({ value: option, label, Icon }) => (
          <TabsTrigger key={option} value={option} className="gap-1.5 rounded-md px-3 text-[11px] text-white/65 data-[state=active]:bg-white data-[state=active]:text-navy sm:px-4">
            <Icon className="h-3.5 w-3.5" /> {label}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="order-1 flex min-h-[470px] w-full items-center justify-center sm:min-h-[540px] lg:min-h-[520px]">
        <TabsContent value="phone" className="m-0 w-full">
          <PhoneMatchingMockup />
        </TabsContent>
        <TabsContent value="dashboard" className="m-0 w-full">
          <DashboardPreview />
        </TabsContent>
        <TabsContent value="profiles" className="m-0 w-full">
          <TalentProfileStack />
        </TabsContent>
      </div>
    </Tabs>
  );
}
