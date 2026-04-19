import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

interface SurveyPayload {
  role: string;
  name: string | null;
  email: string | null;
  studio_name: string | null;
  answers: Record<string, string | string[] | number>;
  top_features: string[];
}

function buildEmailHtml(data: SurveyPayload): string {
  const roleBadgeColor =
    data.role === "owner"
      ? "rgba(201,169,110,0.15);color:#c9a96e"
      : data.role === "teacher"
        ? "rgba(134,179,134,0.15);color:#a3c9a3"
        : "rgba(134,155,199,0.15);color:#a3b5c9";

  const answerRows = Object.entries(data.answers)
    .filter(([key]) => !["name", "email", "studio_name"].includes(key))
    .map(([key, val]) => {
      const label = key.replace(/_/g, " ");
      const display = Array.isArray(val) ? val.join(", ") : String(val);
      return `<tr>
        <td style="padding:8px 0 4px;color:#a09a90;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;">${label}</td>
      </tr>
      <tr>
        <td style="padding:0 0 12px;color:#f0ebe3;font-size:14px;line-height:1.5;">${display}</td>
      </tr>`;
    })
    .join("");

  const featureList = data.top_features
    .map((f, i) => `${i + 1}. ${f}`)
    .join("<br>");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#2b2b28;font-family:-apple-system,system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#2b2b28;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#333330;border-radius:16px;overflow:hidden;">

<tr><td style="padding:32px 32px 24px;">
  <span style="color:#a09a90;font-size:13px;font-style:italic;">PW</span>
  <span style="color:#706b62;font-size:13px;margin:0 8px;">|</span>
  <span style="color:#a09a90;font-size:13px;">New Survey Response</span>
</td></tr>

<tr><td style="padding:0 32px 8px;">
  <h1 style="margin:0;color:#f0ebe3;font-size:22px;font-weight:300;font-family:Georgia,serif;">
    ${data.name || "Anonymous"} ${data.studio_name ? `at ${data.studio_name}` : ""}
  </h1>
</td></tr>

<tr><td style="padding:0 32px 24px;">
  <span style="display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;text-transform:uppercase;letter-spacing:1px;background:${roleBadgeColor};">${data.role}</span>
  ${data.email ? `<span style="color:#a09a90;font-size:13px;margin-left:12px;">${data.email}</span>` : ""}
</td></tr>

<tr><td style="padding:0 32px;">
  <hr style="border:none;border-top:1px solid rgba(240,235,227,0.1);margin:0 0 16px;">
</td></tr>

<tr><td style="padding:0 32px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    ${answerRows}
  </table>
</td></tr>

${
  data.top_features.length > 0
    ? `<tr><td style="padding:16px 32px 0;">
  <hr style="border:none;border-top:1px solid rgba(240,235,227,0.1);margin:0 0 16px;">
  <p style="color:#c9a96e;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Top Features</p>
  <p style="color:#f0ebe3;font-size:14px;line-height:1.8;margin:0;">${featureList}</p>
</td></tr>`
    : ""
}

<tr><td style="padding:24px 32px 32px;">
  <hr style="border:none;border-top:1px solid rgba(240,235,227,0.1);margin:0 0 16px;">
  <p style="margin:0;color:#706b62;font-size:12px;">View all responses: survey.peterwalters.app/results</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const data: SurveyPayload = await req.json();

    // Save to Supabase
    const { error } = await supabase.from("survey_responses").insert({
      role: data.role,
      name: data.name,
      email: data.email,
      studio_name: data.studio_name,
      answers: data.answers,
      top_features: data.top_features,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    // Send notification email
    try {
      const roleLabel = data.role === "owner" ? "Studio Owner" : data.role === "teacher" ? "Teacher" : "Student";
      await resend.emails.send({
        from: "Survey <onboarding@resend.dev>",
        to: "peter.b.walters@gmail.com",
        subject: `New survey: ${data.name || "Anonymous"} (${roleLabel}) ${data.studio_name ? `— ${data.studio_name}` : ""}`,
        html: buildEmailHtml(data),
      });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
      // Don't fail the response if email fails
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
