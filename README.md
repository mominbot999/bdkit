# bdkit 🇧🇩

[![CI](https://github.com/mominbot999/bdkit/actions/workflows/ci.yml/badge.svg)](https://github.com/mominbot999/bdkit/actions/workflows/ci.yml)
![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
![license](https://img.shields.io/badge/license-MIT-blue)

**A tiny, zero-dependency toolkit for building software for Bangladesh.**
বাংলাদেশের জন্য সফটওয়্যার বানাতে দরকারি ছোট ছোট কাজের একটা লাইব্রেরি — কোনো ডিপেন্ডেন্সি ছাড়া।

- 💰 **Taka in words** for invoices, cheques and receipts — `এক লক্ষ পঁচিশ হাজার টাকা মাত্র`
- 🔢 **Lakh/crore formatting** — `12,34,567.50`, `৳১২,৩৪,৫৬৭`
- ০১২ **Bangla ⇄ English digits**
- 📱 **BD mobile numbers** — validate, normalize, `+880` format, operator detection
- 📅 **Bangla calendar (বঙ্গাব্দ)** — the official 2019 revised Bangladesh calendar

Works in Node.js (ESM + CommonJS), browsers, Deno and Bun. Fully typed (TypeScript).

## Install

```bash
npm install bdkit
```

## Usage

### Taka in words / টাকা কথায়

```js
import { takaInWords, numberToWords } from "bdkit";

takaInWords(125000);            // "এক লক্ষ পঁচিশ হাজার টাকা মাত্র"
takaInWords(1250.5);            // "এক হাজার দুইশত পঞ্চাশ টাকা পঞ্চাশ পয়সা মাত্র"
takaInWords("১,২৫০.৫০");        // Bangla digits and commas are fine
takaInWords(1250.5, { lang: "en" });
// "One Thousand Two Hundred Fifty Taka and Fifty Paisa Only"
takaInWords(500, { only: false }); // "পাঁচশত টাকা"

numberToWords(1234567890);
// "একশত তেইশ কোটি পঁয়তাল্লিশ লক্ষ সাতষট্টি হাজার আটশত নব্বই"
```

Amounts are parsed as strings internally, so `0.1 + 0.2` gives `ত্রিশ পয়সা`, not a rounding bug.
Pass a `bigint` or a string for very large values.

### Lakh/crore formatting

```js
import { formatTaka } from "bdkit";

formatTaka(1234567.5);                                // "12,34,567.50"
formatTaka(1234567, { bangla: true, symbol: true });  // "৳১২,৩৪,৫৬৭"
formatTaka(5000, { decimals: 2 });                    // "5,000.00"
```

### Digits

```js
import { toBanglaDigits, toEnglishDigits } from "bdkit";

toBanglaDigits(2026);              // "২০২৬"
toEnglishDigits("০১৭১২-৩৪৫৬৭৮");   // "01712-345678"
```

### Mobile numbers

```js
import { normalizePhone, isValidPhone, toInternational, getOperator } from "bdkit";

normalizePhone("+880 1712-345678");  // "01712345678"
normalizePhone("০১৭১২৩৪৫৬৭৮");        // "01712345678"
isValidPhone("01212345678");         // false
toInternational("01812345678");      // "+8801812345678"
getOperator("01912345678");          // "Banglalink"
```

> Operator detection is based on the prefix. Because of mobile number portability, a number may have switched operators.

### Bangla calendar / বঙ্গাব্দ

```js
import { toBanglaDate, formatBanglaDate, fromBanglaDate } from "bdkit";

formatBanglaDate(new Date(2026, 3, 14));                    // "১ বৈশাখ ১৪৩৩ বঙ্গাব্দ"
formatBanglaDate(new Date(), { weekday: true });            // "শুক্রবার, ১২ অগ্রহায়ণ ১৪৩৩ বঙ্গাব্দ"
toBanglaDate(new Date(2025, 1, 21));
// { year: 1431, month: 10, day: 8, monthName: "ফাল্গুন", weekday: "শুক্রবার", season: "বসন্ত" }
fromBanglaDate(1433, 0, 1);                                 // Date: 14 April 2026
```

Follows the calendar revised by the Bangla Academy in 2019 and used officially in Bangladesh:
পহেলা বৈশাখ is always 14 April, বৈশাখ–আশ্বিন have 31 days, ফাল্গুন has 29 days (30 in a leap year)
and the rest have 30 — so ২১ ফেব্রুয়ারি is always ৮ ফাল্গুন and ১৬ ডিসেম্বর is always ১ পৌষ.

## API

| Function | Description |
| --- | --- |
| `takaInWords(amount, { lang?, only? })` | Currency in words, Taka + Paisa |
| `numberToWords(n, { lang? })` | Integer in words (lakh/crore system) |
| `formatTaka(amount, { bangla?, decimals?, symbol? })` | Lakh/crore grouping |
| `parseAmount(amount)` | Safe parse → `{ negative, whole, paisa }` |
| `toBanglaDigits(x)` / `toEnglishDigits(s)` | Digit conversion |
| `normalizePhone(s)` / `isValidPhone(s)` / `toInternational(s)` / `getOperator(s)` | BD mobile numbers |
| `toBanglaDate(date)` / `fromBanglaDate(y, m, d)` / `formatBanglaDate(date, opts)` | Bangla calendar |

## Contributing / অবদান রাখুন

New contributors are very welcome — বাংলায় বা ইংরেজিতে, যেভাবে সুবিধা।
See [CONTRIBUTING.md](CONTRIBUTING.md) and issues labelled
[`good first issue`](https://github.com/mominbot999/bdkit/labels/good%20first%20issue).

Ideas on the roadmap: Bangladesh division/district/upazila data, NID & postcode validation,
Bangla time formatting (`সকাল ১০টা`), ordinal words (`প্রথম`, `দ্বিতীয়`), Python port.

## License

MIT © Momin
