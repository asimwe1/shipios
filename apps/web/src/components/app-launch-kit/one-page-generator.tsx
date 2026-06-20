"use client";

import { useEffect, useMemo, useState } from "react";

import {
  buildMarkdownExport,
  defaultDraft,
  generateLaunchKit,
  planIncludes,
  type AppCategory,
  type AppLaunchDraft,
  type PaidPlan,
} from "@/lib/app-launch-kit";
import {
  hasDraftInStorage,
  readDraftFromStorage,
  readPlanFromStorage,
  saveDraftToStorage,
  savePlanToStorage,
} from "@/lib/mvp-storage";

const categories: { value: AppCategory; label: string }[] = [
  { value: "productivity", label: "Productivity" },
  { value: "health", label: "Health & wellness" },
  { value: "education", label: "Education" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "finance", label: "Finance" },
  { value: "creator", label: "Creator tools" },
];

const examplePrompts = [
  {
    label: "Habit tracker",
    idea: "Habit tracker for students with reminders and streaks",
    category: "productivity" as AppCategory,
    audience: "Students building consistent routines",
    differentiator:
      "It feels calm and lightweight instead of turning habits into homework.",
  },
  {
    label: "Meal planner",
    idea: "Meal planner that turns saved recipes into weekly grocery lists",
    category: "lifestyle" as AppCategory,
    audience: "Busy households planning dinners for the week",
    differentiator:
      "It removes the back-and-forth between recipe saving, planning, and shopping.",
  },
  {
    label: "Reading tracker",
    idea: "Reading tracker with daily chapter goals and streak recovery",
    category: "education" as AppCategory,
    audience: "Readers trying to rebuild a daily reading habit",
    differentiator:
      "It is built around momentum and recovery instead of guilt-heavy streak pressure.",
  },
];

const plans: {
  key: PaidPlan;
  title: string;
  price: string;
  description: string;
}[] = [
  {
    key: "free",
    title: "Preview",
    price: "$0",
    description: "Core listing preview plus 2 screenshot captions.",
  },
  {
    key: "full",
    title: "Full Kit",
    price: "$9",
    description: "Complete listing, all screenshot copy, and export.",
  },
  {
    key: "pro",
    title: "Pro Kit",
    price: "$19",
    description: "Review notes, privacy guidance, and launch copy included.",
  },
];

