"use client";

import { Question } from "@/lib/questions";

interface QuestionFieldProps {
  question: Question;
  value: string | string[] | number | undefined;
  onChange: (value: string | string[] | number) => void;
}

export default function QuestionField({ question, value, onChange }: QuestionFieldProps) {
  return (
    <div>
      <label
        className="block text-lg font-light mb-2 tracking-wide"
        style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}
      >
        {question.label}
        {question.required && (
          <span className="ml-1" style={{ color: "var(--accent-gold)" }}>*</span>
        )}
      </label>

      {question.helperText && (
        <p className="text-[13px] mb-3" style={{ color: "var(--text-muted)" }}>
          {question.helperText}
        </p>
      )}

      {question.type === "text" && (
        <input
          type="text"
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          className="w-full rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-1"
          style={{
            background: "var(--bg-elevated)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-medium)",
          }}
        />
      )}

      {question.type === "textarea" && (
        <textarea
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          rows={4}
          className="w-full rounded-xl px-4 py-3 text-[15px] resize-none focus:outline-none focus:ring-1"
          style={{
            background: "var(--bg-elevated)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-medium)",
          }}
        />
      )}

      {question.type === "number" && (
        <input
          type="number"
          value={(value as number) || ""}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          placeholder={question.placeholder}
          className="w-full rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-1"
          style={{
            background: "var(--bg-elevated)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-medium)",
          }}
        />
      )}

      {question.type === "select" && question.options && (
        <div className="space-y-2">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className="w-full text-left rounded-xl px-4 py-3 text-[15px] transition-all duration-200"
              style={{
                background: value === option ? "rgba(201, 169, 110, 0.15)" : "var(--bg-elevated)",
                color: value === option ? "var(--accent-gold)" : "var(--text-primary)",
                border: value === option ? "1px solid var(--accent-gold)" : "1px solid var(--border-medium)",
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {question.type === "multiselect" && question.options && (
        <div className="space-y-2">
          <p className="text-[12px] mb-2" style={{ color: "var(--text-muted)" }}>
            Select all that apply
          </p>
          {question.options.map((option) => {
            const selected = Array.isArray(value) && value.includes(option);
            return (
              <button
                key={option}
                onClick={() => {
                  const current = Array.isArray(value) ? value : [];
                  if (selected) {
                    onChange(current.filter((v) => v !== option));
                  } else {
                    onChange([...current, option]);
                  }
                }}
                className="w-full text-left rounded-xl px-4 py-3 text-[15px] transition-all duration-200"
                style={{
                  background: selected ? "rgba(201, 169, 110, 0.15)" : "var(--bg-elevated)",
                  color: selected ? "var(--accent-gold)" : "var(--text-primary)",
                  border: selected ? "1px solid var(--accent-gold)" : "1px solid var(--border-medium)",
                }}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded flex items-center justify-center text-[10px] shrink-0"
                    style={{
                      border: selected ? "none" : "1px solid var(--text-muted)",
                      background: selected ? "var(--accent-gold)" : "transparent",
                      color: "var(--bg-primary)",
                    }}
                  >
                    {selected ? "✓" : ""}
                  </span>
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {question.type === "scale" && question.min !== undefined && question.max !== undefined && (
        <div>
          <div className="flex gap-2 mt-2">
            {Array.from({ length: question.max - question.min + 1 }, (_, i) => {
              const num = question.min! + i;
              const selected = value === num;
              return (
                <button
                  key={num}
                  onClick={() => onChange(num)}
                  className="flex-1 py-3 rounded-xl text-[15px] font-medium transition-all duration-200"
                  style={{
                    background: selected ? "rgba(201, 169, 110, 0.15)" : "var(--bg-elevated)",
                    color: selected ? "var(--accent-gold)" : "var(--text-primary)",
                    border: selected ? "1px solid var(--accent-gold)" : "1px solid var(--border-medium)",
                  }}
                >
                  {num}
                </button>
              );
            })}
          </div>
          {question.scaleLabels && (
            <div className="flex justify-between mt-2">
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                {question.scaleLabels.low}
              </span>
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                {question.scaleLabels.high}
              </span>
            </div>
          )}
        </div>
      )}

      {question.placeholder && (question.type === "select" || question.type === "scale") && (
        <p className="text-[12px] mt-3 italic" style={{ color: "var(--text-muted)" }}>
          {question.placeholder}
        </p>
      )}
    </div>
  );
}
