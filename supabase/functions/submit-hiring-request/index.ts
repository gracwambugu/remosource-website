import { createClient } from "npm:@supabase/supabase-js@2.95.0";

type JsonRecord = Record<string, unknown>;
type HiringRequest = {
  role_title: string | null;
  core_responsibilities: string | null;
  must_have_skills: string[];
  seniority: string | null;
  engagement_model: string | null;
  working_hours_timezone_overlap: string | null;
  constraints_or_context: string | null;
  ai_generated_role_brief: string | null;
  service_category: string | null;
  skills_required: string[];
  people_count: number | null;
  timezone_overlap_needed: string | null;
  ideal_start_date: string | null;
  budget_range: string | null;
  company_name: string;
  website: string | null;
  industry: string | null;
  company_size: string | null;
  company_country: string;
  contact_full_name: string;
  work_email: string;
  phone: string | null;
  contact_role: string | null;
  additional_notes: string | null;
  privacy_consent: true;
  marketing_opt_in: boolean;
};

const SUPABASE_SECRET_KEY_NAME = "default";
const MAX_BODY_BYTES = 65_536;
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;
const MARKETING_EMAIL = "marketing@remosource.com";

const ALLOWED_FIELDS = new Set([
  "role_title",
  "core_responsibilities",
  "must_have_skills",
  "seniority",
  "engagement_model",
  "working_hours_timezone_overlap",
  "constraints_or_context",
  "ai_generated_role_brief",
  "service_category",
  "skills_required",
  "people_count",
  "timezone_overlap_needed",
  "ideal_start_date",
  "budget_range",
  "company_name",
  "website",
  "industry",
  "company_size",
  "company_country",
  "contact_full_name",
  "work_email",
  "phone",
  "contact_role",
  "additional_notes",
  "privacy_consent",
  "marketing_opt_in",
]);

const DUPLICATE_FIELDS: (keyof HiringRequest)[] = [
  "role_title",
  "core_responsibilities",
  "must_have_skills",
  "seniority",
  "engagement_model",
  "working_hours_timezone_overlap",
  "constraints_or_context",
  "ai_generated_role_brief",
  "service_category",
  "skills_required",
  "people_count",
  "timezone_overlap_needed",
  "ideal_start_date",
  "budget_range",
  "company_name",
  "website",
  "industry",
  "company_size",
  "company_country",
  "contact_full_name",
  "work_email",
  "phone",
  "contact_role",
  "additional_notes",
  "privacy_consent",
  "marketing_opt_in",
];

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalText(
  body: JsonRecord,
  field: string,
  maxLength: number,
): string | null {
  const value = body[field];
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") {
    throw new ValidationError(`${field} must be text.`);
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new ValidationError(
      `${field} must be ${maxLength} characters or fewer.`,
    );
  }
  return trimmed || null;
}

function requiredText(
  body: JsonRecord,
  field: string,
  maxLength: number,
): string {
  const value = body[field];
  if (typeof value !== "string" || !value.trim()) {
    throw new ValidationError(`${field} is required.`);
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new ValidationError(
      `${field} must be ${maxLength} characters or fewer.`,
    );
  }
  return trimmed;
}

function parseSkills(
  value: unknown,
  field: string,
  allowEmpty: boolean,
): string[] {
  if (
    !Array.isArray(value) ||
    (!allowEmpty && value.length === 0) ||
    value.length > 50
  ) {
    throw new ValidationError(
      `${field} must be an array${allowEmpty ? "" : " containing at least one skill"} with no more than 50 items.`,
    );
  }
  return value.map((skill, index) => {
    if (typeof skill !== "string" || !skill.trim()) {
      throw new ValidationError(
        `${field}[${index}] must be a non-empty string.`,
      );
    }
    const trimmed = skill.trim();
    if (trimmed.length > 100) {
      throw new ValidationError(
        `${field}[${index}] must be 100 characters or fewer.`,
      );
    }
    return trimmed;
  });
}

function parseOptionalDate(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new ValidationError(
      "ideal_start_date must be a valid YYYY-MM-DD date.",
    );
  }
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new ValidationError(
      "ideal_start_date must be a valid calendar date.",
    );
  }
  return value;
}

function parseOptionalWebsite(value: string | null): string | null {
  if (value === null) return null;
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      !url.hostname ||
      url.username ||
      url.password
    ) {
      throw new Error("Invalid HTTPS website URL");
    }
  } catch {
    throw new ValidationError("website must be a valid HTTPS URL.");
  }
  return value;
}

