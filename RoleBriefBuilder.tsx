import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Clipboard, Loader2, Sparkles, WandSparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { generateRoleBrief, type GeneratedRoleBrief, type RoleBriefInput } from "@/lib/role-brief.functions";
import { trackConversion } from "@/lib/analytics";
import { engagementModels } from "@/lib/remosource-data";

const fieldClass =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-navy outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

const initialRequirements: RoleBriefInput = {
  roleTitle: "",
  responsibilities: "",
  mustHaveSkills: "",
  seniority: "Mid-level",
  workingPattern: "",
  engagementModel: engagementModels[0]?.title ?? "Full-time dedicated",
  constraints: "",
};

type ApplyPayload = {
  roleTitle: string;
  responsibilities: string;
  mustHaveSkills: string;
  seniority: string;
  engagementModel: string;
  timezoneOverlap: string;
  constraints: string;
  aiGeneratedRoleBrief: string;
  skills: string[];
  notes: string;
};

function briefAsText(brief: GeneratedRoleBrief) {
  const criteria = brief.assessmentCriteria
    .map((item) => `- ${item.criterion}: ${item.evidence} Scoring: ${item.scoring}`)
    .join("\n");
  return `${brief.roleTitle}\n\n${brief.summary}\n\nKey outcomes\n${brief.outcomes.map((item) => `- ${item}`).join("\n")}\n\nRequired capabilities\n${brief.requiredCapabilities.map((item) => `- ${item}`).join("\n")}\n\nPreferred capabilities\n${brief.preferredCapabilities.map((item) => `- ${item}`).join("\n")}\n\nScreening questions\n${brief.screeningQuestions.map((item) => `- ${item}`).join("\n")}\n\nAssessment criteria\n${criteria}\n\nInterview focus\n${brief.interviewFocusAreas.map((item) => `- ${item}`).join("\n")}\n\nRisk flags\n${brief.riskFlags.map((item) => `- ${item}`).join("\n")}`;
}

