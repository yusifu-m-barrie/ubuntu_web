export const DISTRICT_CITIES = {
  Bo: ["Bo", "Bumpeh", "Koribondo", "Yamandu"],
  Bombali: ["Makeni", "Binkolo", "Kamabai", "Kagbere"],
  Bonthe: ["Bonthe", "Mattru Jong"],
  Falaba: ["Bendugu", "Mongo", "Gberia Fotombu"],
  Kailahun: ["Kailahun", "Koindu", "Daru", "Pendembu", "Segbwema"],
  Kambia: ["Kambia", "Rokupr", "Kukuna", "Mambolo"],
  Karene: ["Kamakwie", "Sella Limba"],
  Kenema: ["Kenema", "Blama", "Tongo", "Panguma"],
  Koinadugu: ["Kabala", "Fadugu", "Kurubonla"],
  Kono: ["Koidu", "Yengema", "Sewafe", "Tombodu"],
  Moyamba: ["Moyamba", "Taiama", "Shenge", "Rotifunk"],
  "Port Loko": ["Port Loko", "Lunsar", "Masiaka", "Lungi"],
  Pujehun: ["Pujehun", "Zimmi", "Potoru"],
  Tonkolili: ["Magburaka", "Mile 91", "Bumbuna", "Yonibana", "Masingbi"],
  "Western Area Rural": ["Waterloo", "Hastings", "Goderich", "Tombo", "York", "Hamilton", "Newton"],
  "Western Area Urban": ["Freetown"],
} as const;

export type DistrictName = keyof typeof DISTRICT_CITIES;

export const DISTRICTS = Object.keys(DISTRICT_CITIES) as DistrictName[];
