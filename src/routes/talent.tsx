import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Lock } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/primitives";
import { CtaBanner, TalentCard } from "@/components/site/blocks";
import { roleCategories, talentPool } from "@/lib/remosource-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/talent")({
  head: () => ({
    meta: [
      { title: "Vetted Remote Talent Pool | RemoSource" },
      {
        name: "description",
        content:
          "Browse anonymised profiles of fully vetted remote professionals — executive support, engineering, finance, CX, design and healthcare administration — available across global time zones.",
      },
      { property: "og:title", content: "Vetted Remote Talent Pool | RemoSource" },
      {
        property: "og:description",
        content:
          "Privacy-conscious candidate profiles. Request an introduction and we handle consent and availability.",
      },
    ],
  }),
  component: TalentPoolPage,
});

function TalentPoolPage() {
  const [category, setCategory] = useState("All");
  const [region, setRegion] = useState("All");

  const regions = useMemo(
    () => ["All", ...Array.from(new Set(talentPool.map((t) => t.region)))],
    [],
  );
  const categories = useMemo(() => ["All", ...roleCategories.map((r) => r.name)], []);

  const filtered = talentPool.filter(
    (t) =>
      (category === "All" || t.category === category) && (region === "All" || t.region === region),
  );

  return (
    <>
      <Section tone="navy" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 hairline-grid opacity-40" />
        <div className="relative max-w-3xl">
          <SectionHeading
            invert
            eyebrow="Talent pool"
            title="Professionals who already cleared our vetting."
            lead="A sample of the network. Profiles are anonymised by design — identities are shared only with the candidate's explicit consent."
          />
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <span className="mb-3 block text-sm font-medium text-navy">Filter by discipline</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-xs font-medium transition-all",
                    category === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-navy hover:border-primary/50",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-3 block text-sm font-medium text-navy">Filter by region</span>
            <div className="flex flex-wrap gap-2">
              {regions.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-xs font-medium transition-all",
                    region === r
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-navy hover:border-primary/50",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4 text-primary" />
          Showing {filtered.length} of {talentPool.length} sample profiles. Names, employers and
          contact details are never published.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((talent) => (
            <TalentCard key={talent.id} talent={talent} />
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground">
            No sample profiles match that combination — but our live network is far larger than this
            page. Send us a brief and we will recruit specifically for it.
          </p>
        ) : null}
      </Section>

      <CtaBanner
        title="Need someone who isn't listed here?"
        lead="This page is a sample. Most placements are recruited to order against your specific brief."
        primary={{ to: "/hire", label: "Tell us what you need" }}
        secondary={{ to: "/for-businesses", label: "How we vet" }}
      />
    </>
  );
}
