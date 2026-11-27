import { toEnglishDigits } from "./digits.js";

export type Operator = "Grameenphone" | "Banglalink" | "Robi" | "Airtel" | "Teletalk";

const OPERATORS: Record<string, Operator> = {
  "13": "Grameenphone",
  "17": "Grameenphone",
  "14": "Banglalink",
  "19": "Banglalink",
  "18": "Robi",
  "16": "Airtel",
  "15": "Teletalk",
};

/**
 * Normalize a Bangladeshi mobile number to the 11-digit local form (01XXXXXXXXX).
 * Accepts +880, 880, 00880 prefixes, spaces, dashes, brackets and Bangla digits.
 * Returns null if the input is not a valid BD mobile number.
 */
export function normalizePhone(input: string): string | null {
  let s = toEnglishDigits(input).replace(/[\s\-().]/g, "");
  s = s.replace(/^(\+|00)?880/, "0");
  if (/^1\d{9}$/.test(s)) s = "0" + s;
  if (!/^01[3-9]\d{8}$/.test(s)) return null;
  return s;
}

/** True if the input is a valid Bangladeshi mobile number. */
export function isValidPhone(input: string): boolean {
  return normalizePhone(input) !== null;
}

/** Format to international E.164 form: +8801XXXXXXXXX (null if invalid). */
export function toInternational(input: string): string | null {
  const n = normalizePhone(input);
  return n ? "+88" + n : null;
}

/**
 * Detect the mobile operator from the number prefix.
 * Note: because of mobile number portability (MNP), a number may have moved
 * to a different operator; the prefix reflects the original operator only.
 */
export function getOperator(input: string): Operator | null {
  const n = normalizePhone(input);
  return n ? OPERATORS[n.slice(1, 3)] ?? null : null;
}
