export type AppCategory =
  | "productivity"
  | "health"
  | "education"
  | "lifestyle"
  | "finance"
  | "creator";

export type PaidPlan = "free" | "full" | "pro";

export type AppLaunchDraft = {
  idea: string;
  category: AppCategory;
  audience: string;
  differentiator: string;
};

export type ScreenshotItem = {
  title: string;
  caption: string;
};

export type ChecklistItem = {
  area: string;
  status: "review" | "likely-needed" | "good";
  note: string;
};

export type LaunchKit = {
  appNames: string[];
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  featureBullets: string[];
  keywords: string[];
  screenshots: ScreenshotItem[];
  reviewChecklist: ChecklistItem[];
  privacyNotes: string[];
  permissionCopy: string[];
  launchCopy: {
    hero: string;
    productHunt: string;
    tweet: string;
    thread: string[];
  };
};

const categoryLabels: Record<AppCategory, string> = {
  productivity: "Productivity",
  health: "Health & wellness",
  education: "Education",
  lifestyle: "Lifestyle",
  finance: "Personal finance",
  creator: "Creator tools",
};

const categoryPositioning: Record<AppCategory, string> = {
  productivity: "turn busy routines into simple repeatable actions",
  health: "build healthier habits without making the app feel clinical",
  education: "make learning feel clearer, lighter, and easier to repeat",
  lifestyle: "help users stay consistent with the parts of life they care about",
  finance: "make financial awareness feel approachable rather than intimidating",
  creator: "help creators move from idea to publishable work with less friction",
};

const categoryKeywords: Record<AppCategory, string[]> = {
  productivity: ["routine", "focus", "tracker", "planner", "habit", "goals"],
  health: ["wellness", "routine", "mindful", "streaks", "progress", "daily"],
  education: ["study", "learn", "practice", "progress", "student", "revision"],
  lifestyle: ["daily", "simple", "progress", "organize", "tracker", "goals"],
  finance: ["budget", "spending", "goals", "overview", "savings", "insights"],
  creator: ["content", "workflow", "publish", "ideas", "assets", "creator"],
};

function normalizeIdea(idea: string) {
  return idea.trim().replace(/\s+/g, " ");
}

function firstWords(idea: string, count = 2) {
  return normalizeIdea(idea)
    .split(" ")
    .filter(Boolean)
    .slice(0, count)
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, ""));
}

function titleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function buildNameSuggestions(draft: AppLaunchDraft) {
  const words = firstWords(draft.idea, 2);
  const seed = words.length > 0 ? words.join(" ") : "Launch";
  const topic = titleCase(seed);

  return [
    `${topic}Kit`,
    `${topic}Flow`,
    `${topic}Launch`,
  ];
}

function buildFeatureBullets(draft: AppLaunchDraft) {
  return [
    `Built for ${draft.audience.toLowerCase()} who want a cleaner way to ${categoryPositioning[draft.category]}.`,
    `Highlights the product advantage: ${draft.differentiator}.`,
    `Turns the core idea "${normalizeIdea(draft.idea)}" into a simple message users understand fast.`,
    `Keeps onboarding and daily use lightweight instead of overwhelming.`,
  ];
}

function buildScreenshots(draft: AppLaunchDraft, appName: string) {
  const positioning = categoryPositioning[draft.category];

  return [
    {
      title: `Meet ${appName}`,
      caption: `Turn your idea into a product users immediately understand.`,
    },
    {
      title: "Built for real daily use",
      caption: `Designed for ${draft.audience.toLowerCase()} who want to ${positioning}.`,
    },
    {
      title: "Keep momentum visible",
      caption: "Show progress clearly so users always know what to do next.",
    },
    {
      title: "Stay focused, not overwhelmed",
      caption: "Reduce clutter and keep the main action obvious on every screen.",
    },
    {
      title: "Create a habit loop that sticks",
      caption: "Make repeat use feel rewarding with lightweight feedback and routine-building cues.",
    },
    {
      title: "Differentiate from generic alternatives",
      caption: draft.differentiator,
    },
  ];
}

function buildChecklist(draft: AppLaunchDraft): ChecklistItem[] {
  const idea = draft.idea.toLowerCase();
  const needsLogin =
    idea.includes("account") || idea.includes("community") || idea.includes("sync");
  const usesNotifications =
    idea.includes("reminder") || idea.includes("notification") || idea.includes("streak");
  const riskyClaims =
    idea.includes("medical") || idea.includes("health") || idea.includes("invest");

  return [
    {
      area: "Account and access",
      status: needsLogin ? "review" : "good",
      note: needsLogin
        ? "If login is required, prepare clear sign-in messaging and consider demo access for App Review."
        : "No forced account flow is implied by the current pitch.",
    },
    {
      area: "Privacy policy",
      status: "likely-needed",
      note: "Prepare a privacy policy before submission, even for a lightweight starter app.",
    },
    {
      area: "Notifications",
      status: usesNotifications ? "review" : "good",
      note: usesNotifications
        ? "Explain why reminders matter and provide permission copy before prompting."
        : "No notification dependency is obvious from the current concept.",
    },
    {
      area: "Claims and regulated language",
      status: riskyClaims ? "review" : "good",
      note: riskyClaims
        ? "Avoid unsupported medical, wellness, or financial claims in the listing and screenshots."
        : "The current messaging does not obviously trigger regulated claim concerns.",
    },
    {
      area: "Minimum app value",
      status: "review",
      note: "Make sure the first build does more than mirror a landing page. The app needs clear repeat-use value.",
    },
  ];
}

