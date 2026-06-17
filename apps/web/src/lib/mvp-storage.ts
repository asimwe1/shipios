import { defaultDraft, type AppLaunchDraft, type PaidPlan } from "@/lib/app-launch-kit";

export const DRAFT_STORAGE_KEY = "applaunchkit:draft";
export const PLAN_STORAGE_KEY = "applaunchkit:plan";

export function hasDraftInStorage() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(DRAFT_STORAGE_KEY) !== null;
}

export function readDraftFromStorage() {
  if (typeof window === "undefined") {
    return defaultDraft;
  }

  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppLaunchDraft) : defaultDraft;
  } catch {
    return defaultDraft;
  }
}

export function saveDraftToStorage(draft: AppLaunchDraft) {
  window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export function readPlanFromStorage(): PaidPlan {
  if (typeof window === "undefined") {
    return "free";
  }

  const value = window.localStorage.getItem(PLAN_STORAGE_KEY);

  return value === "full" || value === "pro" ? value : "free";
}

export function savePlanToStorage(plan: PaidPlan) {
  window.localStorage.setItem(PLAN_STORAGE_KEY, plan);
}
