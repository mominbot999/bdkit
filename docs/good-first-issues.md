# Starter issues to open on GitHub

Copy each block into a new GitHub issue and add the label `good first issue` (and `help wanted`).

1. **Add `toBanglaOrdinal(n)`** — 1 → "প্রথম", 2 → "দ্বিতীয়", 3 → "তৃতীয়", … 10 → "দশম", and "১১তম" style after that. Include tests.
2. **Add Bangla time formatting** — `formatBanglaTime(date)` → "সকাল ১০টা ৩০ মিনিট" (ভোর/সকাল/দুপুর/বিকাল/সন্ধ্যা/রাত). Include tests.
3. **Add Bangladesh divisions & districts data** — export the 8 divisions and 64 districts with Bangla + English names (cite the source).
4. **Validate Bangladeshi postcodes** — `isValidPostcode("7000")` (4 digits) and, optionally, a lookup for district → postcode range.
5. **NID number format check** — `isValidNID(s)`: accept 10, 13 or 17 digit formats (format only, no lookup).
6. **`banglaMonthName(i, { en: true })`** — English transliterations ("Boishakh", "Joishtho" …) for the calendar.
7. **Add `toBanglaWeekday` / English weekday names** helper and document it.
8. **Python port** — start a `python/` folder with `taka_in_words` and `to_bangla_digits`, with pytest tests.
9. **Docs: add a CodeSandbox / StackBlitz demo link** to the README.
10. **Docs: translate the full README into Bangla** as `README.bn.md`.
