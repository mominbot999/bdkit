import { toEnglishDigits } from "./digits.js";

const clean = (s: string) => toEnglishDigits(String(s)).replace(/[\s-]/g, "");

/**
 * Check that a National ID (NID) number has a valid *format*:
 * 10 digits (smart card), 13 digits or 17 digits (older cards).
 * This does not check whether the NID actually exists.
 */
export function isValidNIDFormat(nid: string | number): boolean {
  const s = clean(String(nid));
  return /^\d{10}$|^\d{13}$|^\d{17}$/.test(s);
}

/** Check a Bangladesh postcode format: 4 digits, e.g. "7000" (Kushtia), "১২০৫". */
export function isValidPostcode(code: string | number): boolean {
  return /^[1-9]\d{3}$/.test(clean(String(code)));
}
