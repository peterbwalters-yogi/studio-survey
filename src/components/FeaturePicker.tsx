"use client";

interface FeaturePickerProps {
  features: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  max: number;
}

export default function FeaturePicker({ features, selected, onChange, max }: FeaturePickerProps) {
  function toggle(feature: string) {
    if (selected.includes(feature)) {
      onChange(selected.filter((f) => f !== feature));
    } else if (selected.length < max) {
      onChange([...selected, feature]);
    }
  }

  return (
    <div>
      <h2
        className="text-xl font-light mb-2 tracking-wide"
        style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}
      >
        Which features matter most to you?
      </h2>
      <p className="text-[14px] mb-6" style={{ color: "var(--text-secondary)" }}>
        Pick your top {max}. This helps us prioritize what to build first.
      </p>

      <div className="space-y-2">
        {features.map((feature) => {
          const isSelected = selected.includes(feature);
          const isDisabled = !isSelected && selected.length >= max;

          return (
            <button
              key={feature}
              onClick={() => toggle(feature)}
              disabled={isDisabled}
              className="w-full text-left rounded-xl px-4 py-3 text-[15px] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: isSelected ? "rgba(201, 169, 110, 0.15)" : "var(--bg-elevated)",
                color: isSelected ? "var(--accent-gold)" : "var(--text-primary)",
                border: isSelected ? "1px solid var(--accent-gold)" : "1px solid var(--border-medium)",
              }}
            >
              <span className="flex items-center gap-3">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] shrink-0 font-medium"
                  style={{
                    background: isSelected ? "var(--accent-gold)" : "transparent",
                    border: isSelected ? "none" : "1px solid var(--text-muted)",
                    color: "var(--bg-primary)",
                  }}
                >
                  {isSelected ? selected.indexOf(feature) + 1 : ""}
                </span>
                {feature}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-[12px] mt-4 text-center" style={{ color: "var(--text-muted)" }}>
        {selected.length} of {max} selected
      </p>
    </div>
  );
}