export function OnePageGenerator() {
  const [draft, setDraft] = useState<AppLaunchDraft>(defaultDraft);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [activePlan, setActivePlan] = useState<PaidPlan>("free");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isStartingCheckout, setIsStartingCheckout] = useState<PaidPlan | null>(null);

  const kit = useMemo(() => generateLaunchKit(draft), [draft]);
  const markdown = useMemo(() => {
    if (!hasGenerated || activePlan === "free") {
      return "";
    }

    return buildMarkdownExport(draft, kit, activePlan);
  }, [activePlan, draft, hasGenerated, kit]);

  useEffect(() => {
    if (!hasDraftInStorage()) {
      return;
    }

    setDraft(readDraftFromStorage());
    setHasGenerated(true);
    setActivePlan(readPlanFromStorage());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const checkout = params.get("checkout");
    const plan = params.get("plan");

    if (checkout === "cancelled") {
      setCheckoutError("Checkout was cancelled before payment completed.");
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.delete("checkout");
      nextUrl.searchParams.delete("plan");
      window.history.replaceState({}, "", nextUrl.toString());
      return;
    }

    if (checkout === "success" && (plan === "full" || plan === "pro")) {
      setCheckoutError(null);
      setHasGenerated(true);
      setActivePlan(plan);
      savePlanToStorage(plan);

      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.delete("checkout");
      nextUrl.searchParams.delete("plan");
      window.history.replaceState({}, "", nextUrl.toString());
    }
  }, []);

  function updateField<Key extends keyof AppLaunchDraft>(key: Key, value: AppLaunchDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function applyExample(example: AppLaunchDraft) {
    setDraft(example);
    setCheckoutError(null);
  }

  function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasGenerated(true);
    setActivePlan("free");
    saveDraftToStorage(draft);
    savePlanToStorage("free");
  }

  function handleStayFree() {
    setActivePlan("free");
    saveDraftToStorage(draft);
    savePlanToStorage("free");
  }

  async function handlePaidCheckout(plan: PaidPlan) {
    setCheckoutError(null);
    setIsStartingCheckout(plan);
    saveDraftToStorage(draft);

    try {
      const response = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to create checkout session.");
      }

      window.location.href = data.url;
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Unable to start checkout.",
      );
      setIsStartingCheckout(null);
    }
  }

  function downloadMarkdown() {
    if (!markdown) {
      return;
    }

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "orivo-export.md";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-10 pb-12">
      <section className="grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
        <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,249,242,0.9))] p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
          <div className="inline-flex rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-[11px] font-mono uppercase tracking-[0.28em] text-[var(--ink-soft)]">
            App Store launch kit
          </div>

          <h1 className="mt-5 max-w-4xl text-5xl leading-[0.96] font-semibold tracking-[-0.07em] sm:text-6xl">
            Describe your app. Get launch-ready App Store copy.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--ink-soft)]">
            Listing copy, screenshot captions, privacy guidance, and launch messaging from one prompt.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {examplePrompts.map((example) => (
              <button
                key={example.label}
                type="button"
                onClick={() => applyExample(example)}
                className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm text-[var(--ink-soft)] transition hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
              >
                {example.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleGenerate} className="mt-6 grid gap-4">
            <textarea
              required
              value={draft.idea}
              onChange={(event) => updateField("idea", event.target.value)}
              className="min-h-40 w-full rounded-[1.6rem] border border-[var(--border-soft)] bg-white px-5 py-5 text-sm leading-7 outline-none transition focus:border-[var(--foreground)]"
              placeholder="Habit tracker for students with reminders and streaks"
            />

            <div className="grid gap-4 md:grid-cols-[0.85fr_1fr]">
              <select
                value={draft.category}
                onChange={(event) => updateField("category", event.target.value as AppCategory)}
                className="w-full rounded-[1.25rem] border border-[var(--border-soft)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--foreground)]"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <input
                required
                value={draft.audience}
                onChange={(event) => updateField("audience", event.target.value)}
                className="w-full rounded-[1.25rem] border border-[var(--border-soft)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--foreground)]"
                placeholder="Students building consistent routines"
              />
            </div>

            <input
              required
              value={draft.differentiator}
              onChange={(event) => updateField("differentiator", event.target.value)}
              className="w-full rounded-[1.25rem] border border-[var(--border-soft)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--foreground)]"
              placeholder="It feels calm and lightweight instead of turning habits into homework."
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-7 text-[var(--ink-soft)]">
                Free preview includes the core listing and 2 screenshot captions.
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-strong)]"
              >
                Generate preview
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-[2rem] border border-[rgba(16,24,40,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,244,236,0.96))] p-5 text-[var(--foreground)] shadow-[0_36px_100px_rgba(15,23,42,0.12)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[-0.03em]">{kit.appNames[0]}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[var(--ink-soft)]">
                Preview
              </p>
            </div>
            <div className="rounded-full bg-[rgba(194,65,12,0.1)] px-3 py-1 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
              {activePlan}
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--ink-soft)]">Subtitle</p>
            <p className="mt-2 text-lg font-medium">{kit.subtitle}</p>
            <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">{kit.shortDescription}</p>
          </div>

          <div className="mt-4 grid gap-3">
            {kit.screenshots
              .slice(0, planIncludes(activePlan, "full") ? 3 : 2)
              .map((shot, index) => (
                <div key={shot.title} className="rounded-[1.35rem] border border-[var(--border-soft)] bg-white p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--ink-soft)]">
                    Screenshot {index + 1}
                  </p>
                  <p className="mt-2 text-base font-medium">{shot.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{shot.caption}</p>
                </div>
              ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.1rem] border border-[var(--border-soft)] bg-[rgba(194,65,12,0.06)] p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">Listing</p>
              <p className="mt-2 text-sm text-[var(--foreground)]">Names, subtitle, and story.</p>
            </div>
            <div className="rounded-[1.1rem] border border-[var(--border-soft)] bg-[rgba(30,64,175,0.06)] p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">Screenshots</p>
              <p className="mt-2 text-sm text-[var(--foreground)]">Store-ready caption angles.</p>
            </div>
            <div className="rounded-[1.1rem] border border-[var(--border-soft)] bg-[rgba(15,118,110,0.06)] p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">Launch</p>
              <p className="mt-2 text-sm text-[var(--foreground)]">Privacy and review notes.</p>
            </div>
          </div>
        </div>
      </section>

      {checkoutError ? (
        <section className="rounded-[1.6rem] border border-[rgba(194,65,12,0.24)] bg-[rgba(194,65,12,0.08)] p-4">
          <p className="text-sm leading-7 text-[var(--foreground)]">{checkoutError}</p>
        </section>
      ) : null}

      <section id="pricing" className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const isActive = activePlan === plan.key;

          return (
            <div
              key={plan.key}
              className={`rounded-[2rem] border p-6 shadow-[0_24px_60px_rgba(15,23,42,0.05)] ${
                isActive
                  ? "border-[var(--accent)] bg-[rgba(194,65,12,0.08)]"
                  : "border-[var(--border-soft)] bg-[var(--surface-strong)]"
              }`}
            >
              <p
                className={`font-mono text-xs uppercase tracking-[0.28em] ${
                  isActive ? "text-[var(--accent)]" : "text-[var(--ink-soft)]"
                }`}
              >
                {plan.title}
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">{plan.price}</h2>
              <p
                className={`mt-3 text-sm leading-7 ${
                  isActive ? "text-[var(--foreground)]" : "text-[var(--ink-soft)]"
                }`}
              >
                {plan.description}
              </p>

              <button
                type="button"
                onClick={() =>
                  plan.key === "free" ? handleStayFree() : void handlePaidCheckout(plan.key)
                }
                disabled={isStartingCheckout === plan.key}
                className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]"
                    : "bg-[var(--foreground)] text-[#fff7ef] hover:bg-[#121722]"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {plan.key === "free"
                  ? "Keep preview"
                  : isStartingCheckout === plan.key
                    ? "Starting checkout..."
                    : `Choose ${plan.title}`}
              </button>
            </div>
          );
        })}
      </section>

      {activePlan !== "free" ? (
        <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--ink-soft)]">
                Export
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Your launch kit is ready to export.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
                Download the kit as Markdown or print it to PDF for handoff, review, or publishing prep.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={downloadMarkdown}
                className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white"
              >
                Download markdown
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center rounded-full border border-[var(--border-soft)] bg-white px-6 py-3 text-sm font-medium"
              >
                Print to PDF
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
