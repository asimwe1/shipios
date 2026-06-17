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
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isStartingCheckout, setIsStartingCheckout] = useState<PaidPlan | null>(null);

  useEffect(() => {
    const nextDraft = readDraftFromStorage();
    setDraft(nextDraft);
    setKit(generateLaunchKit(nextDraft));
    setSelectedPlan(readPlanFromStorage() === "free" ? "pro" : readPlanFromStorage());
  }, []);

  async function handleCheckout() {
    if (selectedPlan === "free") {
      router.push("/preview");
      return;
    }

    setCheckoutError(null);
    setIsStartingCheckout(selectedPlan);

    try {
      const response = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to create checkout.");
      }

      window.location.href = data.url;
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Unable to start checkout.",
      );
      setIsStartingCheckout(null);
    }
  }

  if (!draft || !kit) {
    return <p className="text-sm text-[var(--ink-soft)]">Loading checkout...</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--foreground)] p-6 text-[#f7f3ec]">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#b7c1d3]">
          Checkout
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
          Choose the launch kit that fits your release.
        </h1>
        <p className="mt-4 text-sm leading-7 text-[#dde4ef]">
          AppLaunchKit helps you turn one app idea into polished App Store copy, screenshot messaging, and launch assets you can use immediately.
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
        {checkoutError ? (
          <div className="rounded-[2rem] border border-[rgba(194,65,12,0.24)] bg-[rgba(194,65,12,0.08)] p-5">
            <p className="text-sm leading-7 text-[var(--foreground)]">{checkoutError}</p>
          </div>
        ) : null}

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
            onClick={() => void handleCheckout()}
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-strong)]"
            disabled={isStartingCheckout !== null}
          >
            {selectedPlan === "free"
              ? "Continue with free preview"
              : isStartingCheckout === selectedPlan
                ? "Starting checkout..."
                : "Continue to secure checkout"}
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
