import { toBanglaDigits, toEnglishDigits } from "./digits.js";

export interface ParsedAmount {
  negative: boolean;
  /** Whole part as a digit string, no leading zeros (except "0"). */
  whole: string;
  /** Fractional part rounded to two digits (paisa), 0-99. */
  paisa: number;
}

/**
 * Parse a number or numeric string (ASCII or Bangla digits, commas allowed)
 * into whole + paisa parts without floating-point rounding errors.
 */
export function parseAmount(input: string | number | bigint): ParsedAmount {
  let s: string;
  if (typeof input === "bigint") s = input.toString();
  else if (typeof input === "number") {
    if (!Number.isFinite(input)) throw new RangeError(`Invalid amount: ${input}`);
    s = Math.abs(input) >= 1e21 ? BigInt(Math.trunc(input)).toString() : input.toFixed(2);
  } else s = toEnglishDigits(input).replace(/[,\s_]/g, "");

  const m = /^([+-])?(\d*)(?:\.(\d*))?$/.exec(s);
  if (!m || (m[2] === "" && (m[3] ?? "") === "")) throw new RangeError(`Invalid amount: ${String(input)}`);

  let whole = (m[2] || "0").replace(/^0+(?=\d)/, "");
  const frac = (m[3] ?? "").padEnd(3, "0");
  let paisa = Number(frac.slice(0, 2));
  if (Number(frac[2]) >= 5) paisa += 1;
  if (paisa === 100) {
    paisa = 0;
    whole = (BigInt(whole) + 1n).toString();
  }
  const negative = m[1] === "-" && (whole !== "0" || paisa !== 0);
  return { negative, whole, paisa };
}

export interface FormatOptions {
  /** Output Bangla digits. Default: false */
  bangla?: boolean;
  /** Number of decimal places to show (0 or 2). Default: 2 if there are paisa, else 0 */
  decimals?: 0 | 2;
  /** Prefix the result with "৳". Default: false */
  symbol?: boolean;
}

/** Group a digit string using the South Asian system: 12,34,56,789 */
export function groupLakh(whole: string): string {
  if (whole.length <= 3) return whole;
  const last3 = whole.slice(-3);
  const rest = whole.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${rest},${last3}`;
}

/**
 * Format an amount with lakh/crore grouping.
 * formatTaka(1234567.5) -> "12,34,567.50"
 * formatTaka(1234567, { bangla: true, symbol: true }) -> "৳১২,৩৪,৫৬৭"
 */
export function formatTaka(amount: string | number | bigint, opts: FormatOptions = {}): string {
  const { negative, whole, paisa } = parseAmount(amount);
  const decimals = opts.decimals ?? (paisa ? 2 : 0);
  let out = groupLakh(whole);
  if (decimals === 2) out += "." + String(paisa).padStart(2, "0");
  if (opts.symbol) out = "৳" + out;
  if (negative) out = "-" + out;
  return opts.bangla ? toBanglaDigits(out) : out;
}