function buildPrivacyNotes(draft: AppLaunchDraft) {
  return [
    `List only the data this ${categoryLabels[draft.category].toLowerCase()} app actually needs to function.`,
    "Describe analytics, account data, or reminder preferences in plain language if they are collected.",
    "Prepare an in-app explanation before requesting any device permission.",
    "Align App Store privacy labels with the actual shipped behavior, not aspirational features.",
  ];
}

function buildPermissionCopy(draft: AppLaunchDraft) {
  return [
    `Notifications: "${buildNameSuggestions(draft)[0]} uses reminders to help ${draft.audience.toLowerCase()} stay consistent without missing important actions."`,
    `Tracking data: "Usage analytics help us improve the experience and prioritize the features people actually use."`,
  ];
}

function buildKeywords(draft: AppLaunchDraft) {
  return Array.from(
    new Set([
      ...categoryKeywords[draft.category],
      ...firstWords(draft.idea, 3).map((word) => word.toLowerCase()),
    ]),
  ).slice(0, 10);
}

export function generateLaunchKit(draft: AppLaunchDraft): LaunchKit {
  const [primaryName, secondaryName, tertiaryName] = buildNameSuggestions(draft);
  const featureBullets = buildFeatureBullets(draft);
  const screenshots = buildScreenshots(draft, primaryName);
  const keywords = buildKeywords(draft);

  return {
    appNames: [primaryName, secondaryName, tertiaryName],
    subtitle: `${categoryLabels[draft.category]} app for ${draft.audience.toLowerCase()}`,
    shortDescription: `Turn ${normalizeIdea(draft.idea).toLowerCase()} into a product people understand in seconds.`,
    fullDescription: [
      `${primaryName} is built for ${draft.audience.toLowerCase()} who want to ${categoryPositioning[draft.category]}.`,
      `The core concept is simple: ${normalizeIdea(draft.idea)}.`,
      `Instead of bloating the product with generic features, the experience stays focused on ${draft.differentiator.toLowerCase()}.`,
      "That gives the App Store listing a clean promise, makes screenshot messaging easier, and helps the first release feel believable.",
    ].join(" "),
    featureBullets,
    keywords,
    screenshots,
    reviewChecklist: buildChecklist(draft),
    privacyNotes: buildPrivacyNotes(draft),
    permissionCopy: buildPermissionCopy(draft),
    launchCopy: {
      hero: `${primaryName} helps ${draft.audience.toLowerCase()} ${categoryPositioning[draft.category]}.`,
      productHunt: `${primaryName}: turn an app idea into an App Store-ready story.`,
      tweet: `Working on ${primaryName}, a ${categoryLabels[draft.category].toLowerCase()} app for ${draft.audience.toLowerCase()}. ${draft.differentiator} is the wedge.`,
      thread: [
        `1/ We took the idea "${normalizeIdea(draft.idea)}" and turned it into a clearer App Store story.`,
        `2/ The positioning is for ${draft.audience.toLowerCase()}, not for everyone.`,
        `3/ The key differentiator is ${draft.differentiator.toLowerCase()}.`,
        "4/ The goal is a launch kit that makes the first release easier to ship and easier to explain.",
      ],
    },
  };
}

export function planIncludes(plan: PaidPlan, section: "full" | "pro") {
  if (section === "full") {
    return plan === "full" || plan === "pro";
  }

  return plan === "pro";
}

export function buildMarkdownExport(draft: AppLaunchDraft, kit: LaunchKit, plan: PaidPlan) {
  const lines = [
    "# Orivo Export",
    "",
    `- Plan: ${plan.toUpperCase()}`,
    `- Category: ${categoryLabels[draft.category]}`,
    `- Audience: ${draft.audience}`,
    `- Idea: ${normalizeIdea(draft.idea)}`,
    `- Differentiator: ${draft.differentiator}`,
    "",
    "## App Store Listing",
    "",
    `### Name suggestions`,
    ...kit.appNames.map((name) => `- ${name}`),
    "",
    `### Subtitle`,
    kit.subtitle,
    "",
    `### Short description`,
    kit.shortDescription,
    "",
    `### Full description`,
    kit.fullDescription,
    "",
    "### Feature bullets",
    ...kit.featureBullets.map((item) => `- ${item}`),
    "",
    "### ASO keywords",
    `- ${kit.keywords.join(", ")}`,
    "",
    "## Screenshot Copy",
    ...kit.screenshots.map(
      (shot, index) => `- Screenshot ${index + 1}: ${shot.title} — ${shot.caption}`,
    ),
  ];

  if (planIncludes(plan, "pro")) {
    lines.push(
      "",
      "## App Review Checklist",
      ...kit.reviewChecklist.map(
        (item) => `- ${item.area} [${item.status}]: ${item.note}`,
      ),
      "",
      "## Privacy Notes",
      ...kit.privacyNotes.map((note) => `- ${note}`),
      "",
      "## Permission Copy",
      ...kit.permissionCopy.map((note) => `- ${note}`),
      "",
      "## Launch Copy",
      `- Hero: ${kit.launchCopy.hero}`,
      `- Product Hunt: ${kit.launchCopy.productHunt}`,
      `- Tweet: ${kit.launchCopy.tweet}`,
      ...kit.launchCopy.thread.map((line) => `- ${line}`),
    );
  }

  return lines.join("\n");
}

export const defaultDraft: AppLaunchDraft = {
  idea: "Habit tracker for students with reminders and streaks",
  category: "productivity",
  audience: "Students building consistent routines",
  differentiator: "It makes habit tracking feel calm, visual, and easy to keep up with during busy weeks.",
};
