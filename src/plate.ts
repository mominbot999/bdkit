import { toBanglaDigits, toEnglishDigits } from "./digits.js";

export interface VehiclePlate {
  /** Registration area, e.g. "ঢাকা" */
  area: string;
  /** True for "মেট্রো" (metropolitan) registrations */
  metro: boolean;
  /** Vehicle class letter, e.g. "গ" */
  classLetter: string;
  /** Two-digit series, e.g. "12" */
  series: string;
  /** Four-digit serial number, e.g. "3456" */
  number: string;
}

const PLATE_RE = /^(.+?)\s*(ম\u09C7ট\u09CDর\u09CB)?\s*[-–]\s*([ক-হৎ\u09DC\u09DD\u09DF])\s*[-–]?\s*(\d{2})\s*[-–]\s*(\d{4})$/;

/**
 * Parse a Bangladeshi vehicle registration plate.
 * parsePlate("ঢাকা মেট্রো-গ ১২-৩৪৫৬")
 *   → { area: "ঢাকা", metro: true, classLetter: "গ", series: "12", number: "3456" }
 * Returns null if the text is not a valid plate.
 */
export function parsePlate(text: string): VehiclePlate | null {
  const s = toEnglishDigits(text.normalize("NFC").replace(/য\u09BC/g, "\u09DF")).replace(/\s+/g, " ").trim();
  const m = PLATE_RE.exec(s);
  if (!m) return null;
  const area = m[1].trim();
  if (!/^[ঀ-৿ ]+$/.test(area)) return null;
  return { area, metro: !!m[2], classLetter: m[3], series: m[4], number: m[5] };
}

/** True if the text is a valid vehicle registration plate. */
export function isValidPlate(text: string): boolean {
  return parsePlate(text) !== null;
}

/** Format a plate in the standard way: "ঢাকা মেট্রো-গ ১২-৩৪৫৬". */
export function formatPlate(plate: VehiclePlate, opts: { digits?: "bn" | "en" } = {}): string {
  const out = `${plate.area}${plate.metro ? " মেট্রো" : ""}-${plate.classLetter} ${plate.series}-${plate.number}`;
  return opts.digits === "en" ? out : toBanglaDigits(out);
}
