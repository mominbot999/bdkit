import { toBanglaDigits } from "./digits.js";

const UNITS: [limitSeconds: number, seconds: number, bn: string, en: string][] = [
  [3600, 60, "মিনিট", "minute"],
  [86400, 3600, "ঘণ্টা", "hour"],
  [86400 * 7, 86400, "দিন", "day"],
  [86400 * 30, 86400 * 7, "সপ্তাহ", "week"],
  [86400 * 365, 86400 * 30, "মাস", "month"],
  [Infinity, 86400 * 365, "বছর", "year"],
];

/**
 * Relative time in Bangla, like social media timestamps.
 * timeAgo(fiveMinutesAgo) → "৫ মিনিট আগে"
 * timeAgo(tomorrow)       → "১ দিন পরে"
 * timeAgo(justNow)        → "এইমাত্র"
 * Use { digits: "en" } for "5 মিনিট আগে".
 */
export function timeAgo(date: Date | number, opts: { now?: Date | number; digits?: "bn" | "en" } = {}): string {
  const now = opts.now === undefined ? Date.now() : +opts.now;
  const diff = Math.round((now - +date) / 1000);
  const abs = Math.abs(diff);
  if (abs < 45) return "এইমাত্র";
  for (const [limit, secs, bn] of UNITS) {
    if (abs < limit) {
      const n = Math.max(1, Math.round(abs / secs));
      const num = opts.digits === "en" ? String(n) : toBanglaDigits(n);
      return `${num} ${bn} ${diff >= 0 ? "আগে" : "পরে"}`;
    }
  }
  return "";
}
