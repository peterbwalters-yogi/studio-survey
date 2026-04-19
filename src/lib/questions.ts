export type Role = "owner" | "teacher" | "student";

export interface Question {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "multiselect" | "number" | "scale";
  options?: string[];
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  scaleLabels?: { low: string; high: string };
  min?: number;
  max?: number;
}

export const FEATURES = [
  "Community chat / discussion groups",
  "Direct messaging with teachers",
  "Voice notes to community",
  "Pinned announcements from studio",
  "FAQ / studio info chatbot",
  "Upcoming events feed",
  "Teacher bios and profiles",
  "Teacher retreat listings",
  "Private session booking",
  "Member directory (see who practices with you)",
  "Practice style / interest matching",
  "Workshop and event discovery",
  "Off-the-mat social (meetups, book clubs)",
  "Class recommendations based on your practice",
];

export const SHARED_QUESTIONS: Question[] = [
  {
    id: "name",
    label: "Your name",
    type: "text",
    placeholder: "First name is fine",
    required: true,
  },
  {
    id: "email",
    label: "Email",
    type: "text",
    placeholder: "So we can follow up if you're open to it",
    required: true,
  },
  {
    id: "studio_name",
    label: "Studio(s) you're connected to",
    type: "text",
    placeholder: "Name and city",
    required: true,
  },
];

export const OWNER_QUESTIONS: Question[] = [
  {
    id: "member_count",
    label: "Roughly how many active members does your studio have?",
    type: "select",
    options: ["Under 50", "50-100", "100-200", "200-500", "500+"],
    required: true,
  },
  {
    id: "current_tools",
    label: "What tools do you currently use to communicate with your community?",
    type: "multiselect",
    options: [
      "Email / newsletter",
      "Instagram DMs",
      "Facebook Group",
      "WhatsApp / Telegram",
      "Text / SMS",
      "In-person only",
      "App from booking software (Mindbody, Momence, etc.)",
      "Other",
    ],
  },
  {
    id: "biggest_pain",
    label: "What's your biggest frustration with how you connect with students outside of class?",
    type: "textarea",
    placeholder: "Be honest — we want the real answer, not the polite one",
  },
  {
    id: "retention_challenge",
    label: "What's your biggest student retention challenge?",
    type: "textarea",
    placeholder: "Why do students leave? What makes them stay?",
  },
  {
    id: "monthly_software_spend",
    label: "What do you spend per month on software tools (booking, email, website, etc.)?",
    type: "select",
    options: ["Under $100", "$100-250", "$250-500", "$500-1000", "$1000+", "No idea"],
  },
  {
    id: "community_app_interest",
    label: "How interested would you be in a dedicated community app for your studio?",
    type: "scale",
    scaleLabels: { low: "Not interested", high: "Very interested" },
    min: 1,
    max: 5,
  },
  {
    id: "willingness_to_pay",
    label: "What would you pay monthly for a branded community app your students actually use?",
    type: "select",
    options: [
      "Nothing — it would need to be free",
      "$50-100/month",
      "$100-200/month",
      "$200-350/month",
      "$350-500/month",
      "More than $500/month if it's worth it",
    ],
  },
  {
    id: "biggest_fear",
    label: "What's your biggest concern about adding another tool?",
    type: "textarea",
    placeholder: "Too many apps already? Students won't use it? Cost?",
  },
  {
    id: "booking_software",
    label: "What booking software do you use?",
    type: "select",
    options: ["Mindbody", "Momence", "Wellness Living", "Mariana Tek", "Vagaro", "None", "Other"],
  },
  {
    id: "would_refer",
    label: "Do you know other studio owners who might want this?",
    type: "textarea",
    placeholder: "Name and studio, if you're comfortable sharing",
  },
];

