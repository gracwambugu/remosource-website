import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { buttonClass } from "./primitives";
import { engagementModels, roleCategories } from "@/lib/remosource-data";
import { trackConversion } from "@/lib/analytics";
import { RoleBriefBuilder } from "./RoleBriefBuilder";

/* ------------------------------------------------------------------ */
/* Submission payloads — shaped for future CRM / scheduling / email    */
/* integrations. No credentials or endpoints are hard-coded here.      */
/* ------------------------------------------------------------------ */

export type HiringBrief = {
  formType: "hiring_brief";
  submittedAt: string;
  company: { name: string; website: string; industry: string; size: string; country: string };
  contact: { fullName: string; email: string; phone: string; role: string };
  requirement: {
    roleTitle: string;
    serviceCategory: string;
    skills: string[];
    seniority: string;
    engagementModel: string;
    headcount: string;
    timezoneOverlap: string;
    startDate: string;
    budgetRange: string;
    candidateReference: string;
    notes: string;
  };
  consent: { marketingOptIn: boolean; privacyAccepted: boolean };
};

export type TalentApplication = {
  formType: "talent_application";
  submittedAt: string;
  candidate: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    timezone: string;
    linkedin: string;
    portfolio: string;
  };
  profile: {
    primaryCategory: string;
    skills: string[];
    yearsExperience: string;
    englishLevel: string;
    availability: string;
    engagementPreference: string;
    expectedRate: string;
    summary: string;
  };
  consent: { privacyAccepted: boolean; contactByWhatsApp: boolean };
};

export type ReferralSubmission = {
  formType: "referral";
  submittedAt: string;
  referrer: { fullName: string; email: string; country: string; payoutMethod: string };
  referral: { type: "talent" | "business"; name: string; email: string; context: string };
  consent: { privacyAccepted: boolean };
};

export type ContactSubmission = {
  formType: "contact";
  submittedAt: string;
  fullName: string;
  email: string;
  company: string;
  enquiryType: string;
  message: string;
  preferredChannel: string;
};

type Payload = HiringBrief | TalentApplication | ReferralSubmission | ContactSubmission;

/**
 * Single submission boundary. Replace the body with a server function call
 * (CRM create-lead, scheduling link generation, transactional email, WhatsApp
 * notification) when those integrations are connected.
 */
async function submitToPipeline(payload: Payload) {
  if (typeof window !== "undefined") {
    const key = "remosource:submissions";
    const existing = JSON.parse(window.localStorage.getItem(key) ?? "[]") as Payload[];
    window.localStorage.setItem(key, JSON.stringify([...existing, payload].slice(-25)));
  }
  await new Promise((resolve) => setTimeout(resolve, 700));
  return { ok: true as const, reference: `RS-${Date.now().toString().slice(-6)}` };
}

/* ------------------------------- fields ------------------------------- */

const fieldClass =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-navy outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({
  label,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-sm font-medium text-navy">{label}</span>
      {children}
      {hint && !error ? (
        <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span>
      ) : null}
      {error ? <span className="mt-1.5 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}

function SkillPicker({
  skills,
  selected,
  onToggle,
}: {
  skills: string[];
  selected: string[];
  onToggle: (skill: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => {
        const active = selected.includes(skill);
        return (
          <button
            key={skill}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(skill)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-all",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-navy hover:border-primary/50",
            )}
          >
            {active ? <Check className="h-3.5 w-3.5" /> : null}
            {skill}
          </button>
        );
      })}
    </div>
  );
}

function SubmitButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button type="submit" disabled={pending} className={buttonClass("primary", "w-full sm:w-auto px-8")}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? "Submitting…" : label}
    </button>
  );
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ---------------------------- hiring form ---------------------------- */

