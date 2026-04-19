"use client";

import { Role } from "@/lib/questions";

interface RolePickerProps {
  onSelect: (role: Role) => void;
}

const ROLES: { value: Role; label: string; description: string; icon: string }[] = [
  {
    value: "owner",
    label: "Studio Owner or Manager",
    description: "You run the show. Schedule, teachers, community, the works.",
    icon: "🏠",
  },
  {
    value: "teacher",
    label: "Yoga Teacher",
    description: "You teach at one or more studios. Possibly lead retreats or workshops.",
    icon: "🧘",
  },
  {
    value: "student",
    label: "Student / Practitioner",
    description: "You go to classes. You're part of a studio community (or want to be).",
    icon: "✨",
  },
];

export default function RolePicker({ onSelect }: RolePickerProps) {
  return (
    <div className="py-8">
      <h2
        className="text-2xl font-light mb-2 tracking-wide"
        style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}
      >
        Which best describes you?
      </h2>
      <p className="text-[14px] mb-8" style={{ color: "var(--text-secondary)" }}>
        This shapes which questions you'll see.
      </p>

      <div className="space-y-3">
        {ROLES.map((role) => (
          <button
            key={role.value}
            onClick={() => onSelect(role.value)}
            className="w-full text-left rounded-xl p-5 transition-all duration-200 group"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-medium)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-gold)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(240, 235, 227, 0.12)";
            }}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl mt-0.5">{role.icon}</span>
              <div>
                <h3
                  className="text-[15px] font-medium mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {role.label}
                </h3>
                <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                  {role.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
