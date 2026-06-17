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

const plans: {
  key: PaidPlan;
  title: string;
  price: string;
  description: string;
}[] = [
  {
    key: "free",
    title: "Free Preview",
    price: "$0",
    description: "Partial listing and 2 screenshot captions.",
  },
  {
    key: "full",
    title: "Full Kit",
    price: "$9",
    description: "Full listing, full screenshot copy, and markdown export.",
  },
  {
    key: "pro",
    title: "Pro Kit",
    price: "$19",
    description: "Full kit plus checklist, privacy notes, and launch posts.",
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

  function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasGenerated(true);
    setActivePlan("free");
    saveDraftToStorage(draft);
    savePlanToStorage("free");
  }

  function handleUnlock(plan: PaidPlan) {
    setActivePlan(plan);
    saveDraftToStorage(draft);
    savePlanToStorage(plan);
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
    <div className="grid gap-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] px-6 py-8 shadow-[0_30px_80px_rgba(23,32,51,0.08)] backdrop-blur sm:px-8 sm:py-10">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[rgba(194,65,12,0.16)] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[rgba(30,64,175,0.12)] blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--ink-soft)]">
              Final MVP
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl leading-tight font-semibold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Paste an app idea. Generate a paid App Store launch kit.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--ink-soft)] sm:text-lg">
              One page. One flow. One paid output. Listing copy, screenshot captions, privacy notes, launch posts, and review prep from a single app idea.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--accent)]">
              Monetization path
            </p>
            <div className="mt-4 grid gap-3">
              {[
                "Free preview proves value with partial output.",
                "Full Kit unlocks the full App Store package for $9.",
                "Pro Kit adds risk checklist, privacy notes, and launch copy for $19.",
                "No subscriptions needed at launch.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-[var(--border-soft)] bg-white/80 px-4 py-4"
                >
                  <p className="text-sm leading-7 text-[var(--foreground)]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form
          onSubmit={handleGenerate}
          className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6 shadow-[0_20px_50px_rgba(23,32,51,0.05)]"
        >
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--ink-soft)]">
            Input
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
            Describe the app.
          </h2>

          <div className="mt-6 grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium">App idea</label>
              <textarea
                required
                value={draft.idea}
                onChange={(event) => updateField("idea", event.target.value)}
                className="min-h-36 w-full rounded-3xl border border-[var(--border-soft)] bg-white px-4 py-4 text-sm leading-7 outline-none transition focus:border-[var(--accent)]"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Category</label>
                <select
                  value={draft.category}
                  onChange={(event) => updateField("category", event.target.value as AppCategory)}
                  className="w-full rounded-2xl border border-[var(--border-soft)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
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
                  className="w-full rounded-2xl border border-[var(--border-soft)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Differentiator</label>
              <textarea
                required
                value={draft.differentiator}
                onChange={(event) => updateField("differentiator", event.target.value)}
                className="min-h-28 w-full rounded-3xl border border-[var(--border-soft)] bg-white px-4 py-4 text-sm leading-7 outline-none transition focus:border-[var(--accent)]"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-strong)]"
            >
              Generate free preview
            </button>
          </div>
        </form>

        <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6 shadow-[0_20px_50px_rgba(23,32,51,0.05)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--ink-soft)]">
                Preview
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                {hasGenerated ? "Your launch kit preview" : "Output appears here"}
              </h2>
            </div>
            <div className="rounded-3xl border border-[var(--border-soft)] bg-white/80 px-4 py-3 text-sm">
              <span className="font-mono uppercase tracking-[0.25em] text-[var(--ink-soft)]">
                plan
              </span>
              <p className="mt-1 font-medium capitalize">{activePlan}</p>
            </div>
          </div>

          {hasGenerated ? (
            <div className="mt-6 grid gap-5">
              {checkoutError ? (
                <div className="rounded-3xl border border-[rgba(194,65,12,0.24)] bg-[rgba(194,65,12,0.08)] p-5">
                  <p className="text-sm leading-7 text-[var(--foreground)]">{checkoutError}</p>
                </div>
              ) : null}

              <div className="rounded-3xl border border-[var(--border-soft)] bg-white/80 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)]">Name suggestions</p>
                <ul className="mt-3 space-y-2 text-sm leading-7">
                  {kit.appNames.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-[var(--border-soft)] bg-white/80 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)]">Subtitle</p>
                <p className="mt-3 text-lg font-medium">{kit.subtitle}</p>
              </div>

              <div className="rounded-3xl border border-[var(--border-soft)] bg-white/80 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)]">Short description</p>
                <p className="mt-3 text-sm leading-7">{kit.shortDescription}</p>
              </div>

              <div className="rounded-3xl bg-[var(--foreground)] p-5 text-[#f7f3ec]">
                <p className="text-xs uppercase tracking-[0.25em] text-[#cbd5e1]">Screenshot copy</p>
                <div className="mt-4 space-y-4">
                  {kit.screenshots
                    .slice(0, planIncludes(activePlan, "full") ? kit.screenshots.length : 2)
                    .map((shot, index) => (
                      <div key={shot.title} className="rounded-3xl bg-white/8 p-4">
                        <h3 className="font-semibold">
                          Screenshot {index + 1}: {shot.title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-[#dde4ef]">{shot.caption}</p>
                      </div>
                    ))}
                </div>
              </div>

              {!planIncludes(activePlan, "full") ? (
                <div className="rounded-3xl border border-dashed border-[var(--border-soft)] bg-[rgba(31,36,48,0.03)] p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--ink-soft)]">
                    Locked
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                    The rest of the screenshot pack and export unlock with Full Kit.
                  </p>
                </div>
              ) : null}

              {planIncludes(activePlan, "pro") ? (
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl border border-[var(--border-soft)] bg-white/80 p-4">
                    <h3 className="font-semibold">Review checklist</h3>
                    <ul className="mt-3 space-y-2 text-sm leading-7">
                      {kit.reviewChecklist.map((item) => (
                        <li key={item.area}>{item.area}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-3xl border border-[var(--border-soft)] bg-white/80 p-4">
                    <h3 className="font-semibold">Privacy notes</h3>
                    <ul className="mt-3 space-y-2 text-sm leading-7">
                      {kit.privacyNotes.slice(0, 3).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-3xl border border-[var(--border-soft)] bg-white/80 p-4">
                    <h3 className="font-semibold">Launch posts</h3>
                    <ul className="mt-3 space-y-2 text-sm leading-7">
                      <li>{kit.launchCopy.hero}</li>
                      <li>{kit.launchCopy.productHunt}</li>
                      <li>{kit.launchCopy.tweet}</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-[var(--border-soft)] bg-[rgba(31,36,48,0.03)] p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--ink-soft)]">
                    Pro unlock
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                    Checklist, privacy guidance, and launch posts unlock with Pro Kit.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
              Generate the preview to see listing copy, screenshot captions, and the paid upgrade sections.
            </p>
          )}
        </section>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const isActive = activePlan === plan.key;

          return (
            <div
              key={plan.key}
              className={`rounded-[2rem] border p-6 ${
                isActive
                  ? "border-[var(--accent)] bg-[var(--surface-strong)] shadow-[0_20px_50px_rgba(23,32,51,0.08)]"
                  : "border-[var(--border-soft)] bg-[var(--surface)]"
              }`}
            >
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--ink-soft)]">
                {plan.title}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{plan.price}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">{plan.description}</p>

              {plan.key === "free" ? (
                <button
                  type="button"
                  onClick={() => handleUnlock("free")}
                  className="mt-5 inline-flex items-center justify-center rounded-full border border-[var(--border-soft)] bg-white px-5 py-3 text-sm font-medium"
                >
                  Stay on free
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void handlePaidCheckout(plan.key)}
                  disabled={isStartingCheckout === plan.key}
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isStartingCheckout === plan.key
                    ? "Starting checkout..."
                    : "Continue to checkout"}
                </button>
              )}
            </div>
          );
        })}
      </section>

      <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6 shadow-[0_20px_50px_rgba(23,32,51,0.05)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--ink-soft)]">
              Export
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
              Paid export lives on the same page.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--ink-soft)]">
              This keeps the MVP brutally simple. The free preview proves value. The paid action unlocks download.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={downloadMarkdown}
              disabled={!markdown}
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Download markdown
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              disabled={activePlan === "free"}
              className="inline-flex items-center justify-center rounded-full border border-[var(--border-soft)] bg-white px-6 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
            >
              Print to PDF
            </button>
          </div>
        </div>

        {activePlan === "free" ? (
          <p className="mt-5 text-sm leading-7 text-[var(--ink-soft)]">
            Unlock Full Kit or Pro to export.
          </p>
        ) : (
          <pre className="mt-5 overflow-x-auto rounded-3xl border border-[var(--border-soft)] bg-white p-4 text-xs leading-6 text-[var(--foreground)]">
            {markdown}
          </pre>
        )}
      </section>
    </div>
  );
}
