import { toEnglishDigits } from "./digits.js";
import { BN_0_99 } from "./words.js";

const BN_VALUES = new Map<string, number>();
BN_0_99.forEach((w, i) => BN_VALUES.set(w, i));
// common spoken / alternative spellings
// prettier-ignore
const BN_ALIASES: Record<string, number> = {
  "দু": 2, "দুয়ে": 2, "ছয়": 6, "ছ": 6, "নয়": 9, "এগার": 11, "বার": 12, "তের": 13, "পনের": 15,
  "ষোল": 16, "সতের": 17, "আঠার": 18, "উনত্রিশ": 29, "উনচল্লিশ": 39, "উনপঞ্চাশ": 49, "উনষাট": 59,
  "উনসত্তর": 69, "উনআশি": 79, "উননব্বই": 89, "বিশ": 20, "কুড়ি": 20, "শূণ্য": 0,
};
for (const [k, v] of Object.entries(BN_ALIASES)) BN_VALUES.set(k, v);

const HUNDRED = ["শত", "শো", "শ", "hundred"];
const SCALES: Record<string, bigint> = {
  "হাজার": 1000n, thousand: 1000n,
  "লক্ষ": 100000n, "লাখ": 100000n, lakh: 100000n, lac: 100000n, lakhs: 100000n,
  "কোটি": 10000000n, crore: 10000000n, crores: 10000000n,
};
const IGNORED = new Set(["টাকা", "মাত্র", "and", "taka", "only", "tk"]);

// prettier-ignore
const EN_VALUES: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70,
  eighty: 80, ninety: 90,
};

function smallValue(token: string): number | undefined {
  if (/^\d+$/.test(token)) return Number(token);
  return BN_VALUES.get(token) ?? EN_VALUES[token];
}

/**
 * Convert number words (Bangla or Indian-English) back to a number.
 * Inverse of numberToWords.
 *
 * wordsToNumber("এক লক্ষ পঁচিশ হাজার")          → 125000
 * wordsToNumber("দুইশত পঞ্চাশ টাকা মাত্র")        → 250
 * wordsToNumber("৫ হাজার")                       → 5000
 * wordsToNumber("One Lakh Twenty-Five Thousand") → 125000
 *
 * Returns a bigint for values above Number.MAX_SAFE_INTEGER when `bigint: true`.
 * Throws a RangeError for unknown words.
 */
export function wordsToNumber(text: string): number;
export function wordsToNumber(text: string, opts: { bigint: true }): bigint;
export function wordsToNumber(text: string, opts: { bigint?: boolean } = {}): number | bigint {
  const tokens = toEnglishDigits(text)
    .normalize("NFC")
    .replace(/য\u09BC/g, "\u09DF")
    .toLowerCase()
    .replace(/[,।.\-]+/g, " ")
    .split(/\s+/)
    .filter((t) => t && !IGNORED.has(t));
  if (!tokens.length) throw new RangeError("No number words found");

  let negative = false;
  let total = 0n;
  let current = 0n;
  for (let raw of tokens) {
    if (raw === "ঋণাত্মক" || raw === "minus") {
      negative = true;
      continue;
    }
    // compound hundreds like "দুইশত", "পাঁচশো", "একশ"
    const hundredSuffix = HUNDRED.find((h) => raw.length > h.length && raw.endsWith(h) && smallValue(raw.slice(0, -h.length)) !== undefined);
    if (hundredSuffix) {
      current += BigInt(smallValue(raw.slice(0, -hundredSuffix.length))!) * 100n;
      continue;
    }
    if (HUNDRED.includes(raw)) {
      current = (current || 1n) * 100n;
      continue;
    }
    if (raw in SCALES) {
      const scale = SCALES[raw];
      if (scale === 10000000n) {
        total = (total + current || 1n) * scale;
      } else {
        total += (current || 1n) * scale;
      }
      current = 0n;
      continue;
    }
    const v = smallValue(raw);
    if (v === undefined) throw new RangeError(`Unknown number word: "${raw}"`);
    current += BigInt(v);
  }
  let result = total + current;
  if (negative) result = -result;
  if (opts.bigint) return result;
  if (result > BigInt(Number.MAX_SAFE_INTEGER) || result < -BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new RangeError("Number too large; pass { bigint: true }");
  }
  return Number(result);
}
