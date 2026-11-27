import { toBanglaDigits } from "./digits.js";
import { numberToWords } from "./words.js";

const ORDINAL_WORDS = ["", "প্রথম", "দ্বিতীয়", "তৃতীয়", "চতুর্থ", "পঞ্চম", "ষষ্ঠ", "সপ্তম", "অষ্টম", "নবম", "দশম"];
const ORDINAL_SUFFIX = ["", "ম", "য়", "য়", "র্থ", "ম", "ষ্ঠ", "ম", "ম", "ম", "ম"];

function checkPositive(n: number) {
  if (!Number.isInteger(n) || n < 1) throw new RangeError(`Ordinal needs a positive integer, got ${n}`);
}

/**
 * Bangla ordinal number.
 * toBanglaOrdinal(1) → "১ম", (3) → "৩য়", (4) → "৪র্থ", (6) → "৬ষ্ঠ", (21) → "২১তম"
 * toBanglaOrdinal(2, { words: true }) → "দ্বিতীয়", (25, { words: true }) → "পঁচিশতম"
 */
export function toBanglaOrdinal(n: number, opts: { words?: boolean } = {}): string {
  checkPositive(n);
  if (opts.words) return n <= 10 ? ORDINAL_WORDS[n] : numberToWords(n) + "তম";
  return toBanglaDigits(n) + (n <= 10 ? ORDINAL_SUFFIX[n] : "তম");
}

/**
 * Day-of-month as written in Bangla dates: ১লা, ২রা, ৩রা, ৪ঠা, ৫ই … ১৮ই, ১৯শে … ৩১শে.
 * toBanglaDayOrdinal(1) → "১লা" (as in "১লা জানুয়ারি"), toBanglaDayOrdinal(21) → "২১শে"
 */
export function toBanglaDayOrdinal(day: number): string {
  checkPositive(day);
  if (day > 31) throw new RangeError(`Invalid day of month: ${day}`);
  const suffix = day === 1 ? "লা" : day <= 3 ? "রা" : day === 4 ? "ঠা" : day <= 18 ? "ই" : "শে";
  return toBanglaDigits(day) + suffix;
}
