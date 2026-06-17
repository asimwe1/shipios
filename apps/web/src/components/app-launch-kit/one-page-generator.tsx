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
    idea: "Habit tracker for students with reminders and streaks",
    category: "productivity" as AppCategory,
    audience: "Students building consistent routines",
    differentiator:
      "It feels calm and lightweight instead of turning habits into homework.",
  },
  {
    idea: "Meal planner that turns saved recipes into weekly grocery lists",
    category: "lifestyle" as AppCategory,
    audience: "Busy households planning dinners for the week",
    differentiator:
      "It removes the back-and-forth between recipe saving, planning, and shopping.",
  },
  {
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
    description: "Full kit plus review notes, privacy guidance, and launch copy.",
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
    anchor.download = "applaunchkit-export.md";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-10 pb-12">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="space-y-6 pt-4">
          <div className="inline-flex rounded-full border border-[var(--border-soft)] bg-white/80 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.28em] text-[var(--ink-soft)] shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            App Store launch kit
          </div>

          <div className="space-y-4">
            <h1 className="max-w-4xl text-5xl leading-[0.95] font-semibold tracking-[-0.07em] sm:text-6xl lg:text-7xl">
              Turn one app idea into launch-ready App Store copy.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--ink-soft)] sm:text-lg">
              AppLaunchKit generates listing copy, screenshot captions, privacy guidance, and launch messaging from a single prompt.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="#generator"
              className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-medium text-[#fff7ef] transition-colors hover:bg-[#121722]"
            >
              Generate launch kit
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-full border border-[var(--border-soft)] bg-white/80 px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-white"
            >
              View pricing
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white/70 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
              <p className="text-2xl font-semibold tracking-[-0.04em]">Listing</p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">Names, subtitle, short description, full description, and keyword ideas.</p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white/70 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
              <p className="text-2xl font-semibold tracking-[-0.04em]">Screenshots</p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">Polished caption hooks for each screenshot in the App Store story.</p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white/70 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
              <p className="text-2xl font-semibold tracking-[-0.04em]">Launch</p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">Privacy notes, review reminders, and launch copy when you need the full package.</p>
            </div>
          </div>
        </div>

        <div className="relative rounded-[2rem] border border-[rgba(16,24,40,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,250,244,0.92))] p-5 shadow-[0_32px_90px_rgba(15,23,42,0.12)]">
          <div className="absolute inset-x-10 top-0 h-24 rounded-b-[2rem] bg-[radial-gradient(circle,rgba(194,65,12,0.18),transparent_70%)] blur-2xl" />
          <div className="relative rounded-[1.75rem] border border-[var(--border-soft)] bg-[#1b2230] p-5 text-[#f8f2ea]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[-0.03em]">{kit.appNames[0]}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[#b8c2d6]">
                  Preview
                </p>
              </div>
              <div className="rounded-full bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#dfe6f2]">
                {activePlan}
              </div>
            </div>

            <div className="mt-5 rounded-[1.5rem] bg-white/6 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[#b8c2d6]">Subtitle</p>
              <p className="mt-2 text-lg font-medium">{kit.subtitle}</p>
              <p className="mt-3 text-sm leading-7 text-[#dbe2ed]">{kit.shortDescription}</p>
            </div>

            <div className="mt-4 grid gap-3">
              {kit.screenshots
                .slice(0, planIncludes(activePlan, "full") ? 3 : 2)
                .map((shot, index) => (
                  <div key={shot.title} className="rounded-[1.35rem] bg-white/6 p-4">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#b8c2d6]">
                      Screenshot {index + 1}
                    </p>
                    <p className="mt-2 text-base font-medium">{shot.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#dbe2ed]">{shot.caption}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section id="generator" className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <form
          onSubmit={handleGenerate}
          className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)]"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--ink-soft)]">
                Generate
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Describe your app.
              </h2>
            </div>
            <button
              type="submit"
              className="hidden rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-strong)] md:inline-flex"
            >
              Generate preview
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {examplePrompts.map((example) => (
              <button
                key={example.idea}
                type="button"
                onClick={() => applyExample(example)}
                className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm text-[var(--ink-soft)] transition hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
              >
                {example.idea}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium">App idea</label>
              <textarea
                required
                value={draft.idea}
                onChange={(event) => updateField("idea", event.target.value)}
                className="min-h-36 w-full rounded-[1.5rem] border border-[var(--border-soft)] bg-white px-4 py-4 text-sm leading-7 outline-none transition focus:border-[var(--foreground)]"
                placeholder="Habit tracker for students with reminders and streaks"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Category</label>
                <select
                  value={draft.category}
                  onChange={(event) => updateField("category", event.target.value as AppCategory)}
                  className="w-full rounded-[1.2rem] border border-[var(--border-soft)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--foreground)]"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Audience</label>
                <input
                  required
                  value={draft.audience}
                  onChange={(event) => updateField("audience", event.target.value)}
                  className="w-full rounded-[1.2rem] border border-[var(--border-soft)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--foreground)]"
                  placeholder="Students building consistent routines"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">What makes it different?</label>
              <textarea
                required
                value={draft.differentiator}
                onChange={(event) => updateField("differentiator", event.target.value)}
                className="min-h-28 w-full rounded-[1.5rem] border border-[var(--border-soft)] bg-white px-4 py-4 text-sm leading-7 outline-none transition focus:border-[var(--foreground)]"
                placeholder="It feels calm and lightweight instead of turning habits into homework."
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-medium text-[#fff7ef] transition-colors hover:bg-[#121722] md:hidden"
            >
              Generate preview
            </button>
          </div>
        </form>

        <div className="grid gap-4">
          <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--ink-soft)]">
                  Preview
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                  {hasGenerated ? "Your launch direction" : "Live preview"}
                </h2>
              </div>
              <div className="rounded-full border border-[var(--border-soft)] bg-white px-3 py-2 text-xs uppercase tracking-[0.24em] text-[var(--ink-soft)]">
                {activePlan}
              </div>
            </div>

            {checkoutError ? (
              <div className="mt-5 rounded-[1.35rem] border border-[rgba(194,65,12,0.24)] bg-[rgba(194,65,12,0.08)] p-4">
                <p className="text-sm leading-7 text-[var(--foreground)]">{checkoutError}</p>
              </div>
            ) : null}

            <div className="mt-5 space-y-4">
              <div className="rounded-[1.4rem] border border-[var(--border-soft)] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--ink-soft)]">Names</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {kit.appNames.map((name) => (
                    <span
                      key={name}
                      className="rounded-full bg-[#f3ede4] px-3 py-2 text-sm font-medium text-[var(--foreground)]"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-[var(--border-soft)] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--ink-soft)]">Listing</p>
                <p className="mt-3 text-lg font-medium">{kit.subtitle}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">{kit.shortDescription}</p>
              </div>

              <div className="rounded-[1.4rem] border border-[var(--border-soft)] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--ink-soft)]">Screenshot copy</p>
                <div className="mt-3 space-y-3">
                  {kit.screenshots
                    .slice(0, planIncludes(activePlan, "full") ? 3 : 2)
                    .map((shot) => (
                      <div key={shot.title} className="rounded-[1.15rem] bg-[#faf5ef] p-3">
                        <p className="text-sm font-medium">{shot.title}</p>
                        <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">{shot.caption}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--foreground)] p-6 text-[#f7f2ea] shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-[#c0cada]">
              Included in Pro
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[1.25rem] bg-white/8 p-4">
                <p className="text-sm font-medium">Review notes</p>
                <p className="mt-1 text-sm leading-6 text-[#dbe2ed]">Starter guidance for App Review-sensitive areas.</p>
              </div>
              <div className="rounded-[1.25rem] bg-white/8 p-4">
                <p className="text-sm font-medium">Privacy guidance</p>
                <p className="mt-1 text-sm leading-6 text-[#dbe2ed]">Permission wording and privacy-label reminders.</p>
              </div>
              <div className="rounded-[1.25rem] bg-white/8 p-4">
                <p className="text-sm font-medium">Launch copy</p>
                <p className="mt-1 text-sm leading-6 text-[#dbe2ed]">Tweet, Product Hunt angle, and simple launch messaging.</p>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section id="pricing" className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const isActive = activePlan === plan.key;

          return (
            <div
              key={plan.key}
              className={`rounded-[2rem] border p-6 shadow-[0_24px_60px_rgba(15,23,42,0.05)] ${
                isActive
                  ? "border-[var(--foreground)] bg-[var(--foreground)] text-[#fff7ef]"
                  : "border-[var(--border-soft)] bg-[var(--surface-strong)]"
              }`}
            >
              <p
                className={`font-mono text-xs uppercase tracking-[0.28em] ${
                  isActive ? "text-[#c8d0df]" : "text-[var(--ink-soft)]"
                }`}
              >
                {plan.title}
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">{plan.price}</h2>
              <p
                className={`mt-3 text-sm leading-7 ${
                  isActive ? "text-[#e7edf6]" : "text-[var(--ink-soft)]"
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
                    ? "bg-white text-[var(--foreground)] hover:bg-[#f6efe7]"
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
                className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-medium text-[#fff7ef]"
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
