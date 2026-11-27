import { test } from "node:test";
import assert from "node:assert/strict";
import {
  toBanglaDigits, toEnglishDigits, formatTaka, numberToWords, takaInWords,
  normalizePhone, isValidPhone, toInternational, getOperator,
  toBanglaDate, fromBanglaDate, formatBanglaDate, parseAmount,
} from "../dist/esm/index.js";
import { createRequire } from "node:module";

test("digits", () => {
  assert.equal(toBanglaDigits(2026), "২০২৬");
  assert.equal(toBanglaDigits("Tk 1,250.50"), "Tk ১,২৫০.৫০");
  assert.equal(toEnglishDigits("০১৭১২-৩৪৫৬৭৮"), "01712-345678");
});

test("parseAmount avoids float errors", () => {
  assert.deepEqual(parseAmount(0.1 + 0.2), { negative: false, whole: "0", paisa: 30 });
  assert.deepEqual(parseAmount("১,২৫০.৫"), { negative: false, whole: "1250", paisa: 50 });
  assert.deepEqual(parseAmount("9.995"), { negative: false, whole: "10", paisa: 0 });
  assert.throws(() => parseAmount("abc"));
  assert.throws(() => parseAmount(NaN));
});

test("formatTaka", () => {
  assert.equal(formatTaka(999), "999");
  assert.equal(formatTaka(1000), "1,000");
  assert.equal(formatTaka(1234567.5), "12,34,567.50");
  assert.equal(formatTaka(123456789), "12,34,56,789");
  assert.equal(formatTaka(1234567, { bangla: true, symbol: true }), "৳১২,৩৪,৫৬৭");
  assert.equal(formatTaka(-5000, { decimals: 2 }), "-5,000.00");
});

test("numberToWords bn", () => {
  assert.equal(numberToWords(0), "শূন্য");
  assert.equal(numberToWords(7), "সাত");
  assert.equal(numberToWords(99), "নিরানব্বই");
  assert.equal(numberToWords(100), "একশত");
  assert.equal(numberToWords(250), "দুইশত পঞ্চাশ");
  assert.equal(numberToWords(125000), "এক লক্ষ পঁচিশ হাজার");
  assert.equal(numberToWords(10000000), "এক কোটি");
  assert.equal(numberToWords(1234567890), "একশত তেইশ কোটি পঁয়তাল্লিশ লক্ষ সাতষট্টি হাজার আটশত নব্বই");
  assert.equal(numberToWords(-15), "ঋণাত্মক পনেরো");
});

test("numberToWords en", () => {
  assert.equal(numberToWords(125000, { lang: "en" }), "One Lakh Twenty-Five Thousand");
  assert.equal(numberToWords(1001, { lang: "en" }), "One Thousand One");
  assert.equal(numberToWords(20000000, { lang: "en" }), "Two Crore");
});

test("takaInWords", () => {
  assert.equal(takaInWords(1250.5), "এক হাজার দুইশত পঞ্চাশ টাকা পঞ্চাশ পয়সা মাত্র");
  assert.equal(takaInWords(1250.5, { lang: "en" }), "One Thousand Two Hundred Fifty Taka and Fifty Paisa Only");
  assert.equal(takaInWords(0), "শূন্য টাকা মাত্র");
  assert.equal(takaInWords(0.75), "পঁচাত্তর পয়সা মাত্র");
  assert.equal(takaInWords("১০০০০০", { only: false }), "এক লক্ষ টাকা");
  assert.equal(takaInWords(12345678901234567890n), "এক লক্ষ তেইশ হাজার চারশত ছাপ্পান্ন কোটি আটাত্তর লক্ষ নব্বই হাজার একশত তেইশ কোটি পঁয়তাল্লিশ লক্ষ সাতষট্টি হাজার আটশত নব্বই টাকা মাত্র");
});

test("phone", () => {
  for (const n of ["01712345678", "+8801712345678", "8801712345678", "008801712345678", "017-1234-5678", "০১৭১২৩৪৫৬৭৮", "1712345678"]) {
    assert.equal(normalizePhone(n), "01712345678", n);
  }
  assert.equal(normalizePhone("01212345678"), null);
  assert.equal(normalizePhone("0171234567"), null);
  assert.equal(isValidPhone("01912345678"), true);
  assert.equal(toInternational("01812345678"), "+8801812345678");
  assert.equal(getOperator("01312345678"), "Grameenphone");
  assert.equal(getOperator("01412345678"), "Banglalink");
  assert.equal(getOperator("01612345678"), "Airtel");
  assert.equal(getOperator("01512345678"), "Teletalk");
  assert.equal(getOperator("01812345678"), "Robi");
  assert.equal(getOperator("bad"), null);
});

test("bangla calendar: known dates (revised 2019 calendar)", () => {
  const d = (y, m, day) => new Date(y, m - 1, day);
  // Pohela Boishakh
  assert.deepEqual(pick(toBanglaDate(d(2026, 4, 14))), [1433, 0, 1]);
  assert.deepEqual(pick(toBanglaDate(d(2026, 4, 13))), [1432, 11, 30]);
  // 21 February = 8 Falgun, 16 December = 1 Poush, 26 March = 12 Choitro
  assert.deepEqual(pick(toBanglaDate(d(2025, 2, 21))), [1431, 10, 8]);
  assert.deepEqual(pick(toBanglaDate(d(2024, 12, 16))), [1431, 8, 1]);
  assert.deepEqual(pick(toBanglaDate(d(2025, 3, 26))), [1431, 11, 12]);
  // Falgun has 30 days in leap years, so 1 Choitro stays on 15 March every year
  assert.deepEqual(pick(toBanglaDate(d(2024, 3, 14))), [1430, 10, 30]);
  assert.deepEqual(pick(toBanglaDate(d(2024, 3, 15))), [1430, 11, 1]);
  assert.deepEqual(pick(toBanglaDate(d(2025, 3, 15))), [1431, 11, 1]);
  assert.equal(toBanglaDate(d(2026, 11, 27)).monthName, "অগ্রহায়ণ");
});

test("bangla calendar round-trip for every day 2020-2030", () => {
  for (let t = new Date(2020, 0, 1); t < new Date(2031, 0, 1); t = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1)) {
    const b = toBanglaDate(t);
    assert.equal(fromBanglaDate(b.year, b.month, b.day).getTime(), t.getTime(), t.toDateString());
  }
});

test("formatBanglaDate", () => {
  assert.equal(formatBanglaDate(new Date(2026, 3, 14)), "১ বৈশাখ ১৪৩৩ বঙ্গাব্দ");
  assert.equal(formatBanglaDate(new Date(2026, 3, 14), { weekday: true, suffix: false }), "মঙ্গলবার, ১ বৈশাখ ১৪৩৩");
});

test("CommonJS build works", () => {
  const require = createRequire(import.meta.url);
  const cjs = require("../dist/cjs/index.js");
  assert.equal(cjs.takaInWords(500), "পাঁচশত টাকা মাত্র");
});

function pick(b) { return [b.year, b.month, b.day]; }
