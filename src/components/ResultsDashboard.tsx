"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabase } from "@/lib/supabase";
import { FEATURES } from "@/lib/questions";

interface Response {
  id: string;
  created_at: string;
  role: string;
  name: string | null;
  email: string | null;
  studio_name: string | null;
  answers: Record<string, unknown>;
  top_features: string[];
}

export default function ResultsDashboard() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResponses = useCallback(async () => {
    setLoading(true);
    const { data } = await getSupabase()
      .from("survey_responses")
      .select("*")
      .order("created_at", { ascending: false });
    setResponses(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) fetchResponses();
  }, [authenticated, fetchResponses]);

  if (!authenticated) {
    return (
      <div className="max-w-xs mx-auto py-20 text-center">
        <h2
          className="text-xl font-light mb-4"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}
        >
          Dashboard Access
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Simple client-side password check — not meant to be Fort Knox
            if (password === "pwyoga2026") {
              setAuthenticated(true);
            } else {
              alert("Wrong password");
            }
          }}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl px-4 py-3 text-[15px] mb-3 focus:outline-none"
            style={{
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-medium)",
            }}
          />
          <button
            type="submit"
            className="w-full px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: "var(--accent-gold)", color: "var(--bg-primary)" }}
          >
            View Results
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <p className="text-center py-20" style={{ color: "var(--text-muted)" }}>
        Loading responses...
      </p>
    );
  }

  const owners = responses.filter((r) => r.role === "owner");
  const teachers = responses.filter((r) => r.role === "teacher");
  const students = responses.filter((r) => r.role === "student");

  // Feature ranking across all responses
  const featureCounts: Record<string, number> = {};
  FEATURES.forEach((f) => (featureCounts[f] = 0));
  responses.forEach((r) => {
    (r.top_features || []).forEach((f) => {
      featureCounts[f] = (featureCounts[f] || 0) + 1;
    });
  });
  const rankedFeatures = Object.entries(featureCounts)
    .sort((a, b) => b[1] - a[1])
    .filter(([, count]) => count > 0);

  // Feature ranking by role
  function featuresByRole(roleResponses: Response[]) {
    const counts: Record<string, number> = {};
    roleResponses.forEach((r) => {
      (r.top_features || []).forEach((f) => {
        counts[f] = (counts[f] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }

  // Price sensitivity (owners only)
  const priceCounts: Record<string, number> = {};
  owners.forEach((r) => {
    const price = r.answers?.willingness_to_pay as string;
    if (price) priceCounts[price] = (priceCounts[price] || 0) + 1;
  });

  // Interest scores
  function avgScale(roleResponses: Response[], field: string): string {
    const vals = roleResponses
      .map((r) => r.answers?.[field] as number)
      .filter((v) => typeof v === "number");
    if (vals.length === 0) return "—";
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  }

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Owners" value={owners.length} />
        <StatCard label="Teachers" value={teachers.length} />
        <StatCard label="Students" value={students.length} />
      </div>

      {/* Key metrics */}
      {owners.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCard label="Avg Owner Interest" value={avgScale(owners, "community_app_interest") + "/5"} small />
          <StatCard label="Avg Student Would Use" value={avgScale(students, "would_use_app") + "/5"} small />
          <StatCard label="Avg Teacher Interest" value={avgScale(teachers, "would_use_community") + "/5"} small />
          <StatCard label="Avg Student Connection" value={avgScale(students, "community_connection") + "/5"} small />
        </div>
      )}

      {/* Feature ranking - all */}
      {rankedFeatures.length > 0 && (
        <Section title="Top Features (All Roles)">
          {rankedFeatures.map(([feature, count], i) => (
            <BarItem
              key={feature}
              rank={i + 1}
              label={feature}
              count={count}
              total={responses.length}
            />
          ))}
        </Section>
      )}

      {/* Feature ranking by role */}
      {owners.length > 0 && (
        <Section title="Top Features — Owners">
          {featuresByRole(owners).map(([feature, count], i) => (
            <BarItem key={feature} rank={i + 1} label={feature} count={count} total={owners.length} />
          ))}
        </Section>
      )}

      {students.length > 0 && (
        <Section title="Top Features — Students">
          {featuresByRole(students).map(([feature, count], i) => (
            <BarItem key={feature} rank={i + 1} label={feature} count={count} total={students.length} />
          ))}
        </Section>
      )}

      {/* Price sensitivity */}
      {Object.keys(priceCounts).length > 0 && (
        <Section title="Willingness to Pay (Owners)">
          {Object.entries(priceCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([price, count]) => (
              <div key={price} className="flex justify-between py-2" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <span className="text-[14px]" style={{ color: "var(--text-primary)" }}>{price}</span>
                <span className="text-[14px] font-medium" style={{ color: "var(--accent-gold)" }}>{count}</span>
              </div>
            ))}
        </Section>
      )}

      {/* Individual responses */}
      <Section title={`All Responses (${responses.length})`}>
        {responses.map((r) => (
          <div
            key={r.id}
            className="rounded-xl p-4 mb-3"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-medium)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wide"
                style={{
                  background: r.role === "owner" ? "rgba(201, 169, 110, 0.15)" : r.role === "teacher" ? "rgba(134, 179, 134, 0.15)" : "rgba(134, 155, 199, 0.15)",
                  color: r.role === "owner" ? "var(--accent-gold)" : r.role === "teacher" ? "#a3c9a3" : "#a3b5c9",
                }}
              >
                {r.role}
              </span>
              <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                {new Date(r.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-[14px] mb-1" style={{ color: "var(--text-primary)" }}>
              {r.name || "Anonymous"} {r.email ? `(${r.email})` : ""} — {r.studio_name || "No studio listed"}
            </p>
            {r.top_features?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {r.top_features.map((f) => (
                  <span
                    key={f}
                    className="px-2 py-0.5 rounded text-[11px]"
                    style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}
            {/* Show open-ended answers */}
            {Object.entries(r.answers || {}).map(([key, val]) => {
              if (typeof val !== "string" || val.length < 10) return null;
              if (["name", "email", "studio_name"].includes(key)) return null;
              return (
                <div key={key} className="mt-2">
                  <span className="text-[11px] uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                    {key.replace(/_/g, " ")}
                  </span>
                  <p className="text-[13px] italic mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    "{val}"
                  </p>
                </div>
              );
            })}
          </div>
        ))}
      </Section>

      <button
        onClick={fetchResponses}
        className="w-full py-3 rounded-xl text-sm mt-4"
        style={{ color: "var(--text-secondary)", border: "1px solid var(--border-medium)" }}
      >
        Refresh
      </button>
    </div>
  );
}

function StatCard({ label, value, small }: { label: string; value: string | number; small?: boolean }) {
  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-medium)" }}
    >
      <p
        className={small ? "text-xl font-light" : "text-3xl font-light"}
        style={{ color: "var(--accent-gold)", fontFamily: "var(--font-serif)" }}
      >
        {value}
      </p>
      <p className="text-[11px] uppercase tracking-wide mt-1" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3
        className="text-sm font-medium mb-4 pb-2"
        style={{
          color: "var(--text-secondary)",
          borderBottom: "1px solid var(--border-medium)",
          fontFamily: "var(--font-serif)",
          letterSpacing: "0.05em",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function BarItem({ rank, label, count, total }: { rank: number; label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[13px]" style={{ color: "var(--text-primary)" }}>
          <span style={{ color: "var(--text-muted)" }} className="mr-2 text-[11px]">{rank}.</span>
          {label}
        </span>
        <span className="text-[12px] tabular-nums" style={{ color: "var(--text-muted)" }}>
          {count} ({pct}%)
        </span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--border-medium)" }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: "var(--accent-gold)",
            transition: "width 0.5s ease-out",
          }}
        />
      </div>
    </div>
  );
}