function parseHiringRequest(value: unknown): HiringRequest {
  if (!isRecord(value)) {
    throw new ValidationError("Request body must be a JSON object.");
  }

  const unexpectedFields = Object.keys(value).filter(
    (field) => !ALLOWED_FIELDS.has(field),
  );
  if (unexpectedFields.length > 0) {
    throw new ValidationError(
      `Unexpected field(s): ${unexpectedFields.join(", ")}.`,
    );
  }
  if (value.privacy_consent !== true) {
    throw new ValidationError("privacy_consent must be true.");
  }

  const workEmail = requiredText(value, "work_email", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(workEmail)) {
    throw new ValidationError("work_email must be a valid email address.");
  }

  let peopleCount: number | null = null;
  if (
    value.people_count !== undefined &&
    value.people_count !== null &&
    value.people_count !== ""
  ) {
    if (
      typeof value.people_count !== "number" ||
      !Number.isSafeInteger(value.people_count) ||
      value.people_count <= 0
    ) {
      throw new ValidationError("people_count must be a positive integer.");
    }
    peopleCount = value.people_count;
  }

  if (
    value.marketing_opt_in !== undefined &&
    typeof value.marketing_opt_in !== "boolean"
  ) {
    throw new ValidationError("marketing_opt_in must be a boolean.");
  }

  return {
    role_title: optionalText(value, "role_title", 200),
    core_responsibilities: optionalText(value, "core_responsibilities", 10_000),
    must_have_skills:
      value.must_have_skills === undefined
        ? []
        : parseSkills(value.must_have_skills, "must_have_skills", true),
    seniority: optionalText(value, "seniority", 100),
    engagement_model: optionalText(value, "engagement_model", 120),
    working_hours_timezone_overlap: optionalText(
      value,
      "working_hours_timezone_overlap",
      500,
    ),
    constraints_or_context: optionalText(
      value,
      "constraints_or_context",
      10_000,
    ),
    ai_generated_role_brief: optionalText(
      value,
      "ai_generated_role_brief",
      20_000,
    ),
    service_category: optionalText(value, "service_category", 120),
    skills_required: parseSkills(
      value.skills_required,
      "skills_required",
      false,
    ),
    people_count: peopleCount,
    timezone_overlap_needed: optionalText(
      value,
      "timezone_overlap_needed",
      500,
    ),
    ideal_start_date: parseOptionalDate(value.ideal_start_date),
    budget_range: optionalText(value, "budget_range", 200),
    company_name: requiredText(value, "company_name", 200),
    website: parseOptionalWebsite(optionalText(value, "website", 2048)),
    industry: optionalText(value, "industry", 150),
    company_size: optionalText(value, "company_size", 100),
    company_country: requiredText(value, "company_country", 100),
    contact_full_name: requiredText(value, "contact_full_name", 200),
    work_email: workEmail,
    phone: optionalText(value, "phone", 64),
    contact_role: optionalText(value, "contact_role", 150),
    additional_notes: optionalText(value, "additional_notes", 10_000),
    privacy_consent: true,
    marketing_opt_in: value.marketing_opt_in === true,
  };
}

function getAllowedOrigins(): Set<string> {
  return new Set(["https://remosource.com", "https://www.remosource.com"]);
}

function isAllowedOrigin(origin: string, allowedOrigins: Set<string>): boolean {
  if (allowedOrigins.has(origin)) return true;
  if (Deno.env.get("ALLOW_LOCAL_DEV_ORIGINS") !== "true") return false;
  const match =
    /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.0\.104):(\d{1,5})$/.exec(
      origin,
    );
  if (!match) return false;
  const port = Number(match[2]);
  return port >= 1 && port <= 65_535;
}

function responseHeaders(origin: string, allowedOrigins: Set<string>): Headers {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    Vary: "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, idempotency-key",
    "Access-Control-Max-Age": "86400",
  });
  if (isAllowedOrigin(origin, allowedOrigins)) {
    headers.set("Access-Control-Allow-Origin", origin);
  }
  return headers;
}

function jsonResponse(
  body: JsonRecord,
  status: number,
  origin: string,
  allowedOrigins: Set<string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders(origin, allowedOrigins),
  });
}

function createAdminClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const rawSecretKeys = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (!supabaseUrl) throw new Error("SUPABASE_URL is not configured");
  if (!rawSecretKeys) throw new Error("SUPABASE_SECRET_KEYS is not configured");

  let secretKeys: unknown;
  try {
    secretKeys = JSON.parse(rawSecretKeys);
  } catch {
    throw new Error("SUPABASE_SECRET_KEYS is not valid JSON");
  }
  if (!isRecord(secretKeys)) {
    throw new Error("SUPABASE_SECRET_KEYS must be a JSON object");
  }
  const secretKey = secretKeys[SUPABASE_SECRET_KEY_NAME];
  if (typeof secretKey !== "string" || !secretKey) {
    throw new Error(
      `Supabase secret key '${SUPABASE_SECRET_KEY_NAME}' is unavailable`,
    );
  }
  return createClient(supabaseUrl, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function readRequestBody(req: Request): Promise<string | null> {
  const reader = req.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  let byteLength = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    byteLength += value.byteLength;
    if (byteLength > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

async function sendResendEmail(
  apiKey: string | undefined,
  to: string,
  subject: string,
  text: string,
): Promise<boolean> {
  if (!apiKey) {
    console.error(
      "Email delivery unavailable: RESEND_API_KEY is not configured",
    );
    return false;
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: MARKETING_EMAIL,
        to: [to],
        subject,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error("Resend rejected a hiring-request email", {
        status: response.status,
      });
      return false;
    }
    return true;
  } catch (error) {
    console.error(
      "Resend request failed for a hiring-request email",
      error instanceof Error ? error.name : "unknown error",
    );
    return false;
  }
}

function clientConfirmationText(request: HiringRequest): string {
  return `Hello ${request.contact_full_name}, RemoSource has received your hiring request. Our recruitment team will review the requirements, and a member of the team will contact you regarding next steps.

Please note: This is an automated confirmation. Replies to this email are not monitored. For recruitment enquiries, please contact the RemoSource recruitment team through the official contact channels.

RemoSource
Talent & Recruitment Team
marketing@remosource.com`;
}

function recruitmentNotificationText(
  request: HiringRequest,
  requestId: string,
  createdAt: string,
): string {
  return `New RemoSource hiring request

Request ID: ${requestId}
Role title: ${request.role_title ?? "Not provided"}
Core responsibilities: ${request.core_responsibilities ?? "Not provided"}
Must-have skills: ${request.must_have_skills.join(", ") || "Not provided"}
AI-generated role brief: ${request.ai_generated_role_brief ?? "Not provided"}
Service category: ${request.service_category ?? "Not provided"}
Skills required: ${request.skills_required.join(", ")}
Seniority: ${request.seniority ?? "Not provided"}
Engagement model: ${request.engagement_model ?? "Not provided"}
People count: ${request.people_count ?? "Not provided"}
Working hours/time-zone overlap: ${request.working_hours_timezone_overlap ?? "Not provided"}
Time-zone overlap needed: ${request.timezone_overlap_needed ?? "Not provided"}
Ideal start date: ${request.ideal_start_date ?? "Not provided"}
Budget range: ${request.budget_range ?? "Not provided"}
Constraints or context: ${request.constraints_or_context ?? "Not provided"}

Company name: ${request.company_name}
Website: ${request.website ?? "Not provided"}
Industry: ${request.industry ?? "Not provided"}
Company size: ${request.company_size ?? "Not provided"}
Company country: ${request.company_country}

Contact name: ${request.contact_full_name}
Work email: ${request.work_email}
Phone: ${request.phone ?? "Not provided"}
Contact role: ${request.contact_role ?? "Not provided"}
Additional notes: ${request.additional_notes ?? "Not provided"}
Privacy consent: ${request.privacy_consent ? "Yes" : "No"}
Marketing opt-in: ${request.marketing_opt_in ? "Yes" : "No"}
Created at: ${createdAt}`;
}

Deno.serve(async (req: Request): Promise<Response> => {
  const allowedOrigins = getAllowedOrigins();
  const origin = req.headers.get("Origin") ?? "";
  if (!isAllowedOrigin(origin, allowedOrigins)) {
    return jsonResponse(
      { error: "Origin is not allowed." },
      403,
      origin,
      allowedOrigins,
    );
  }
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: responseHeaders(origin, allowedOrigins),
    });
  }
  if (req.method !== "POST") {
    return jsonResponse(
      { error: "Method not allowed." },
      405,
      origin,
      allowedOrigins,
    );
  }
  const contentType = req.headers
    .get("Content-Type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();
  if (contentType !== "application/json") {
    return jsonResponse(
      { error: "Content-Type must be application/json." },
      415,
      origin,
      allowedOrigins,
    );
  }

  let rawBody: string | null;
  try {
    rawBody = await readRequestBody(req);
  } catch (error) {
    console.error(
      "Hiring-request body read failed",
      error instanceof Error ? error.name : "unknown error",
    );
    return jsonResponse(
      { error: "Unable to read request body." },
      400,
      origin,
      allowedOrigins,
    );
  }
  if (rawBody === null) {
    return jsonResponse(
      { error: "Request body is too large." },
      413,
      origin,
      allowedOrigins,
    );
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return jsonResponse(
      { error: "Request body must contain valid JSON." },
      400,
      origin,
      allowedOrigins,
    );
  }

  let request: HiringRequest;
  try {
    request = parseHiringRequest(parsedBody);
  } catch (error) {
    if (error instanceof ValidationError) {
      return jsonResponse(
        { error: error.message },
        400,
        origin,
        allowedOrigins,
      );
    }
    throw error;
  }

  let supabase: ReturnType<typeof createAdminClient>;
  try {
    supabase = createAdminClient();
  } catch (error) {
    console.error(
      "Hiring-request service configuration error",
      error instanceof Error ? error.message : "unknown error",
    );
    return jsonResponse(
      {
        received: false,
        error: "The hiring-request service is not configured.",
      },
      503,
      origin,
      allowedOrigins,
    );
  }
  const createdAt = new Date();
  const createdAtIso = createdAt.toISOString();
  const duplicateCutoff = new Date(
    createdAt.getTime() - DUPLICATE_WINDOW_MS,
  ).toISOString();

  let existingRequests: JsonRecord[] | null;
  try {
    const { data, error } = await supabase
      .schema("public")
      .from("hiring_requests")
      .select("*")
      .eq("work_email", request.work_email)
      .gte("created_at", duplicateCutoff);
    if (error) {
      console.error("Hiring-request duplicate check failed", {
        code: error.code,
      });
      return jsonResponse(
        {
          received: false,
          error: "Unable to verify whether this request was already submitted.",
        },
        503,
        origin,
        allowedOrigins,
      );
    }
    existingRequests = data as JsonRecord[] | null;
  } catch (error) {
    console.error(
      "Hiring-request duplicate check failed",
      error instanceof Error ? error.name : "unknown error",
    );
    return jsonResponse(
      {
        received: false,
        error: "Unable to verify whether this request was already submitted.",
      },
      503,
      origin,
      allowedOrigins,
    );
  }

  const duplicate = existingRequests?.find((existing) =>
    DUPLICATE_FIELDS.every(
      (field) =>
        JSON.stringify(existing[field]) === JSON.stringify(request[field]),
    ),
  );
  if (duplicate) {
    const duplicateId = duplicate.id;
    if (typeof duplicateId !== "string") {
      console.error("Duplicate hiring request is missing its generated ID");
      return jsonResponse(
        { received: false, error: "Unable to verify the existing request." },
        503,
        origin,
        allowedOrigins,
      );
    }
    return jsonResponse(
      { received: true, requestId: duplicateId },
      200,
      origin,
      allowedOrigins,
    );
  }

  let requestId: string;
  try {
    const { data, error } = await supabase
      .schema("public")
      .from("hiring_requests")
      .insert({ ...request, created_at: createdAtIso })
      .select("id")
      .single();
    if (error || !data || typeof data.id !== "string") {
      console.error("Hiring-request insert failed", {
        code: error?.code ?? "no_row_returned",
      });
      return jsonResponse(
        {
          received: false,
          error: "We could not save your hiring request. Please try again.",
        },
        500,
        origin,
        allowedOrigins,
      );
    }
    requestId = data.id;
  } catch (error) {
    console.error(
      "Hiring-request insert failed",
      error instanceof Error ? error.name : "unknown error",
    );
    return jsonResponse(
      {
        received: false,
        error: "We could not save your hiring request. Please try again.",
      },
      500,
      origin,
      allowedOrigins,
    );
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const clientEmailSent = await sendResendEmail(
    resendApiKey,
    request.work_email,
    "We've received your RemoSource hiring request.",
    clientConfirmationText(request),
  );
  if (!clientEmailSent) {
    console.error("Client confirmation email failed for hiring request", {
      requestId,
    });
  }

  const recruitmentEmailSent = await sendResendEmail(
    resendApiKey,
    MARKETING_EMAIL,
    `New RemoSource hiring request: ${request.role_title ?? request.company_name}`,
    recruitmentNotificationText(request, requestId, createdAtIso),
  );
  if (!recruitmentEmailSent) {
    console.error("Recruitment notification email failed for hiring request", {
      requestId,
    });
  }

  return jsonResponse(
    { received: true, requestId },
    200,
    origin,
    allowedOrigins,
  );
});
