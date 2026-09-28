export type UserPrefs = {
  category: string;
  state: string;
  targetExams: string[];
  qualification: string;
};

const STORAGE_KEY = "aier_prefs";

export function loadPrefs(): UserPrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function savePrefs(prefs: UserPrefs): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch {}
}
