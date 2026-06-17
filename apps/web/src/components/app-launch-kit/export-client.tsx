"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  buildMarkdownExport,
  generateLaunchKit,
  planIncludes,
  type AppLaunchDraft,
  type PaidPlan,
} from "@/lib/app-launch-kit";
import { readDraftFromStorage, readPlanFromStorage } from "@/lib/mvp-storage";

export function ExportClient() {
  const [draft, setDraft] = useState<AppLaunchDraft | null>(null);
  const [plan, setPlan] = useState<PaidPlan>("free");

  useEffect(() => {
    setDraft(readDraftFromStorage());
    setPlan(readPlanFromStorage());
  }, []);

  const kit = useMemo(() => (draft ? generateLaunchKit(draft) : null), [draft]);
  const markdown = useMemo(() => {
    if (!draft || !kit || plan === "free") {
      return "";
    }

    return buildMarkdownExport(draft, kit, plan);
  }, [draft, kit, plan]);

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

  if (!draft || !kit) {
    return <p className="text-sm text-[var(--ink-soft)]">Loading export...</p>;
  }

  if (plan === "free") {
    return (
      <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--ink-soft)]">
          Export locked
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
          Unlock Full Kit or Pro to export.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
          Export is available with Full Kit or Pro Kit.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white"
          >
            Go to checkout
          </Link>
          <Link
            href="/preview"
            className="inline-flex items-center justify-center rounded-full border border-[var(--border-soft)] bg-white px-6 py-3 text-sm font-medium"
          >
            Back to preview
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6 shadow-[0_20px_50px_rgba(23,32,51,0.05)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--ink-soft)]">
              Export ready
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Your AppLaunchKit is unlocked.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--ink-soft)]">
              Download your kit as Markdown or print it to PDF for review, sharing, or publishing handoff.
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

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr] print:grid-cols-1">
        <article className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--ink-soft)]">
            Listing pack
          </p>
          <div className="mt-5 space-y-4 text-sm leading-7">
            <div>
              <h2 className="text-lg font-semibold">Name suggestions</h2>
              <ul className="mt-2">
                {kit.appNames.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Subtitle</h2>
              <p className="mt-2">{kit.subtitle}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Full description</h2>
              <p className="mt-2">{kit.fullDescription}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">ASO keywords</h2>
              <p className="mt-2">{kit.keywords.join(", ")}</p>
            </div>
          </div>
        </article>

        <article className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--foreground)] p-6 text-[#f7f3ec]">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#b7c1d3]">
            Screenshot captions
          </p>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[#dde4ef]">
            {kit.screenshots.map((shot, index) => (
              <div key={shot.title} className="rounded-3xl bg-white/8 p-4">
                <h2 className="font-semibold">
                  Screenshot {index + 1}: {shot.title}
                </h2>
                <p className="mt-2">{shot.caption}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      {planIncludes(plan, "pro") ? (
        <section className="grid gap-6 lg:grid-cols-3 print:grid-cols-1">
          <article className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6">
            <h2 className="text-lg font-semibold">Review checklist</h2>
            <div className="mt-4 space-y-4 text-sm leading-7">
              {kit.reviewChecklist.map((item) => (
                <div key={item.area} className="rounded-3xl border border-[var(--border-soft)] bg-white/80 p-4">
                  <p className="font-medium">{item.area}</p>
                  <p className="mt-1 text-[var(--ink-soft)]">{item.note}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6">
            <h2 className="text-lg font-semibold">Privacy notes</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7">
              {kit.privacyNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            <h3 className="mt-6 text-base font-semibold">Permission copy</h3>
            <ul className="mt-3 space-y-3 text-sm leading-7">
              {kit.permissionCopy.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6">
            <h2 className="text-lg font-semibold">Launch copy</h2>
            <div className="mt-4 space-y-4 text-sm leading-7">
              <p>
                <span className="font-medium">Hero:</span> {kit.launchCopy.hero}
              </p>
              <p>
                <span className="font-medium">Product Hunt:</span> {kit.launchCopy.productHunt}
              </p>
              <p>
                <span className="font-medium">Tweet:</span> {kit.launchCopy.tweet}
              </p>
              <div>
                <p className="font-medium">Thread</p>
                <ul className="mt-2 space-y-2">
                  {kit.launchCopy.thread.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </section>
      ) : null}
    </div>
  );
}
