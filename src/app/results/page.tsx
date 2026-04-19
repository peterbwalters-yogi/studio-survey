export const dynamic = "force-dynamic";

import ResultsDashboard from "@/components/ResultsDashboard";

export default function ResultsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <header className="px-4 py-5 sm:px-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="max-w-3xl mx-auto flex items-baseline gap-3">
          <span
            className="text-sm italic tracking-wide"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-serif)" }}
          >
            PW
          </span>
          <h1
            className="text-lg font-light tracking-wide"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}
          >
            Survey Results
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto w-full px-4 py-8 sm:px-6">
        <ResultsDashboard />
      </main>
    </div>
  );
}
