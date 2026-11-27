import { test } from "node:test";
import assert from "node:assert/strict";
import {
  wordsToNumber, numberToWords, toBanglaOrdinal, toBanglaDayOrdinal, timeAgo,
  isValidNIDFormat, isValidPostcode, parsePlate, isValidPlate, formatPlate,
  DIVISIONS, DISTRICTS, getDistrict, getDivision, getDistrictsByDivision,
} from "../dist/esm/index.js";

test("wordsToNumber basics", () => {
  assert.equal(wordsToNumber("এক লক্ষ পঁচিশ হাজার"), 125000);
  assert.equal(wordsToNumber("দুইশত পঞ্চাশ টাকা মাত্র"), 250);
  assert.equal(wordsToNumber("পাঁচশো"), 500);
  assert.equal(wordsToNumber("এক শ"), 100);
  assert.equal(wordsToNumber("৫ হাজার"), 5000);
  assert.equal(wordsToNumber("দেড় লাখ".replace("দেড়", "এক")), 100000);
  assert.equal(wordsToNumber("তিন কোটি"), 30000000);
  assert.equal(wordsToNumber("One Lakh Twenty-Five Thousand"), 125000);
  assert.equal(wordsToNumber("two crore fifty lakh"), 25000000);
  assert.equal(wordsToNumber("ঋণাত্মক পনেরো"), -15);
  assert.throws(() => wordsToNumber("আপেল"), /Unknown number word/);
  assert.equal(wordsToNumber("এক লক্ষ কোটি", { bigint: true }), 1000000000000n);
});

test("wordsToNumber is the inverse of numberToWords", () => {
  const samples = [0, 1, 9, 10, 19, 99, 100, 101, 250, 999, 1000, 1001, 12345, 99999, 100000, 125000,
    999999, 1234567, 9999999, 10000000, 12345678, 123456789, 1234567890, 98765432109];
  for (let i = 0; i < 300; i++) samples.push(Math.floor(Math.random() * 1e12));
  for (const n of samples) {
    assert.equal(wordsToNumber(numberToWords(n)), n, `bn ${n}`);
    assert.equal(wordsToNumber(numberToWords(n, { lang: "en" })), n, `en ${n}`);
  }
});

test("ordinals", () => {
  assert.equal(toBanglaOrdinal(1), "১ম");
  assert.equal(toBanglaOrdinal(2), "২য়");
  assert.equal(toBanglaOrdinal(4), "৪র্থ");
  assert.equal(toBanglaOrdinal(6), "৬ষ্ঠ");
  assert.equal(toBanglaOrdinal(10), "১০ম");
  assert.equal(toBanglaOrdinal(21), "২১তম");
  assert.equal(toBanglaOrdinal(3, { words: true }), "তৃতীয়");
  assert.equal(toBanglaOrdinal(25, { words: true }), "পঁচিশতম");
  assert.throws(() => toBanglaOrdinal(0));
});

test("day ordinals (১লা, ২রা ...)", () => {
  const expected = { 1: "১লা", 2: "২রা", 3: "৩রা", 4: "৪ঠা", 5: "৫ই", 18: "১৮ই", 19: "১৯শে", 21: "২১শে", 31: "৩১শে" };
  for (const [d, s] of Object.entries(expected)) assert.equal(toBanglaDayOrdinal(Number(d)), s);
  assert.throws(() => toBanglaDayOrdinal(32));
});

test("timeAgo", () => {
  const now = new Date(2026, 10, 27, 12, 0, 0);
  const ago = (s) => timeAgo(new Date(+now - s * 1000), { now });
  assert.equal(ago(10), "এইমাত্র");
  assert.equal(ago(5 * 60), "৫ মিনিট আগে");
  assert.equal(ago(3 * 3600), "৩ ঘণ্টা আগে");
  assert.equal(ago(2 * 86400), "২ দিন আগে");
  assert.equal(ago(14 * 86400), "২ সপ্তাহ আগে");
  assert.equal(ago(90 * 86400), "৩ মাস আগে");
  assert.equal(ago(800 * 86400), "২ বছর আগে");
  assert.equal(ago(-86400), "১ দিন পরে");
  assert.equal(timeAgo(+now - 300000, { now, digits: "en" }), "5 মিনিট আগে");
});

test("NID and postcode format", () => {
  assert.ok(isValidNIDFormat("1234567890"));
  assert.ok(isValidNIDFormat("১২৩৪৫৬৭৮৯০১২৩"));
  assert.ok(isValidNIDFormat("19901234567890123"));
  assert.ok(!isValidNIDFormat("12345"));
  assert.ok(isValidPostcode("7000"));
  assert.ok(isValidPostcode("১২০৫"));
  assert.ok(!isValidPostcode("0123"));
  assert.ok(!isValidPostcode("70000"));
});

test("vehicle plates", () => {
  assert.deepEqual(parsePlate("ঢাকা মেট্রো-গ ১২-৩৪৫৬"), { area: "ঢাকা", metro: true, classLetter: "গ", series: "12", number: "3456" });
  assert.deepEqual(parsePlate("কুষ্টিয়া-ল ১১-২২৩৩"), { area: "কুষ্টি\u09DFা", metro: false, classLetter: "ল", series: "11", number: "2233" });
  assert.ok(isValidPlate("চট্ট মেট্রো - হ 05 - 1234"));
  assert.ok(!isValidPlate("DHAKA 1234"));
  assert.equal(formatPlate(parsePlate("ঢাকা মেট্রো-গ 12-3456")), "ঢাকা মেট্রো-গ ১২-৩৪৫৬");
});

test("divisions and districts", () => {
  assert.equal(DIVISIONS.length, 8);
  assert.equal(DISTRICTS.length, 64);
  assert.equal(new Set(DISTRICTS.map((d) => d.id)).size, 64);
  for (const d of DISTRICTS) assert.ok(DIVISIONS.some((v) => v.id === d.division), d.name);
  assert.equal(getDistrict("কুষ্টিয়া")?.name, "Kushtia");
  assert.equal(getDistrict("কুষ্টি\u09AF\u09BCা")?.name, "Kushtia");
  assert.equal(getDistrict("Chittagong")?.bn, "চট্টগ্রাম");
  assert.equal(getDistrict("comilla")?.name, "Cumilla");
  assert.equal(getDistrict("Cox's Bazar")?.division, "chattogram");
  assert.equal(getDistrict("Atlantis"), undefined);
  assert.equal(getDivision("barisal")?.bn, "বরিশাল");
  assert.equal(getDistrictsByDivision("খুলনা").length, 10);
  assert.equal(getDistrictsByDivision("Dhaka").length, 13);
});