export function HiringForm({
  initialService,
  candidateReference,
}: {
  initialService?: string | undefined;
  candidateReference?: string | undefined;
}) {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serviceSlug, setServiceSlug] = useState(
    initialService && roleCategories.some((r) => r.slug === initialService)
      ? initialService
      : roleCategories[0]!.slug,
  );
  const [skills, setSkills] = useState<string[]>([]);
  const [aiRoleBrief, setAiRoleBrief] = useState({
    responsibilities: "",
    mustHaveSkills: "",
    workingPattern: "",
    constraints: "",
    generatedBrief: "",
  });
  const [form, setForm] = useState({
    roleTitle: "",
    companyName: "",
    website: "",
    industry: "",
    companySize: "11-50",
    country: "",
    fullName: "",
    email: "",
    phone: "",
    contactRole: "",
    seniority: "Mid-level",
    engagement: engagementModels[0]!.title,
    headcount: "1",
    overlap: "",
    startDate: "",
    budget: "",
    notes: "",
    marketingOptIn: false,
    privacyAccepted: false,
  });

  const category = useMemo(
    () => roleCategories.find((r) => r.slug === serviceSlug)!,
    [serviceSlug],
  );

  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleSkill = (skill: string) =>
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;
    const next: Record<string, string> = {};
    if (!form.roleTitle.trim()) next['roleTitle'] = "Role title is required.";
    if (!form.companyName.trim()) next['companyName'] = "Company name is required.";
    if (!form.fullName.trim()) next['fullName'] = "Your name is required.";
    if (!emailRe.test(form.email)) next['email'] = "Enter a valid work email address.";
    if (!form.country.trim()) next['country'] = "Tell us where your company is based.";
    if (skills.length === 0) next['skills'] = "Select at least one skill for this role.";
    if (!form.privacyAccepted) next['privacyAccepted'] = "Please accept the privacy notice.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Please complete the highlighted fields.");
      return;
    }

    setPending(true);
    const parsedPeopleCount = Number(form.headcount);
    const payload = {
      role_title: form.roleTitle.trim(),
      core_responsibilities: aiRoleBrief.responsibilities.trim() || null,
      must_have_skills: aiRoleBrief.mustHaveSkills
        .split(/[,;\n]/)
        .map((skill) => skill.trim())
        .filter(Boolean),
      seniority: form.seniority,
      engagement_model: form.engagement,
      working_hours_timezone_overlap: aiRoleBrief.workingPattern.trim() || null,
      constraints_or_context: aiRoleBrief.constraints.trim() || null,
      ai_generated_role_brief: aiRoleBrief.generatedBrief || null,
      service_category: category.name,
      skills_required: skills,
      people_count:
        Number.isSafeInteger(parsedPeopleCount) && parsedPeopleCount > 0
          ? parsedPeopleCount
          : null,
      timezone_overlap_needed: form.overlap.trim() || null,
      ideal_start_date: form.startDate || null,
      budget_range: form.budget.trim() || null,
      company_name: form.companyName.trim(),
      website: form.website.trim() || null,
      industry: form.industry.trim() || null,
      company_size: form.companySize,
      company_country: form.country.trim(),
      contact_full_name: form.fullName.trim(),
      work_email: form.email.trim(),
      phone: form.phone.trim() || null,
      contact_role: form.contactRole.trim() || null,
      additional_notes: form.notes.trim() || null,
      privacy_consent: form.privacyAccepted,
      marketing_opt_in: form.marketingOptIn,
    };

    try {
      const response = await fetch(
        "https://apdflttewtuorcpckewu.supabase.co/functions/v1/submit-hiring-request",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result: unknown = await response.json().catch(() => null);
      const responseBody =
        typeof result === "object" && result !== null
          ? (result as { received?: unknown; error?: unknown })
          : null;

      if (response.ok !== true || responseBody?.received !== true) {
        const errorMessage =
          typeof responseBody?.error === "string"
            ? responseBody.error
            : "We couldn't submit your hiring request. Please try again.";
        throw new Error(errorMessage);
      }

      trackConversion("form_submission_completed", {
        form: "hiring_brief",
        source: window.location.pathname,
      });
      toast.success("RemoSource received your hiring request. Our team will contact you about next steps.");
      navigate({ to: "/thank-you", search: { flow: "hire" } as never });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "We couldn't submit your hiring request. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <RoleBriefBuilder
        onApply={(draft) => {
          setAiRoleBrief({
            responsibilities: draft.responsibilities,
            mustHaveSkills: draft.mustHaveSkills,
            workingPattern: draft.timezoneOverlap,
            constraints: draft.constraints,
            generatedBrief: draft.aiGeneratedRoleBrief,
          });
          setForm((current) => ({
            ...current,
            roleTitle: draft.roleTitle,
            seniority: draft.seniority,
            engagement: draft.engagementModel,
            overlap: draft.timezoneOverlap,
            notes: draft.notes,
          }));
          const matchingSkills = category.skills.filter((skill) =>
            draft.skills.some((generated) => generated.toLowerCase().includes(skill.toLowerCase())),
          );
          if (matchingSkills.length > 0) setSkills(matchingSkills);
        }}
      />
      <form onSubmit={handleSubmit} className="space-y-10">
      <fieldset className="space-y-6">
        <legend className="font-display text-lg font-semibold text-navy">1. The role</legend>
        <Field label="Role title" error={errors['roleTitle']}>
          <input
            className={fieldClass}
            value={form.roleTitle}
            onChange={(e) => set("roleTitle", e.target.value)}
            placeholder="e.g. Senior Executive Assistant"
          />
        </Field>
        <Field label="Service category">
          <select
            className={fieldClass}
            value={serviceSlug}
            onChange={(e) => {
              setServiceSlug(e.target.value);
              setSkills([]);
            }}
          >
            {roleCategories.map((role) => (
              <option key={role.slug} value={role.slug}>
                {role.name}
              </option>
            ))}
          </select>
        </Field>

        <div>
          <span className="mb-2 block text-sm font-medium text-navy">
            Skills required — select all that apply
          </span>
          <SkillPicker skills={category.skills} selected={skills} onToggle={toggleSkill} />
          {errors['skills'] ? (
            <span className="mt-2 block text-xs text-destructive">{errors['skills']}</span>
          ) : (
            <span className="mt-2 block text-xs text-muted-foreground">
              {skills.length} selected
            </span>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Seniority">
            <select
              className={fieldClass}
              value={form.seniority}
              onChange={(e) => set("seniority", e.target.value)}
            >
              {["Junior", "Mid-level", "Senior", "Lead / Manager", "Director"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Engagement model">
            <select
              className={fieldClass}
              value={form.engagement}
              onChange={(e) => set("engagement", e.target.value)}
            >
              {engagementModels.map((m) => (
                <option key={m.title}>{m.title}</option>
              ))}
            </select>
          </Field>
          <Field label="How many people?">
            <input
              className={fieldClass}
              value={form.headcount}
              onChange={(e) => set("headcount", e.target.value)}
              inputMode="numeric"
            />
          </Field>
          <Field label="Time-zone overlap needed" hint="e.g. 4 hours overlap with CET">
            <input
              className={fieldClass}
              value={form.overlap}
              onChange={(e) => set("overlap", e.target.value)}
              placeholder="4 hours with GMT+1"
            />
          </Field>
          <Field label="Ideal start date">
            <input
              type="date"
              className={fieldClass}
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
            />
          </Field>
          <Field label="Budget range (optional)">
            <input
              className={fieldClass}
              value={form.budget}
              onChange={(e) => set("budget", e.target.value)}
              placeholder="e.g. USD 2,000–3,000 / month"
            />
          </Field>
        </div>

        {candidateReference ? (
          <p className="rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm text-navy">
            Linked to candidate <strong>{candidateReference}</strong> — we will check their
            availability and consent before introducing them.
          </p>
        ) : null}
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="font-display text-lg font-semibold text-navy">2. Your company</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Company name" error={errors['companyName']}>
            <input
              className={fieldClass}
              value={form.companyName}
              onChange={(e) => set("companyName", e.target.value)}
            />
          </Field>
          <Field label="Website (optional)">
            <input
              className={fieldClass}
              value={form.website}
              onChange={(e) => set("website", e.target.value)}
              placeholder="https://"
            />
          </Field>
          <Field label="Industry">
            <input
              className={fieldClass}
              value={form.industry}
              onChange={(e) => set("industry", e.target.value)}
            />
          </Field>
          <Field label="Company size">
            <select
              className={fieldClass}
              value={form.companySize}
              onChange={(e) => set("companySize", e.target.value)}
            >
              {["1-10", "11-50", "51-200", "201-1000", "1000+"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Country / HQ" error={errors['country']} className="sm:col-span-2">
            <input
              className={fieldClass}
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="font-display text-lg font-semibold text-navy">3. You</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" error={errors['fullName']}>
            <input
              className={fieldClass}
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
            />
          </Field>
          <Field label="Work email" error={errors['email']}>
            <input
              type="email"
              className={fieldClass}
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>
          <Field label="Phone / WhatsApp (optional)">
            <input
              className={fieldClass}
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </Field>
          <Field label="Your role">
            <input
              className={fieldClass}
              value={form.contactRole}
              onChange={(e) => set("contactRole", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Anything else we should know?">
          <textarea
            rows={4}
            className={fieldClass}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Tools, working hours, team structure, what success looks like in 90 days…"
          />
        </Field>

        <div className="space-y-3">
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[color:var(--steel)]"
              checked={form.privacyAccepted}
              onChange={(e) => set("privacyAccepted", e.target.checked)}
            />
            <span>
              I agree that RemoSource may process this information to prepare a shortlist and contact
              me about this role.
            </span>
          </label>
          {errors['privacyAccepted'] ? (
            <span className="block text-xs text-destructive">{errors['privacyAccepted']}</span>
          ) : null}
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[color:var(--steel)]"
              checked={form.marketingOptIn}
              onChange={(e) => set("marketingOptIn", e.target.checked)}
            />
            <span>Send me occasional hiring insight for distributed teams.</span>
          </label>
        </div>

        <SubmitButton pending={pending} label="Submit brief & book consultation" />
      </fieldset>
      </form>
    </>
  );
}

/* ------------------------- talent application ------------------------- */

export function TalentApplicationForm() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categorySlug, setCategorySlug] = useState(roleCategories[0]!.slug);
  const [skills, setSkills] = useState<string[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    timezone: "",
    linkedin: "",
    portfolio: "",
    years: "3-5",
    english: "Professional",
    availability: "Within 2 weeks",
    preference: "Full-time dedicated",
    rate: "",
    summary: "",
    privacyAccepted: false,
    whatsapp: false,
  });

  const category = useMemo(
    () => roleCategories.find((r) => r.slug === categorySlug)!,
    [categorySlug],
  );
  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  const toggleSkill = (skill: string) =>
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next['fullName'] = "Your full name is required.";
    if (!emailRe.test(form.email)) next['email'] = "Enter a valid email address.";
    if (!form.phone.trim()) next['phone'] = "Phone / WhatsApp is required.";
    if (!form.country.trim()) next['country'] = "Country of residence is required.";
    if (!form.timezone.trim()) next['timezone'] = "Time zone is required.";
    if (skills.length === 0) next['skills'] = "Select at least one skill.";
    if (form.summary.trim().length < 40)
      next['summary'] = "Please write at least a couple of sentences (40+ characters).";
    if (!form.privacyAccepted) next['privacyAccepted'] = "Please accept the privacy notice.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Please complete the highlighted fields.");
      return;
    }

    setPending(true);
    const payload = {
      full_name: form.fullName,
      email: form.email,
      phone: form.phone,
      country: form.country,
      timezone: form.timezone,
      linkedin_url: form.linkedin.trim() || null,
      portfolio_url: form.portfolio.trim() || null,
      primary_discipline: category.name,
      skills,
      years_experience: form.years,
      english_proficiency: form.english,
      availability: form.availability,
      preferred_engagement: form.preference,
      expected_monthly_rate: form.rate.trim() || null,
      work_description: form.summary,
      consent: form.privacyAccepted,
      whatsapp_permission: form.whatsapp,
    };
    try {
      const response = await fetch(
        "https://apdflttewtuorcpckewu.supabase.co/functions/v1/submit-talent-application",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = (await response.json()) as { received?: boolean; error?: string };
      if (!response.ok || result.received !== true) {
        throw new Error(result.error || "Application submission failed.");
      }
    } catch {
      setPending(false);
      toast.error("We couldn't submit your application. Please try again.");
      return;
    }
    trackConversion("form_submission_completed", { form: "talent_application", source: window.location.pathname });
    setPending(false);
    toast.success("Application received. Watch your inbox for your assessment invite.");
    navigate({ to: "/thank-you", search: { flow: "apply" } as never });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <fieldset className="space-y-6">
        <legend className="font-display text-lg font-semibold text-navy">About you</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" error={errors['fullName']}>
            <input
              className={fieldClass}
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
            />
          </Field>
          <Field label="Email" error={errors['email']}>
            <input
              type="email"
              className={fieldClass}
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>
          <Field label="Phone / WhatsApp" error={errors['phone']}>
            <input
              className={fieldClass}
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </Field>
          <Field label="Country of residence" error={errors['country']}>
            <input
              className={fieldClass}
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
            />
          </Field>
          <Field label="Time zone" error={errors['timezone']} hint="e.g. GMT+3">
            <input
              className={fieldClass}
              value={form.timezone}
              onChange={(e) => set("timezone", e.target.value)}
            />
          </Field>
          <Field label="LinkedIn profile">
            <input
              className={fieldClass}
              value={form.linkedin}
              onChange={(e) => set("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/…"
            />
          </Field>
          <Field label="Portfolio / CV link" className="sm:col-span-2">
            <input
              className={fieldClass}
              value={form.portfolio}
              onChange={(e) => set("portfolio", e.target.value)}
              placeholder="Link to your portfolio, GitHub or CV"
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="font-display text-lg font-semibold text-navy">
          Your professional profile
        </legend>
        <Field label="Primary discipline">
          <select
            className={fieldClass}
            value={categorySlug}
            onChange={(e) => {
              setCategorySlug(e.target.value);
              setSkills([]);
            }}
          >
            {roleCategories.map((role) => (
              <option key={role.slug} value={role.slug}>
                {role.name}
              </option>
            ))}
          </select>
        </Field>

        <div>
          <span className="mb-2 block text-sm font-medium text-navy">
            Your skills — select all that apply
          </span>
          <SkillPicker skills={category.skills} selected={skills} onToggle={toggleSkill} />
          {errors['skills'] ? (
            <span className="mt-2 block text-xs text-destructive">{errors['skills']}</span>
          ) : (
            <span className="mt-2 block text-xs text-muted-foreground">
              {skills.length} selected
            </span>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Years of experience">
            <select
              className={fieldClass}
              value={form.years}
              onChange={(e) => set("years", e.target.value)}
            >
              {["0-2", "3-5", "6-9", "10+"].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </Field>
          <Field label="English proficiency">
            <select
              className={fieldClass}
              value={form.english}
              onChange={(e) => set("english", e.target.value)}
            >
              {["Conversational", "Professional", "Fluent", "Native"].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </Field>
          <Field label="Availability">
            <select
              className={fieldClass}
              value={form.availability}
              onChange={(e) => set("availability", e.target.value)}
            >
              {["Immediately", "Within 2 weeks", "Within a month", "Exploring only"].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </Field>
          <Field label="Preferred engagement">
            <select
              className={fieldClass}
              value={form.preference}
              onChange={(e) => set("preference", e.target.value)}
            >
              {engagementModels.map((m) => (
                <option key={m.title}>{m.title}</option>
              ))}
            </select>
          </Field>
          <Field label="Expected monthly rate (optional)" className="sm:col-span-2">
            <input
              className={fieldClass}
              value={form.rate}
              onChange={(e) => set("rate", e.target.value)}
              placeholder="e.g. USD 1,500 / month"
            />
          </Field>
        </div>

        <Field
          label="Tell us about your work"
          error={errors['summary']}
          hint="What you do, who you have done it for, and the results you are proud of."
        >
          <textarea
            rows={5}
            className={fieldClass}
            value={form.summary}
            onChange={(e) => set("summary", e.target.value)}
          />
        </Field>

        <div className="space-y-3">
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[color:var(--steel)]"
              checked={form.privacyAccepted}
              onChange={(e) => set("privacyAccepted", e.target.checked)}
            />
            <span>
              I consent to RemoSource assessing my profile. My name and contact details will only be
              shared with a company after I approve the introduction.
            </span>
          </label>
          {errors['privacyAccepted'] ? (
            <span className="block text-xs text-destructive">{errors['privacyAccepted']}</span>
          ) : null}
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[color:var(--steel)]"
              checked={form.whatsapp}
              onChange={(e) => set("whatsapp", e.target.checked)}
            />
            <span>You may contact me on WhatsApp about matching roles.</span>
          </label>
        </div>

        <SubmitButton pending={pending} label="Submit application" />
      </fieldset>
    </form>
  );
}

/* ----------------------------- referral ------------------------------ */

export function ReferralForm() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [type, setType] = useState<"talent" | "business">("talent");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    country: "",
    payout: "Bank transfer",
    refName: "",
    refEmail: "",
    context: "",
    privacyAccepted: false,
  });
  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next['fullName'] = "Your name is required.";
    if (!emailRe.test(form.email)) next['email'] = "Enter a valid email address.";
    if (!form.refName.trim()) next['refName'] = "Who are you referring?";
    if (!emailRe.test(form.refEmail)) next['refEmail'] = "Enter a valid email for your referral.";
    if (!form.privacyAccepted)
      next['privacyAccepted'] = "Please confirm your referral agreed to be introduced.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Please complete the highlighted fields.");
      return;
    }
    setPending(true);
    const payload: ReferralSubmission = {
      formType: "referral",
      submittedAt: new Date().toISOString(),
      referrer: {
        fullName: form.fullName,
        email: form.email,
        country: form.country,
        payoutMethod: form.payout,
      },
      referral: { type, name: form.refName, email: form.refEmail, context: form.context },
      consent: { privacyAccepted: form.privacyAccepted },
    };
    await submitToPipeline(payload);
    trackConversion("form_submission_completed", { form: payload.formType, source: window.location.pathname });
    setPending(false);
    toast.success("Referral submitted. We'll keep you posted on its progress.");
    navigate({ to: "/thank-you", search: { flow: "referral" } as never });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            { key: "talent", label: "I'm referring a professional" },
            { key: "business", label: "I'm referring a company" },
          ] as const
        ).map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setType(option.key)}
            className={cn(
              "rounded-xl border px-5 py-4 text-left text-sm font-medium transition-all",
              type === option.key
                ? "border-primary bg-primary/8 text-navy"
                : "border-border bg-card text-muted-foreground hover:border-primary/40",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" error={errors['fullName']}>
          <input
            className={fieldClass}
            value={form.fullName}
            onChange={(e) => set("fullName", e.target.value)}
          />
        </Field>
        <Field label="Your email" error={errors['email']}>
          <input
            type="email"
            className={fieldClass}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
        <Field label="Your country">
          <input
            className={fieldClass}
            value={form.country}
            onChange={(e) => set("country", e.target.value)}
          />
        </Field>
        <Field label="Preferred payout method">
          <select
            className={fieldClass}
            value={form.payout}
            onChange={(e) => set("payout", e.target.value)}
          >
            {["Bank transfer", "Mobile money", "PayPal", "Wise"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field
          label={type === "talent" ? "Professional's name" : "Company contact name"}
          error={errors['refName']}
        >
          <input
            className={fieldClass}
            value={form.refName}
            onChange={(e) => set("refName", e.target.value)}
          />
        </Field>
        <Field label="Their email" error={errors['refEmail']}>
          <input
            type="email"
            className={fieldClass}
            value={form.refEmail}
            onChange={(e) => set("refEmail", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Why are they a good fit?">
        <textarea
          rows={4}
          className={fieldClass}
          value={form.context}
          onChange={(e) => set("context", e.target.value)}
        />
      </Field>

      <div>
        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-[color:var(--steel)]"
            checked={form.privacyAccepted}
            onChange={(e) => set("privacyAccepted", e.target.checked)}
          />
          <span>
            I confirm the person I am referring is happy to be contacted by RemoSource, and I accept
            the referral programme terms.
          </span>
        </label>
        {errors['privacyAccepted'] ? (
          <span className="mt-1.5 block text-xs text-destructive">{errors['privacyAccepted']}</span>
        ) : null}
      </div>

      <SubmitButton pending={pending} label="Submit referral" />
    </form>
  );
}

/* ------------------------------ contact ------------------------------ */

export function ContactForm() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    company: "",
    enquiryType: "Hiring enquiry",
    channel: "Email",
    message: "",
  });
  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next['fullName'] = "Your name is required.";
    if (!emailRe.test(form.email)) next['email'] = "Enter a valid email address.";
    if (form.message.trim().length < 20) next['message'] = "Please add a little more detail.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Please complete the highlighted fields.");
      return;
    }
    setPending(true);
    const payload: ContactSubmission = {
      formType: "contact",
      submittedAt: new Date().toISOString(),
      fullName: form.fullName,
      email: form.email,
      company: form.company,
      enquiryType: form.enquiryType,
      message: form.message,
      preferredChannel: form.channel,
    };
    await submitToPipeline(payload);
    trackConversion("form_submission_completed", { form: payload.formType, source: window.location.pathname });
    setPending(false);
    toast.success("Message sent. We reply within one business day.");
    navigate({ to: "/thank-you", search: { flow: "contact" } as never });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" error={errors['fullName']}>
          <input
            className={fieldClass}
            value={form.fullName}
            onChange={(e) => set("fullName", e.target.value)}
          />
        </Field>
        <Field label="Email" error={errors['email']}>
          <input
            type="email"
            className={fieldClass}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
        <Field label="Company (optional)">
          <input
            className={fieldClass}
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
          />
        </Field>
        <Field label="Enquiry type">
          <select
            className={fieldClass}
            value={form.enquiryType}
            onChange={(e) => set("enquiryType", e.target.value)}
          >
            {[
              "Hiring enquiry",
              "Talent application question",
              "Referral programme",
              "Partnership",
              "Something else",
            ].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Preferred reply channel" className="sm:col-span-2">
          <select
            className={fieldClass}
            value={form.channel}
            onChange={(e) => set("channel", e.target.value)}
          >
            {["Email", "WhatsApp", "Video call"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Message" error={errors['message']}>
        <textarea
          rows={5}
          className={fieldClass}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </Field>
      <SubmitButton pending={pending} label="Send message" />
    </form>
  );
}
