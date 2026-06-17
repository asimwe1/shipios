"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  generateLaunchKit,
  type AppLaunchDraft,
  type LaunchKit,
  type PaidPlan,
} from "@/lib/app-launch-kit";
import {
  readDraftFromStorage,
  readPlanFromStorage,
  savePlanToStorage,
} from "@/lib/mvp-storage";

const plans: {
  key: PaidPlan;
  title: string;
  price: string;
  summary: string;
  features: string[];
}[] = [
  {
    key: "free",
    title: "Free Preview",
    price: "$0",
    summary: "Partial listing plus 2 screenshot captions.",
    features: ["App name ideas", "Subtitle and descriptions", "2 screenshot captions"],
  },
  {
    key: "full",
    title: "Full Kit",
    price: "$9",
    summary: "Complete listing, full screenshot copy, and export.",
    features: ["Everything in free", "All screenshot captions", "Markdown export"],
  },
  {
    key: "pro",
    title: "Pro Kit",
    price: "$19",
    summary: "Full kit plus privacy notes, launch copy, and review checklist.",
    features: [
      "Everything in full",
      "Review checklist",
      "Privacy notes",
      "Launch tweet, thread, and hero copy",
    ],
  },
];

export function CheckoutClient() {
  const router = useRouter();
  const [draft, setDraft] = useState<AppLaunchDraft | null>(null);
  const [kit, setKit] = useState<LaunchKit | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PaidPlan>("pro");

  useEffect(() => {
    const nextDraft = readDraftFromStorage();
    setDraft(nextDraft);
    setKit(generateLaunchKit(nextDraft));
    setSelectedPlan(readPlanFromStorage() === "free" ? "pro" : readPlanFromStorage());
  }, []);

  function handleUnlock() {
    savePlanToStorage(selectedPlan);
    router.push("/export");
  }

  if (!draft || !kit) {
    return <p className="text-sm text-[var(--ink-soft)]">Loading checkout...</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--foreground)] p-6 text-[#f7f3ec]">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#b7c1d3]">
          Why this MVP sells
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
          You are buying launch clarity, not code generation.
        </h1>
        <p className="mt-4 text-sm leading-7 text-[#dde4ef]">
          This MVP is intentionally narrow. It turns one app idea into App Store listing copy,
          screenshot messaging, and launch assets that are immediately useful.
        </p>

        <div className="mt-6 rounded-3xl bg-white/8 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-[#b7c1d3]">Current idea</p>
          <p className="mt-3 text-sm leading-7 text-[#f7f3ec]">{draft.idea}</p>
          <p className="mt-3 text-sm leading-7 text-[#dde4ef]">
            Audience: {draft.audience}
          </p>
          <p className="mt-1 text-sm leading-7 text-[#dde4ef]">
            Differentiator: {draft.differentiator}
          </p>
        </div>
      </section>

      <section className="grid gap-4">
        {plans.map((plan) => {
          const isActive = selectedPlan === plan.key;

          return (
            <button
              key={plan.key}
              type="button"
              onClick={() => setSelectedPlan(plan.key)}
              className={`rounded-[2rem] border p-6 text-left transition ${
                isActive
                  ? "border-[var(--accent)] bg-[var(--surface-strong)] shadow-[0_20px_50px_rgba(23,32,51,0.08)]"
                  : "border-[var(--border-soft)] bg-[var(--surface)]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--ink-soft)]">
                    {plan.title}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                    {plan.price}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">{plan.summary}</p>
                </div>
                <div
                  className={`mt-1 h-5 w-5 rounded-full border ${
                    isActive ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--border-soft)]"
                  }`}
                />
              </div>

              <ul className="mt-5 space-y-2 text-sm leading-7 text-[var(--foreground)]">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            </button>
          );
        })}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleUnlock}
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-strong)]"
          >
            Simulate unlock and continue
          </button>
          <button
            type="button"
            onClick={() => router.push("/preview")}
            className="inline-flex items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-strong)] px-6 py-3 text-sm font-medium"
          >
            Back to preview
          </button>
        </div>
      </section>
    </div>
  );
}