export const TEACHER_QUESTIONS: Question[] = [
  {
    id: "studios_count",
    label: "How many studios do you currently teach at?",
    type: "select",
    options: ["1", "2-3", "4-5", "6+", "I teach independently (no studio)"],
    required: true,
  },
  {
    id: "communication_methods",
    label: "How do you communicate with students outside of class?",
    type: "multiselect",
    options: [
      "Instagram",
      "Email",
      "WhatsApp / Telegram",
      "Text / SMS",
      "Facebook",
      "I don't really",
      "Other",
    ],
  },
  {
    id: "communication_pain",
    label: "What's frustrating about how you stay connected with students?",
    type: "textarea",
    placeholder: "Scattered across platforms? Hard to reach people? Nothing works?",
  },
  {
    id: "would_use_community",
    label: "If your studio had a community app, would you use it to share content, tips, or connect with students?",
    type: "scale",
    scaleLabels: { low: "Probably not", high: "Definitely" },
    min: 1,
    max: 5,
  },
  {
    id: "offer_privates",
    label: "Do you offer private sessions?",
    type: "select",
    options: ["Yes, regularly", "Sometimes", "No, but I'd like to", "No"],
  },
  {
    id: "privates_booking",
    label: "If yes, how do students book privates with you?",
    type: "textarea",
    placeholder: "DM? Email? Through the studio? Word of mouth?",
  },
  {
    id: "lead_retreats",
    label: "Do you lead retreats or workshops?",
    type: "select",
    options: ["Yes, regularly", "Occasionally", "Not yet but planning to", "No"],
  },
  {
    id: "what_would_help",
    label: "What would make your teaching life easier that no tool currently solves?",
    type: "textarea",
    placeholder: "Dream answer here",
  },
];

export const STUDENT_QUESTIONS: Question[] = [
  {
    id: "studios_attend",
    label: "How many studios or yoga spaces do you go to?",
    type: "select",
    options: ["1 — I'm loyal", "2-3", "4+", "I practice at home / online only"],
    required: true,
  },
  {
    id: "practice_frequency",
    label: "How often do you practice?",
    type: "select",
    options: ["Daily", "3-5x/week", "1-2x/week", "A few times a month", "Just getting started"],
  },
  {
    id: "community_connection",
    label: "How connected do you feel to your studio community right now?",
    type: "scale",
    scaleLabels: { low: "Not at all", high: "Very connected" },
    min: 1,
    max: 5,
  },
  {
    id: "how_stay_connected",
    label: "How do you currently stay connected with your studio and fellow students?",
    type: "multiselect",
    options: [
      "Instagram",
      "In person at the studio",
      "WhatsApp / Telegram group",
      "Facebook Group",
      "Email newsletter",
      "I don't really",
      "Other",
    ],
  },
  {
    id: "want_more_connection",
    label: "Do you wish you had a better way to connect with people at your studio?",
    type: "scale",
    scaleLabels: { low: "I'm good", high: "Yes, definitely" },
    min: 1,
    max: 5,
  },
  {
    id: "would_use_app",
    label: "If your studio had a free community app, how likely would you be to use it?",
    type: "scale",
    scaleLabels: { low: "Wouldn't bother", high: "I'd be on it" },
    min: 1,
    max: 5,
  },
  {
    id: "open_frequency",
    label: "Realistically, how often would you check a studio community app?",
    type: "select",
    options: ["Daily", "A few times a week", "Once a week", "Only when I get a notification", "Probably never"],
  },
  {
    id: "what_would_open_for",
    label: "What would actually make you open the app? Be honest.",
    type: "textarea",
    placeholder: "A message from your teacher? Event updates? Seeing who's in class today?",
  },
  {
    id: "multi_studio_interest",
    label: "If you could manage all your yoga communities in one app (scan a QR at any studio to join), would that be useful?",
    type: "scale",
    scaleLabels: { low: "Not really", high: "That would be great" },
    min: 1,
    max: 5,
  },
];

export function getQuestionsForRole(role: Role): Question[] {
  switch (role) {
    case "owner":
      return [...SHARED_QUESTIONS, ...OWNER_QUESTIONS];
    case "teacher":
      return [...SHARED_QUESTIONS, ...TEACHER_QUESTIONS];
    case "student":
      return [...SHARED_QUESTIONS, ...STUDENT_QUESTIONS];
  }
}
