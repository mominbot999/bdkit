/**
 * The 8 divisions and 64 districts of Bangladesh with official English spellings
 * (including the 2018 spelling changes: Chattogram, Cumilla, Barishal, Jashore, Bogura).
 */

export interface Division {
  id: string;
  name: string;
  bn: string;
}

export interface District {
  id: string;
  name: string;
  bn: string;
  division: string;
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, "-");

export const DIVISIONS: readonly Division[] = [
  { id: "barishal", name: "Barishal", bn: "বরিশাল" },
  { id: "chattogram", name: "Chattogram", bn: "চট্টগ্রাম" },
  { id: "dhaka", name: "Dhaka", bn: "ঢাকা" },
  { id: "khulna", name: "Khulna", bn: "খুলনা" },
  { id: "mymensingh", name: "Mymensingh", bn: "ময়মনসিংহ" },
  { id: "rajshahi", name: "Rajshahi", bn: "রাজশাহী" },
  { id: "rangpur", name: "Rangpur", bn: "রংপুর" },
  { id: "sylhet", name: "Sylhet", bn: "সিলেট" },
];

// prettier-ignore
const RAW: [division: string, name: string, bn: string][] = [
  ["barishal", "Barguna", "বরগুনা"], ["barishal", "Barishal", "বরিশাল"], ["barishal", "Bhola", "ভোলা"], ["barishal", "Jhalokati", "ঝালকাঠি"], ["barishal", "Patuakhali", "পটুয়াখালী"], ["barishal", "Pirojpur", "পিরোজপুর"],
  ["chattogram", "Bandarban", "বান্দরবান"], ["chattogram", "Brahmanbaria", "ব্রাহ্মণবাড়িয়া"], ["chattogram", "Chandpur", "চাঁদপুর"], ["chattogram", "Chattogram", "চট্টগ্রাম"], ["chattogram", "Cumilla", "কুমিল্লা"], ["chattogram", "Cox's Bazar", "কক্সবাজার"], ["chattogram", "Feni", "ফেনী"], ["chattogram", "Khagrachhari", "খাগড়াছড়ি"], ["chattogram", "Lakshmipur", "লক্ষ্মীপুর"], ["chattogram", "Noakhali", "নোয়াখালী"], ["chattogram", "Rangamati", "রাঙ্গামাটি"],
  ["dhaka", "Dhaka", "ঢাকা"], ["dhaka", "Faridpur", "ফরিদপুর"], ["dhaka", "Gazipur", "গাজীপুর"], ["dhaka", "Gopalganj", "গোপালগঞ্জ"], ["dhaka", "Kishoreganj", "কিশোরগঞ্জ"], ["dhaka", "Madaripur", "মাদারীপুর"], ["dhaka", "Manikganj", "মানিকগঞ্জ"], ["dhaka", "Munshiganj", "মুন্সীগঞ্জ"], ["dhaka", "Narayanganj", "নারায়ণগঞ্জ"], ["dhaka", "Narsingdi", "নরসিংদী"], ["dhaka", "Rajbari", "রাজবাড়ী"], ["dhaka", "Shariatpur", "শরীয়তপুর"], ["dhaka", "Tangail", "টাঙ্গাইল"],
  ["khulna", "Bagerhat", "বাগেরহাট"], ["khulna", "Chuadanga", "চুয়াডাঙ্গা"], ["khulna", "Jashore", "যশোর"], ["khulna", "Jhenaidah", "ঝিনাইদহ"], ["khulna", "Khulna", "খুলনা"], ["khulna", "Kushtia", "কুষ্টিয়া"], ["khulna", "Magura", "মাগুরা"], ["khulna", "Meherpur", "মেহেরপুর"], ["khulna", "Narail", "নড়াইল"], ["khulna", "Satkhira", "সাতক্ষীরা"],
  ["mymensingh", "Jamalpur", "জামালপুর"], ["mymensingh", "Mymensingh", "ময়মনসিংহ"], ["mymensingh", "Netrokona", "নেত্রকোণা"], ["mymensingh", "Sherpur", "শেরপুর"],
  ["rajshahi", "Bogura", "বগুড়া"], ["rajshahi", "Chapainawabganj", "চাঁপাইনবাবগঞ্জ"], ["rajshahi", "Joypurhat", "জয়পুরহাট"], ["rajshahi", "Naogaon", "নওগাঁ"], ["rajshahi", "Natore", "নাটোর"], ["rajshahi", "Pabna", "পাবনা"], ["rajshahi", "Rajshahi", "রাজশাহী"], ["rajshahi", "Sirajganj", "সিরাজগঞ্জ"],
  ["rangpur", "Dinajpur", "দিনাজপুর"], ["rangpur", "Gaibandha", "গাইবান্ধা"], ["rangpur", "Kurigram", "কুড়িগ্রাম"], ["rangpur", "Lalmonirhat", "লালমনিরহাট"], ["rangpur", "Nilphamari", "নীলফামারী"], ["rangpur", "Panchagarh", "পঞ্চগড়"], ["rangpur", "Rangpur", "রংপুর"], ["rangpur", "Thakurgaon", "ঠাকুরগাঁও"],
  ["sylhet", "Habiganj", "হবিগঞ্জ"], ["sylhet", "Moulvibazar", "মৌলভীবাজার"], ["sylhet", "Sunamganj", "সুনামগঞ্জ"], ["sylhet", "Sylhet", "সিলেট"],
];

export const DISTRICTS: readonly District[] = RAW.map(([division, name, bn]) => ({ id: slug(name).replace(/-s-/, "s-"), name, bn, division }));

/** Former English spellings that are still common. */
const OLD_NAMES: Record<string, string> = {
  chittagong: "chattogram",
  comilla: "cumilla",
  barisal: "barishal",
  jessore: "jashore",
  bogra: "bogura",
  "coxs-bazar": "coxs-bazar",
  "cox-s-bazar": "coxs-bazar",
  netrakona: "netrokona",
  chapai: "chapainawabganj",
  "chapai-nawabganj": "chapainawabganj",
  maulvibazar: "moulvibazar",
  jhalakati: "jhalokati",
  jhalakathi: "jhalokati",
  narshingdi: "narsingdi",
  laxmipur: "lakshmipur",
  khagrachari: "khagrachhari",
};

const norm = (s: string) => s.normalize("NFC").replace(/\u09AF\u09BC/g, "\u09DF").replace(/\u09A1\u09BC/g, "\u09DC").replace(/\u09A2\u09BC/g, "\u09DD").trim();

/**
 * Find a district by its English name, Bangla name, id, or an old spelling.
 * getDistrict("কুষ্টিয়া")?.name → "Kushtia"; getDistrict("Chittagong")?.bn → "চট্টগ্রাম"
 */
export function getDistrict(name: string): District | undefined {
  const n = norm(name);
  const id = slug(n).replace(/-s-/, "s-").replace(/^-|-$/g, "");
  const resolved = OLD_NAMES[id] ?? id;
  return DISTRICTS.find((d) => d.bn === n || d.id === resolved);
}

/** Find a division by English name, Bangla name, id or old spelling. */
export function getDivision(name: string): Division | undefined {
  const n = norm(name);
  const id = slug(n).replace(/^-|-$/g, "");
  const resolved = OLD_NAMES[id] ?? id;
  return DIVISIONS.find((d) => d.bn === n || d.id === resolved);
}

/** All districts in a division (accepts the same inputs as getDivision). */
export function getDistrictsByDivision(division: string): District[] {
  const d = getDivision(division);
  return d ? DISTRICTS.filter((x) => x.division === d.id) : [];
}
