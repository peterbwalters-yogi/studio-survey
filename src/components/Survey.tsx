"use client";

import { useState } from "react";
import { Role, FEATURES, getQuestionsForRole, Question } from "@/lib/questions";
import RolePicker from "./RolePicker";
import QuestionField from "./QuestionField";
import FeaturePicker from "./FeaturePicker";

type Step = "intro" | "role" | "questions" | "features" | "thanks";

export default function Survey() {
  const [step, setStep] = useState<Step>("intro");
  const [role, setRole] = useState<Role | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  const questions = role ? getQuestionsForRole(role) : [];
  const currentQuestion = questions[questionIndex];
  const isLastQuestion = questionIndex === questions.length - 1;

  function updateAnswer(id: string, value: string | string[] | number) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function nextQuestion() {
    if (isLastQuestion) {
      setStep("features");
    } else {
      setQuestionIndex((i) => i + 1);
    }
  }

  function prevQuestion() {
    if (questionIndex === 0) {
      setStep("role");
    } else {
      setQuestionIndex((i) => i - 1);
    }
  }

  function canProceed(): boolean {
    if (!currentQuestion) return false;
    if (!currentQuestion.required) return true;
    const val = answers[currentQuestion.id];
    if (val === undefined || val === "") return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  }

  async function handleSubmit() {
    if (!role) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          name: answers.name || null,
          email: answers.email || null,
          studio_name: answers.studio_name || null,
          answers,
          top_features: selectedFeatures,
        }),
      });
      if (!res.ok) console.error("Submit failed:", await res.text());
    } catch (err) {
      console.error("Submit error:", err);
    }

    setSubmitting(false);
    setStep("thanks");
  }

  // Intro screen
  if (step === "intro") {
    return (
      <div className="text-center py-12">
        <h2
          className="text-3xl font-light mb-4 tracking-wide"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}
        >
          Help shape the future of yoga studio community
        </h2>
        <p
          className="text-[15px] max-w-md mx-auto leading-relaxed mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          I'm building a community app for yoga studios — a place where students
          and teachers actually connect beyond the mat. This survey takes about
          3 minutes and will directly shape what gets built.
        </p>
        <p
          className="text-[13px] max-w-sm mx-auto leading-relaxed mb-8"
          style={{ color: "var(--text-muted)" }}
        >
          Whether you own a studio, teach, or just practice — your perspective matters.
        </p>
        <button
          onClick={() => setStep("role")}
          className="px-8 py-3 rounded-lg text-sm font-medium tracking-wide transition-colors"
          style={{ background: "var(--accent-gold)", color: "var(--bg-primary)" }}
        >
          Start Survey
        </button>
        <p className="text-[11px] mt-6" style={{ color: "var(--text-muted)" }}>
          Your answers are confidential. No spam, ever.
        </p>
      </div>
    );
  }

  // Role picker
  if (step === "role") {
    return (
      <RolePicker
        onSelect={(r) => {
          setRole(r);
          setQuestionIndex(0);
          setStep("questions");
        }}
      />
    );
  }

  // Questions (one at a time)
  if (step === "questions" && currentQuestion) {
    const progress = ((questionIndex + 1) / (questions.length + 1)) * 100;

    return (
      <div>
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] tracking-wide" style={{ color: "var(--text-muted)" }}>
              Question {questionIndex + 1} of {questions.length}
            </span>
            <span className="text-[11px] tabular-nums" style={{ color: "var(--text-muted)" }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--border-medium)" }}>
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, var(--accent-gold), var(--accent-gold-hover))",
              }}
            />
          </div>
        </div>

        <QuestionField
          question={currentQuestion}
          value={answers[currentQuestion.id]}
          onChange={(val) => updateAnswer(currentQuestion.id, val)}
        />

        <div className="flex justify-between mt-8">
          <button
            onClick={prevQuestion}
            className="px-4 py-2 rounded-lg text-sm transition-colors"
            style={{ color: "var(--text-secondary)", border: "1px solid var(--border-medium)" }}
          >
            Back
          </button>
          <button
            onClick={nextQuestion}
            disabled={currentQuestion.required && !canProceed()}
            className="px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: "var(--accent-gold)", color: "var(--bg-primary)" }}
          >
            {isLastQuestion ? "Pick your top features" : "Next"}
          </button>
        </div>
      </div>
    );
  }

  // Feature picker
  if (step === "features") {
    return (
      <div>
        <FeaturePicker
          features={FEATURES}
          selected={selectedFeatures}
          onChange={setSelectedFeatures}
          max={5}
        />

        <div className="flex justify-between mt-8">
          <button
            onClick={() => {
              setStep("questions");
              setQuestionIndex(questions.length - 1);
            }}
            className="px-4 py-2 rounded-lg text-sm transition-colors"
            style={{ color: "var(--text-secondary)", border: "1px solid var(--border-medium)" }}
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || selectedFeatures.length === 0}
            className="px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: "var(--accent-gold)", color: "var(--bg-primary)" }}
          >
            {submitting ? "Submitting..." : "Submit Survey"}
          </button>
        </div>
      </div>
    );
  }

  // Thank you
  if (step === "thanks") {
    return (
      <div className="text-center py-16">
        <div
          className="w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ background: "rgba(201, 169, 110, 0.15)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2
          className="text-2xl font-light mb-3 tracking-wide"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}
        >
          Thank you
        </h2>
        <p
          className="text-[15px] max-w-sm mx-auto leading-relaxed mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          Your answers will directly shape what gets built. If you left your email,
          I'll keep you posted on progress.
        </p>
        <p
          className="text-[13px]"
          style={{ color: "var(--text-muted)" }}
        >
          — Peter Walters
        </p>
      </div>
    );
  }

  return null;
}