export function RoleBriefBuilder({ onApply }: { onApply: (payload: ApplyPayload) => void }) {
  const generate = useServerFn(generateRoleBrief);
  const [requirements, setRequirements] = useState(initialRequirements);
  const [brief, setBrief] = useState<GeneratedRoleBrief | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof RoleBriefInput, value: string) =>
    setRequirements((current) => ({ ...current, [key]: value }));

  async function handleGenerate(event: React.FormEvent) {
    event.preventDefault();
    const parsed = {
      valid:
        requirements.roleTitle.trim().length >= 2 &&
        requirements.responsibilities.trim().length >= 20 &&
        requirements.mustHaveSkills.trim().length >= 2 &&
        requirements.workingPattern.trim().length >= 2,
    };
    if (!parsed.valid) {
      setError("Add a role title, responsibilities, skills, and working pattern before generating.");
      return;
    }

    setPending(true);
    setError("");
    trackConversion("ai_role_brief_generation_started", { role: requirements.roleTitle });
    try {
      const result = await generate({ data: requirements });
      setBrief(result);
      trackConversion("ai_role_brief_generation_completed", { role: result.roleTitle });
    } catch (generationError) {
      const message = generationError instanceof Error ? generationError.message : "We could not generate the brief. Your requirements are still here, so you can try again.";
      setError(message);
      trackConversion("ai_role_brief_generation_failed", { role: requirements.roleTitle });
    } finally {
      setPending(false);
    }
  }

  function updateList(key: keyof Pick<GeneratedRoleBrief, "outcomes" | "requiredCapabilities" | "preferredCapabilities" | "screeningQuestions" | "interviewFocusAreas" | "riskFlags">, value: string) {
    setBrief((current) => current ? { ...current, [key]: value.split("\n").map((item) => item.trim()).filter(Boolean) } : current);
  }

  function applyBrief() {
    if (!brief) return;
    const notes = briefAsText(brief);
    onApply({
      roleTitle: brief.roleTitle,
      responsibilities: requirements.responsibilities,
      mustHaveSkills: requirements.mustHaveSkills,
      seniority: requirements.seniority,
      engagementModel: requirements.engagementModel,
      timezoneOverlap: requirements.workingPattern,
      constraints: requirements.constraints,
      aiGeneratedRoleBrief: notes,
      skills: brief.requiredCapabilities,
      notes,
    });
    trackConversion("ai_role_brief_applied", { role: brief.roleTitle });
    toast.success("AI draft applied. Review the hiring brief below before submitting.");
  }

  return (
    <section aria-labelledby="ai-role-brief-title" className="mb-10 rounded-xl border border-primary/25 bg-primary/5 p-5 sm:p-7">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <WandSparkles className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Optional AI drafting</p>
          <h2 id="ai-role-brief-title" className="mt-1 text-xl font-semibold text-navy">Turn your requirements into a role brief</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Describe the role in your own words. You can edit the draft before applying it to your hiring request.</p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="mt-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-navy">Role title</span>
            <input className={fieldClass} value={requirements.roleTitle} onChange={(event) => set("roleTitle", event.target.value)} placeholder="e.g. Senior Executive Assistant" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-navy">Core responsibilities</span>
            <textarea rows={3} className={fieldClass} value={requirements.responsibilities} onChange={(event) => set("responsibilities", event.target.value)} placeholder="What should this person own and deliver?" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-navy">Must-have skills</span>
            <input className={fieldClass} value={requirements.mustHaveSkills} onChange={(event) => set("mustHaveSkills", event.target.value)} placeholder="e.g. calendar management, stakeholder communication, research" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-navy">Seniority</span>
            <select className={fieldClass} value={requirements.seniority} onChange={(event) => set("seniority", event.target.value)}>
              {["Junior", "Mid-level", "Senior", "Lead / Manager", "Director"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-navy">Engagement model</span>
            <select className={fieldClass} value={requirements.engagementModel} onChange={(event) => set("engagementModel", event.target.value)}>
              {engagementModels.map((item) => <option key={item.title}>{item.title}</option>)}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-navy">Working hours / time-zone overlap</span>
            <input className={fieldClass} value={requirements.workingPattern} onChange={(event) => set("workingPattern", event.target.value)} placeholder="e.g. 4 hours overlap with GMT+1" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-navy">Constraints or context (optional)</span>
            <textarea rows={2} className={fieldClass} value={requirements.constraints} onChange={(event) => set("constraints", event.target.value)} placeholder="Tools, team structure, industry context, or non-negotiables" />
          </label>
        </div>
        {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" disabled={pending} className="rounded-full px-6">
          {pending ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {pending ? "Drafting role brief…" : brief ? "Regenerate draft" : "Draft role brief with AI"}
        </Button>
      </form>

      {brief ? (
        <div className="mt-7 border-t border-primary/20 pt-6" aria-live="polite">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Editable draft</p>
              <h3 className="mt-1 text-lg font-semibold text-navy">Review before applying</h3>
            </div>
            <Button type="button" variant="outline" className="rounded-full" onClick={async () => {
              await navigator.clipboard.writeText(briefAsText(brief));
              toast.success("Role brief copied.");
            }}>
              <Clipboard /> Copy
            </Button>
          </div>
          <div className="mt-5 grid gap-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-navy">Draft title</span>
              <input className={fieldClass} value={brief.roleTitle} onChange={(event) => setBrief({ ...brief, roleTitle: event.target.value })} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-navy">Role summary</span>
              <textarea rows={3} className={fieldClass} value={brief.summary} onChange={(event) => setBrief({ ...brief, summary: event.target.value })} />
            </label>
            {([
              ["outcomes", "Key outcomes"],
              ["requiredCapabilities", "Required capabilities"],
              ["preferredCapabilities", "Preferred capabilities"],
              ["screeningQuestions", "Screening questions"],
              ["interviewFocusAreas", "Interview focus areas"],
              ["riskFlags", "Risk flags"],
            ] as const).map(([key, label]) => (
              <label key={key} className="block">
                <span className="mb-2 block text-sm font-medium text-navy">{label}</span>
                <textarea rows={3} className={fieldClass} value={brief[key].join("\n")} onChange={(event) => updateList(key, event.target.value)} />
              </label>
            ))}
            <div>
              <p className="mb-2 text-sm font-medium text-navy">Assessment criteria</p>
              <div className="space-y-2">
                {brief.assessmentCriteria.map((item, index) => (
                  <div key={`${item.criterion}-${index}`} className="rounded-lg border border-border bg-card p-3 text-sm">
                    <p className="font-semibold text-navy">{item.criterion}</p>
                    <p className="mt-1 text-muted-foreground">{item.evidence}</p>
                    <p className="mt-1 text-xs font-medium text-primary">{item.scoring}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button type="button" className="mt-6 rounded-full px-6" onClick={applyBrief}>
            <Check /> Apply to hiring brief
          </Button>
        </div>
      ) : null}
    </section>
  );
}
