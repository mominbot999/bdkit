import { toBanglaDigits } from "./digits.js";

// prettier-ignore
export const BANGLA_MONTHS = ["বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন",
  "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"] as const;

export const BANGLA_WEEKDAYS = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"] as const;

export const BANGLA_SEASONS = ["গ্রীষ্ম", "বর্ষা", "শরৎ", "হেমন্ত", "শীত", "বসন্ত"] as const;

export interface BanglaDate {
  /** Bangla year (বঙ্গাব্দ), e.g. 1433 */
  year: number;
  /** Month index 0-11 (0 = বৈশাখ) */
  month: number;
  /** Day of month, 1-based */
  day: number;
  monthName: (typeof BANGLA_MONTHS)[number];
  weekday: (typeof BANGLA_WEEKDAYS)[number];
  season: (typeof BANGLA_SEASONS)[number];
}

const isGregorianLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

/** Month lengths for a Bangla year under the 2019 revised Bangladesh calendar. */
export function banglaMonthLengths(banglaYear: number): number[] {
  // Falgun of Bangla year Y falls in February of Gregorian year Y + 594.
  const falgun = isGregorianLeap(banglaYear + 594) ? 30 : 29;
  return [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, falgun, 30];
}

const DAY_MS = 86400000;
const utcDay = (y: number, m: number, d: number) => Date.UTC(y, m, d) / DAY_MS;

/**
 * Convert a Gregorian date to the Bangla calendar (বঙ্গাব্দ) as officially used in
 * Bangladesh (revised 2019: পহেলা বৈশাখ = 14 April; first six months have 31 days,
 * ফাল্গুন has 29 days, or 30 in a Gregorian leap year).
 *
 * Uses the date's local calendar day (year/month/date getters).
 */
export function toBanglaDate(date: Date = new Date()): BanglaDate {
  const gy = date.getFullYear();
  const gm = date.getMonth();
  const gd = date.getDate();
  const today = utcDay(gy, gm, gd);

  const startYearG = today >= utcDay(gy, 3, 14) ? gy : gy - 1;
  const year = startYearG - 593;
  let offset = today - utcDay(startYearG, 3, 14);

  const lengths = banglaMonthLengths(year);
  let month = 0;
  while (offset >= lengths[month]) {
    offset -= lengths[month];
    month++;
  }
  return {
    year,
    month,
    day: offset + 1,
    monthName: BANGLA_MONTHS[month],
    weekday: BANGLA_WEEKDAYS[date.getDay()],
    season: BANGLA_SEASONS[Math.floor(month / 2)],
  };
}

/**
 * Convert a Bangla date back to a Gregorian Date (local midnight).
 * month is 0-based (0 = বৈশাখ).
 */
export function fromBanglaDate(year: number, month: number, day: number): Date {
  const lengths = banglaMonthLengths(year);
  if (!Number.isInteger(month) || month < 0 || month > 11) throw new RangeError(`Invalid month: ${month}`);
  if (!Number.isInteger(day) || day < 1 || day > lengths[month]) throw new RangeError(`Invalid day: ${day}`);
  let offset = day - 1;
  for (let i = 0; i < month; i++) offset += lengths[i];
  return new Date(year + 593, 3, 14 + offset);
}

/**
 * Format a date in Bangla, e.g. "১৩ অগ্রহায়ণ ১৪৩৩ বঙ্গাব্দ".
 * Options: weekday (prefix weekday), suffix (append "বঙ্গাব্দ", default true).
 */
export function formatBanglaDate(
  date: Date = new Date(),
  opts: { weekday?: boolean; suffix?: boolean } = {},
): string {
  const b = toBanglaDate(date);
  let out = `${toBanglaDigits(b.day)} ${b.monthName} ${toBanglaDigits(b.year)}`;
  if (opts.suffix ?? true) out += " বঙ্গাব্দ";
  if (opts.weekday) out = `${b.weekday}, ${out}`;
  return out;
}
