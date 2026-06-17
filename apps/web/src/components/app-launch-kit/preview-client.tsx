"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  generateLaunchKit,
  planIncludes,
  type AppLaunchDraft,
  type LaunchKit,
  type PaidPlan,
} from "@/lib/app-launch-kit";
import { readDraftFromStorage, readPlanFromStorage } from "@/lib/mvp-storage";

function LockedCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-[var(--border-soft)] bg-[rgba(23,32,51,0.03)] p-5">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--ink-soft)]">
        Locked
      </p>
      <h3 className="mt-3 text-lg font-semibold tracking-[-0.03em]">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">{description}</p>
    </div>
  );
}

export function PreviewClient() {
  const [draft, setDraft] = useState<AppLaunchDraft | null>(null);
  const [kit, setKit] = useState<LaunchKit | null>(null);
  const [plan, setPlan] = useState<PaidPlan>("free");

  useEffect(() => {
    const nextDraft = readDraftFromStorage();
    setDraft(nextDraft);
    setKit(generateLaunchKit(nextDraft));
    setPlan(readPlanFromStorage());
  }, []);

  if (!draft || !kit) {
    return (
      <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6">
        <p className="text-sm text-[var(--ink-soft)]">Loading your launch kit preview...</p>
      </section>
    );
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6 shadow-[0_20px_50px_rgba(23,32,51,0.05)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--ink-soft)]">
              Free preview
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Launch kit preview for your app idea
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--ink-soft)]">
              This is the active MVP flow inside the ShipiOS repo: AppLaunchKit first, deeper app-building later.
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--border-soft)] bg-white/90 px-4 py-3 text-sm">
            <span className="font-mono uppercase tracking-[0.25em] text-[var(--ink-soft)]">
              plan
            </span>
            <p className="mt-1 font-medium capitalize">{plan}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--ink-soft)]">
            App Store listing
          </p>
          <div className="mt-5 grid gap-5">
            <div className="rounded-3xl border border-[var(--border-soft)] bg-white/80 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)]">Name ideas</p>
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
              <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">{kit.shortDescription}</p>
            </div>
            <div className="rounded-3xl border border-[var(--border-soft)] bg-white/80 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)]">Full description</p>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">{kit.fullDescription}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--foreground)] p-6 text-[#f7f3ec]">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#b7c1d3]">
              Screenshot copy
            </p>
            <div className="mt-5 space-y-4">
              {kit.screenshots.slice(0, 2).map((shot, index) => (
                <div key={shot.title} className="rounded-3xl bg-white/8 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#cbd5e1]">
                    Screenshot {index + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{shot.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#dde4ef]">{shot.caption}</p>
                </div>
              ))}
            </div>
          </section>

          {planIncludes(plan, "full") ? (
            <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6">
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--ink-soft)]">
                Unlocked now
              </p>
              <div className="mt-5 space-y-4">
                {kit.screenshots.slice(2).map((shot, index) => (
                  <div key={shot.title} className="rounded-3xl border border-[var(--border-soft)] bg-white/80 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)]">
                      Screenshot {index + 3}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold">{shot.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">{shot.caption}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <LockedCard
              title="Unlock the full screenshot pack"
              description="The full kit adds the remaining App Store screenshot captions and the export step."
            />
          )}

          {planIncludes(plan, "pro") ? (
            <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6">
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--ink-soft)]">
                Pro sections
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--foreground)]">
                <li>Review checklist with risk callouts</li>
                <li>Privacy notes and permission copy</li>
                <li>Launch tweet, thread, and Product Hunt angle</li>
              </ul>
            </section>
          ) : (
            <LockedCard
              title="Unlock checklist, privacy notes, and launch copy"
              description="The Pro kit adds launch messaging and App Review-oriented guidance, which is the strongest paid upgrade."
            />
          )}
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/generate"
          className="inline-flex items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-strong)] px-6 py-3 text-sm font-medium"
        >
          Edit idea
        </Link>
        <Link
          href="/checkout"
          className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white"
        >
          Unlock full kit
        </Link>
      </div>
    </div>
  );
}

