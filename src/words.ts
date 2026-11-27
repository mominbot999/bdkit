import { parseAmount } from "./amount.js";

// prettier-ignore
const BN_0_99 = [
  "শূন্য", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়",
  "দশ", "এগারো", "বারো", "তেরো", "চৌদ্দ", "পনেরো", "ষোলো", "সতেরো", "আঠারো", "উনিশ",
  "বিশ", "একুশ", "বাইশ", "তেইশ", "চব্বিশ", "পঁচিশ", "ছাব্বিশ", "সাতাশ", "আটাশ", "ঊনত্রিশ",
  "ত্রিশ", "একত্রিশ", "বত্রিশ", "তেত্রিশ", "চৌত্রিশ", "পঁয়ত্রিশ", "ছত্রিশ", "সাঁইত্রিশ", "আটত্রিশ", "ঊনচল্লিশ",
  "চল্লিশ", "একচল্লিশ", "বিয়াল্লিশ", "তেতাল্লিশ", "চুয়াল্লিশ", "পঁয়তাল্লিশ", "ছেচল্লিশ", "সাতচল্লিশ", "আটচল্লিশ", "ঊনপঞ্চাশ",
  "পঞ্চাশ", "একান্ন", "বাহান্ন", "তিপ্পান্ন", "চুয়ান্ন", "পঞ্চান্ন", "ছাপ্পান্ন", "সাতান্ন", "আটান্ন", "ঊনষাট",
  "ষাট", "একষট্টি", "বাষট্টি", "তেষট্টি", "চৌষট্টি", "পঁয়ষট্টি", "ছেষট্টি", "সাতষট্টি", "আটষট্টি", "ঊনসত্তর",
  "সত্তর", "একাত্তর", "বাহাত্তর", "তিয়াত্তর", "চুয়াত্তর", "পঁচাত্তর", "ছিয়াত্তর", "সাতাত্তর", "আটাত্তর", "ঊনআশি",
  "আশি", "একাশি", "বিরাশি", "তিরাশি", "চুরাশি", "পঁচাশি", "ছিয়াশি", "সাতাশি", "আটাশি", "ঊননব্বই",
  "নব্বই", "একানব্বই", "বিরানব্বই", "তিরানব্বই", "চুরানব্বই", "পঁচানব্বই", "ছিয়ানব্বই", "সাতানব্বই", "আটানব্বই", "নিরানব্বই",
];

// prettier-ignore
const EN_0_19 = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const EN_TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

type Lang = "bn" | "en";

const SCALE = {
  bn: { hundred: "শত", thousand: "হাজার", lakh: "লক্ষ", crore: "কোটি" },
  en: { hundred: "Hundred", thousand: "Thousand", lakh: "Lakh", crore: "Crore" },
};

function below100(n: number, lang: Lang): string {
  if (lang === "bn") return BN_0_99[n];
  if (n < 20) return EN_0_19[n];
  const t = EN_TENS[Math.floor(n / 10)];
  return n % 10 ? `${t}-${EN_0_19[n % 10]}` : t;
}

/** Words for 1..9,99,99,999 (below one crore). */
function belowCrore(n: number, lang: Lang): string[] {
  const s = SCALE[lang];
  const parts: string[] = [];
  const lakh = Math.floor(n / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const hundred = Math.floor((n % 1000) / 100);
  const rest = n % 100;
  if (lakh) parts.push(below100(lakh, lang), s.lakh);
  if (thousand) parts.push(below100(thousand, lang), s.thousand);
  if (hundred) parts.push(lang === "bn" ? BN_0_99[hundred] + s.hundred : `${below100(hundred, lang)} ${s.hundred}`);
  if (rest) parts.push(below100(rest, lang));
  return parts;
}

/** Spell a non-negative integer digit string in the lakh/crore system. */
function spellWhole(whole: string, lang: Lang): string {
  if (/^0*$/.test(whole)) return below100(0, lang);
  const n = BigInt(whole);
  const CRORE = 10000000n;
  const parts: string[] = [];
  if (n >= CRORE) {
    parts.push(spellWhole((n / CRORE).toString(), lang), SCALE[lang].crore);
  }
  const remainder = Number(n % CRORE);
  if (remainder) parts.push(...belowCrore(remainder, lang));
  return parts.join(" ");
}

export interface NumberToWordsOptions {
  /** "bn" (default) or "en" */
  lang?: Lang;
}

/**
 * Spell out an integer using the Bangladeshi (lakh/crore) system.
 * numberToWords(125000) -> "এক লক্ষ পঁচিশ হাজার"
 * numberToWords(125000, { lang: "en" }) -> "One Lakh Twenty-Five Thousand"
 * Decimals are ignored; use takaInWords for currency.
 */
export function numberToWords(input: string | number | bigint, opts: NumberToWordsOptions = {}): string {
  const lang = opts.lang ?? "bn";
  const { negative, whole } = parseAmount(typeof input === "number" ? Math.trunc(input) : input);
  const words = spellWhole(whole, lang);
  const minus = lang === "bn" ? "ঋণাত্মক" : "Minus";
  return negative && whole !== "0" ? `${minus} ${words}` : words;
}

export interface TakaInWordsOptions extends NumberToWordsOptions {
  /** Append "মাত্র" / "Only". Default: true */
  only?: boolean;
}

/**
 * Spell a currency amount in Taka and Paisa — useful for invoices, cheques and receipts.
 * takaInWords(1250.5) -> "এক হাজার দুইশত পঞ্চাশ টাকা পঞ্চাশ পয়সা মাত্র"
 * takaInWords(1250.5, { lang: "en" }) -> "One Thousand Two Hundred Fifty Taka and Fifty Paisa Only"
 */
export function takaInWords(amount: string | number | bigint, opts: TakaInWordsOptions = {}): string {
  const lang = opts.lang ?? "bn";
  const only = opts.only ?? true;
  const { negative, whole, paisa } = parseAmount(amount);
  const bn = lang === "bn";
  const parts: string[] = [];
  if (negative) parts.push(bn ? "ঋণাত্মক" : "Minus");

  const hasTaka = whole !== "0" || paisa === 0;
  if (hasTaka) parts.push(spellWhole(whole, lang), bn ? "টাকা" : "Taka");
  if (paisa) {
    if (hasTaka && !bn) parts.push("and");
    parts.push(below100(paisa, lang), bn ? "পয়সা" : "Paisa");
  }
  if (only) parts.push(bn ? "মাত্র" : "Only");
  return parts.join(" ");
}
