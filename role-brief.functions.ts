import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const roleBriefInputSchema = z.object({
  roleTitle: z.string().trim().min(2),
  responsibilities: z.string().trim().min(20),
  mustHaveSkills: z.string().trim().min(2),
  seniority: z.string().trim().min(2),
  workingPattern: z.string().trim().min(2),
  engagementModel: z.string().trim().min(2),
  constraints: z.string().trim(),
});

export type RoleBriefInput = z.infer<typeof roleBriefInputSchema>;

const roleBriefOutputSchema = z.object({
  roleTitle: z.string(),
  summary: z.string(),
  outcomes: z.array(z.string()),
  requiredCapabilities: z.array(z.string()),
  preferredCapabilities: z.array(z.string()),
  screeningQuestions: z.array(z.string()),
  assessmentCriteria: z.array(
    z.object({
      criterion: z.string(),
      evidence: z.string(),
      scoring: z.string(),
    }),
  ),
  interviewFocusAreas: z.array(z.string()),
  riskFlags: z.array(z.string()),
});

export type GeneratedRoleBrief = z.infer<typeof roleBriefOutputSchema>;

function normalizeBrief(value: GeneratedRoleBrief): GeneratedRoleBrief {
  return {
    ...value,
    roleTitle: value.roleTitle.trim(),
    summary: value.summary.trim(),
    outcomes: value.outcomes
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 6),
    requiredCapabilities: value.requiredCapabilities
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 8),
    preferredCapabilities: value.preferredCapabilities
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 5),
    screeningQuestions: value.screeningQuestions
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 6),
    assessmentCriteria: value.assessmentCriteria
      .map((item) => ({
        criterion: item.criterion.trim(),
        evidence: item.evidence.trim(),
        scoring: item.scoring.trim(),
      }))
      .filter((item) => item.criterion && item.evidence && item.scoring)
      .slice(0, 6),
    interviewFocusAreas: value.interviewFocusAreas
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 5),
    riskFlags: value.riskFlags
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 5),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function geminiErrorMessage(status: number): string {
  if (status === 401 || status === 403) {
    return "AI brief generation is not configured correctly.";
  }
  if (status === 429) {
    return "AI brief generation is busy right now. Please wait a moment and try again.";
  }
  if (status >= 500) {
    return "The AI service is temporarily unavailable. Please try again shortly.";
  }
  return "We could not generate the brief. Your requirements are still here, so you can try again.";
}

export const generateRoleBrief = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => roleBriefInputSchema.parse(input))
  .handler(async ({ data }) => {
    const geminiApiKey = process.env["GEMINI_API_KEY"];
    if (!geminiApiKey)
      throw new Error("AI brief generation is not configured yet.");

    const prompt = `Create a practical recruitment role brief from the business requirements below.

Role title: ${data.roleTitle}
Core responsibilities: ${data.responsibilities}
Must-have skills: ${data.mustHaveSkills}
Seniority: ${data.seniority}
Working hours / time-zone overlap: ${data.workingPattern}
Engagement model: ${data.engagementModel}
Constraints or context: ${data.constraints || "None supplied"}

Write for a human recruiter and hiring manager. Do not promise hiring outcomes, compensation, availability, or candidate supply. Keep the summary to 2–3 sentences. Return 4–6 outcomes, 4–8 required capabilities, up to 5 preferred capabilities, 4–6 screening questions, 4–6 assessment criteria, 3–5 interview focus areas, and up to 5 realistic risk flags. Each assessment criterion must state observable evidence and a concise scoring signal.`;

    let response: Response;
    try {
      response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": geminiApiKey,
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [
                {
                  text: "You are a senior global recruitment consultant. Turn unstructured hiring requirements into a specific, fair, evidence-based role brief and screening plan. Avoid discriminatory criteria and unsupported claims.",
                },
              ],
            },
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseJsonSchema: {
                type: "object",
                properties: {
                  roleTitle: { type: "string" },
                  summary: { type: "string" },
                  outcomes: { type: "array", items: { type: "string" } },
                  requiredCapabilities: {
                    type: "array",
                    items: { type: "string" },
                  },
                  preferredCapabilities: {
                    type: "array",
                    items: { type: "string" },
                  },
                  screeningQuestions: {
                    type: "array",
                    items: { type: "string" },
                  },
                  assessmentCriteria: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        criterion: { type: "string" },
                        evidence: { type: "string" },
                        scoring: { type: "string" },
                      },
                      required: ["criterion", "evidence", "scoring"],
                    },
                  },
                  interviewFocusAreas: {
                    type: "array",
                    items: { type: "string" },
                  },
                  riskFlags: { type: "array", items: { type: "string" } },
                },
                required: [
                  "roleTitle",
                  "summary",
                  "outcomes",
                  "requiredCapabilities",
                  "preferredCapabilities",
                  "screeningQuestions",
                  "assessmentCriteria",
                  "interviewFocusAreas",
                  "riskFlags",
                ],
              },
            },
          }),
          signal: AbortSignal.timeout(30_000),
        },
      );
    } catch {
      throw new Error(
        "The AI service is temporarily unavailable. Please try again shortly.",
      );
    }

    if (!response.ok) {
      throw new Error(geminiErrorMessage(response.status));
    }

    let responseBody: unknown;
    try {
      responseBody = await response.json();
    } catch {
      throw new Error(
        "The AI service returned an invalid response. Please try again.",
      );
    }

    if (!isRecord(responseBody) || !Array.isArray(responseBody.candidates)) {
      throw new Error(
        "The AI service returned an invalid response. Please try again.",
      );
    }

    const candidate = responseBody.candidates[0];
    if (
      !isRecord(candidate) ||
      !isRecord(candidate.content) ||
      !Array.isArray(candidate.content.parts)
    ) {
      throw new Error(
        "The AI service returned an invalid response. Please try again.",
      );
    }

    const responseText = candidate.content.parts
      .filter(
        (part): part is Record<string, unknown> =>
          isRecord(part) && typeof part.text === "string",
      )
      .map((part) => part.text as string)
      .join("");

    let generatedBrief: unknown;
    try {
      generatedBrief = JSON.parse(responseText);
    } catch {
      throw new Error(
        "The AI service returned an invalid role brief. Please try again.",
      );
    }

    const parsedBrief = roleBriefOutputSchema.safeParse(generatedBrief);
    if (!parsedBrief.success) {
      throw new Error(
        "The AI service returned an invalid role brief. Please try again.",
      );
    }

    return normalizeBrief(parsedBrief.data);
  });
