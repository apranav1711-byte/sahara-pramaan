export type PensionerProfile = {
  id: string;
  name: string;
  phone: string;
  pensionId: string;
  preferredLanguage: "en" | "hi";
  dueDate: string;
  lastSubmitted: string;
  avatar: string;
  fingerprintMode: "fail" | "pass" | "mixed";
  family: {
    name: string;
    relationship: string;
    question: string;
    answer: string;
  };
};

export type Camp = {
  id: string;
  name: string;
  kind: "Post office" | "Bank support desk" | "Community centre";
  address: string;
  pincode: string;
  distanceKm: number;
  date: string;
  time: string;
};

export const seededPensioners: PensionerProfile[] = [
  {
    id: "pensioner-demo-fail",
    name: "Kamala Devi",
    phone: "9000000001",
    pensionId: "DEMO-FAIL",
    preferredLanguage: "hi",
    dueDate: "31 August 2026",
    lastSubmitted: "28 August 2025",
    avatar: "KD",
    fingerprintMode: "fail",
    family: {
      name: "Ananya Sharma",
      relationship: "Daughter",
      question: "What is the name of Kamala ji’s hometown?",
      answer: "Sundarpur",
    },
  },
  {
    id: "pensioner-demo-pass",
    name: "Ramesh Prasad",
    phone: "9000000002",
    pensionId: "DEMO-PASS",
    preferredLanguage: "en",
    dueDate: "12 September 2026",
    lastSubmitted: "10 September 2025",
    avatar: "RP",
    fingerprintMode: "pass",
    family: {
      name: "Vivek Prasad",
      relationship: "Son",
      question: "What is the name of Ramesh ji’s first school?",
      answer: "Shanti Vidyalaya",
    },
  },
  {
    id: "pensioner-demo-mixed",
    name: "Savitri Nair",
    phone: "9000000003",
    pensionId: "DEMO-MIXED",
    preferredLanguage: "en",
    dueDate: "24 September 2026",
    lastSubmitted: "21 September 2025",
    avatar: "SN",
    fingerprintMode: "mixed",
    family: {
      name: "Rohit Nair",
      relationship: "Grandson",
      question: "What is Savitri ji’s favorite flower?",
      answer: "Jasmine",
    },
  },
];

export const syntheticCamps: Camp[] = [
  { id: "camp-1", name: "Asha Seva Kendra", kind: "Community centre", address: "14 Lotus Lane, Sector 7", pincode: "110001", distanceKm: 0.8, date: "28 August 2026", time: "10:00 AM – 2:00 PM" },
  { id: "camp-2", name: "Green Park Support Desk", kind: "Bank support desk", address: "22 Market Road, Green Park", pincode: "110016", distanceKm: 2.3, date: "29 August 2026", time: "9:30 AM – 1:30 PM" },
  { id: "camp-3", name: "Nayi Disha Centre", kind: "Community centre", address: "8 Civic Square, Mayur Vihar", pincode: "110091", distanceKm: 4.1, date: "30 August 2026", time: "11:00 AM – 3:00 PM" },
  { id: "camp-4", name: "Sunrise Postal Desk", kind: "Post office", address: "5 Lake View Road, Lajpat Nagar", pincode: "110024", distanceKm: 5.2, date: "31 August 2026", time: "10:00 AM – 4:00 PM" },
  { id: "camp-5", name: "Sahara Samvaad Camp", kind: "Community centre", address: "19 Heritage Street, Karol Bagh", pincode: "110005", distanceKm: 6.4, date: "2 September 2026", time: "10:30 AM – 2:30 PM" },
  { id: "camp-6", name: "Pragati Assistance Desk", kind: "Bank support desk", address: "31 Station Road, Patel Nagar", pincode: "110008", distanceKm: 7.9, date: "3 September 2026", time: "9:00 AM – 12:30 PM" },
  { id: "camp-7", name: "Harit Nagar Postal Desk", kind: "Post office", address: "11 Garden Walk, Ashok Nagar", pincode: "110018", distanceKm: 8.5, date: "4 September 2026", time: "10:00 AM – 3:00 PM" },
  { id: "camp-8", name: "Sukoon Community Hall", kind: "Community centre", address: "48 Harmony Road, Dwarka", pincode: "110075", distanceKm: 11.2, date: "5 September 2026", time: "10:00 AM – 2:00 PM" },
];

export const syntheticCampDistances: Record<string, Record<string, number>> = {
  "110001": { "camp-1": 0.8, "camp-2": 2.3, "camp-3": 4.1, "camp-4": 5.2, "camp-5": 6.4, "camp-6": 7.9, "camp-7": 8.5, "camp-8": 11.2 },
  "110024": { "camp-4": 0.7, "camp-2": 2.8, "camp-5": 4.1, "camp-1": 4.4, "camp-6": 5.2, "camp-3": 7.1, "camp-7": 9.4, "camp-8": 12.6 },
  "110075": { "camp-8": 0.9, "camp-5": 3.1, "camp-3": 3.9, "camp-6": 4.6, "camp-2": 5.1, "camp-1": 6.5, "camp-4": 8.2, "camp-7": 9.8 },
};
