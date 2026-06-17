"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  defaultDraft,
  type AppCategory,
  type AppLaunchDraft,
} from "@/lib/app-launch-kit";
import { saveDraftToStorage, savePlanToStorage } from "@/lib/mvp-storage";

const categories: { value: AppCategory; label: string }[] = [
  { value: "productivity", label: "Productivity" },
  { value: "health", label: "Health & wellness" },
  { value: "education", label: "Education" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "finance", label: "Finance" },
  { value: "creator", label: "Creator tools" },
];

export function GenerateForm() {
  const router = useRouter();
  const [draft, setDraft] = useState<AppLaunchDraft>(defaultDraft);

  function updateField<Key extends keyof AppLaunchDraft>(key: Key, value: AppLaunchDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveDraftToStorage(draft);
    savePlanToStorage("free");
    router.push("/preview");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6 shadow-[0_20px_50px_rgba(23,32,51,0.05)]"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">App idea</label>
        <textarea
          required
          value={draft.idea}
          onChange={(event) => updateField("idea", event.target.value)}
          className="min-h-36 w-full rounded-3xl border border-[var(--border-soft)] bg-white px-4 py-4 text-sm leading-7 outline-none transition focus:border-[var(--accent)]"
          placeholder="Habit tracker for students with reminders and streaks"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">App category</label>
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
            placeholder="Students building consistent routines"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Why it is different</label>
        <textarea
          required
          value={draft.differentiator}
          onChange={(event) => updateField("differentiator", event.target.value)}
          className="min-h-28 w-full rounded-3xl border border-[var(--border-soft)] bg-white px-4 py-4 text-sm leading-7 outline-none transition focus:border-[var(--accent)]"
          placeholder="It makes habit tracking feel calm, visual, and easy to keep up with during busy weeks."
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-7 text-[var(--ink-soft)]">
          Free preview includes the App Store listing core and 2 screenshot captions.
        </p>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-strong)]"
        >
          Generate free preview
        </button>
      </div>
    </form>
  );
}

