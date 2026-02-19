export interface TargetAccount {
  id: string;
  handle: string;
  name: string;
  category: "local-seo" | "small-biz" | "accessibility" | "marketing";
  followed: boolean;
  followedBack: boolean;
  followedAt?: string;
  followedBackAt?: string;
  notes: string;
}

export interface EngagementEntry {
  id: string;
  date: string;
  handle: string;
  action: "like" | "reply" | "follow" | "retweet" | "quote-tweet";
  tweetUrl?: string;
  notes: string;
}

const SEED_TARGETS: TargetAccount[] = [
  { id: "1", handle: "@_toddanderson", name: "Todd Anderson", category: "local-seo", followed: false, followedBack: false, notes: "Local SEO expert" },
  { id: "2", handle: "@AlistairPierre", name: "Alistair Pierre", category: "local-seo", followed: false, followedBack: false, notes: "Local Service Rocket" },
  { id: "3", handle: "@CharlesNobleSEO", name: "Charles Noble", category: "local-seo", followed: false, followedBack: false, notes: "SEO strategy" },
  { id: "4", handle: "@boringlocalseo", name: "Boring Local SEO", category: "local-seo", followed: false, followedBack: false, notes: "Local SEO tips" },
  { id: "5", handle: "@localseoguide", name: "Local SEO Guide", category: "local-seo", followed: false, followedBack: false, notes: "Local search expert" },
  { id: "6", handle: "@JoyanneHawkins", name: "Joyanne Hawkins", category: "small-biz", followed: false, followedBack: false, notes: "Small biz marketing" },
  { id: "7", handle: "@bright_local", name: "BrightLocal", category: "local-seo", followed: false, followedBack: false, notes: "Local SEO tool/platform" },
  { id: "8", handle: "@asktheegghead", name: "Ask The Egghead", category: "marketing", followed: false, followedBack: false, notes: "UX/design, aligned takes" },
];

const TARGETS_KEY = "x-tracker-targets";
const LOG_KEY = "x-tracker-log";

export function getTargets(): TargetAccount[] {
  if (typeof window === "undefined") return SEED_TARGETS;
  const raw = localStorage.getItem(TARGETS_KEY);
  if (!raw) {
    localStorage.setItem(TARGETS_KEY, JSON.stringify(SEED_TARGETS));
    return SEED_TARGETS;
  }
  return JSON.parse(raw);
}

export function saveTargets(targets: TargetAccount[]) {
  localStorage.setItem(TARGETS_KEY, JSON.stringify(targets));
}

export function addTarget(t: Omit<TargetAccount, "id">) {
  const targets = getTargets();
  const newTarget = { ...t, id: Date.now().toString() };
  targets.push(newTarget);
  saveTargets(targets);
  return newTarget;
}

export function updateTarget(id: string, updates: Partial<TargetAccount>) {
  const targets = getTargets();
  const idx = targets.findIndex((t) => t.id === id);
  if (idx >= 0) {
    targets[idx] = { ...targets[idx], ...updates };
    saveTargets(targets);
  }
  return targets;
}

export function deleteTarget(id: string) {
  const targets = getTargets().filter((t) => t.id !== id);
  saveTargets(targets);
  return targets;
}

export function getLog(): EngagementEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(LOG_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addLogEntry(entry: Omit<EngagementEntry, "id">) {
  const log = getLog();
  const newEntry = { ...entry, id: Date.now().toString() };
  log.unshift(newEntry);
  localStorage.setItem(LOG_KEY, JSON.stringify(log));
  return newEntry;
}

export function deleteLogEntry(id: string) {
  const log = getLog().filter((e) => e.id !== id);
  localStorage.setItem(LOG_KEY, JSON.stringify(log));
  return log;
}

export function getWeeklyStats() {
  const log = getLog();
  const targets = getTargets();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekLog = log.filter((e) => new Date(e.date) >= weekAgo);

  const uniqueAccounts = new Set(weekLog.map((e) => e.handle));
  const followBacks = targets.filter((t) => t.followedBack).length;
  const totalFollowed = targets.filter((t) => t.followed).length;

  return {
    engagementsThisWeek: weekLog.length,
    uniqueAccountsEngaged: uniqueAccounts.size,
    followBacks,
    totalFollowed,
    byAction: {
      likes: weekLog.filter((e) => e.action === "like").length,
      replies: weekLog.filter((e) => e.action === "reply").length,
      follows: weekLog.filter((e) => e.action === "follow").length,
      retweets: weekLog.filter((e) => e.action === "retweet").length,
      quoteTweets: weekLog.filter((e) => e.action === "quote-tweet").length,
    },
  };
}

export const CATEGORY_LABELS: Record<string, string> = {
  "local-seo": "🗺️ Local SEO",
  "small-biz": "🏪 Small Business",
  accessibility: "♿ Accessibility",
  marketing: "📣 Marketing",
};
