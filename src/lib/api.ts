export type GhgEmission = {
  yearMonth: string;
  source: string;
  emissions: number;
};

export type Company = {
  id: string;
  name: string;
  country: string;
  emissions: GhgEmission[];
};

export type Post = {
  id: string;
  title: string;
  resourceUid: string;
  dateTime: string;
  content: string;
};

export type Country = {
  code: string;
  name: string;
};

export const countries: Country[] = [
  { code: "US", name: "United States" },
  { code: "DE", name: "Germany" },
  { code: "KR", name: "Korea" },
  { code: "JP", name: "Japan" },
  { code: "FR", name: "France" },
];

export const companies: Company[] = [
  {
    id: "c1",
    name: "Acme Corp",
    country: "US",
    emissions: [
      { yearMonth: "2024-01", source: "gasoline", emissions: 120 },
      { yearMonth: "2024-02", source: "diesel", emissions: 110 },
      { yearMonth: "2024-03", source: "lpg", emissions: 95 },
      { yearMonth: "2024-04", source: "electric", emissions: 60 },
    ],
  },
  {
    id: "c2",
    name: "Globex",
    country: "DE",
    emissions: [
      { yearMonth: "2024-01", source: "diesel", emissions: 80 },
      { yearMonth: "2024-02", source: "gasoline", emissions: 105 },
      { yearMonth: "2024-03", source: "lpg", emissions: 120 },
      { yearMonth: "2024-04", source: "electric", emissions: 50 },
    ],
  },
  {
    id: "c3",
    name: "Apple KR",
    country: "KR",
    emissions: [
      { yearMonth: "2024-01", source: "diesel", emissions: 80 },
      { yearMonth: "2024-02", source: "gasoline", emissions: 105 },
      { yearMonth: "2024-03", source: "lpg", emissions: 120 },
      { yearMonth: "2024-04", source: "electric", emissions: 70 },
    ],
  },
  {
    id: "c4",
    name: "Banana KR",
    country: "KR",
    emissions: [
      { yearMonth: "2024-01", source: "diesel", emissions: 60 },
      { yearMonth: "2024-02", source: "gasoline", emissions: 85 },
      { yearMonth: "2024-03", source: "lpg", emissions: 90 },
      { yearMonth: "2024-04", source: "electric", emissions: 40 },
    ],
  },
  {
    id: "c5",
    name: "Nippon Tech",
    country: "JP",
    emissions: [
      { yearMonth: "2024-01", source: "gasoline", emissions: 100 },
      { yearMonth: "2024-02", source: "diesel", emissions: 90 },
      { yearMonth: "2024-03", source: "lpg", emissions: 110 },
      { yearMonth: "2024-04", source: "electric", emissions: 55 },
    ],
  },
  {
    id: "c6",
    name: "Paris Energy",
    country: "FR",
    emissions: [
      { yearMonth: "2024-01", source: "diesel", emissions: 70 },
      { yearMonth: "2024-02", source: "gasoline", emissions: 95 },
      { yearMonth: "2024-03", source: "lpg", emissions: 85 },
      { yearMonth: "2024-04", source: "electric", emissions: 45 },
    ],
  },
];

export const posts: Post[] = [
  {
    id: "p1",
    title: "Sustainability Report",
    resourceUid: "c1",
    dateTime: "2024-02",
    content: "Quarterly CO2 update for Acme Corp",
  },
  {
    id: "p2",
    title: "Emission Overview",
    resourceUid: "c2",
    dateTime: "2024-03",
    content: "Globex diesel consumption trends",
  },
  {
    id: "p3",
    title: "Quarterly Sustainability",
    resourceUid: "c3",
    dateTime: "2024-03",
    content: "Apple KR emissions report",
  },
  {
    id: "p4",
    title: "Carbon Footprint Analysis",
    resourceUid: "c5",
    dateTime: "2024-04",
    content: "Nippon Tech environmental impact summary",
  },
  {
    id: "p5",
    title: "Eco Report",
    resourceUid: "c6",
    dateTime: "2024-04",
    content: "Paris Energy CO2 reduction initiatives",
  },
];

const _countries = [...countries];
const _companies = [...companies];
let _posts = [...posts];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const jitter = () => 200 + Math.random() * 600;
const maybeFail = () => Math.random() < 0.15;

export async function fetchCountries() {
  await delay(jitter());
  return _countries;
}

export async function fetchCompanies() {
  await delay(jitter());
  return _companies;
}

export async function fetchPosts() {
  await delay(jitter());
  return _posts;
}

export async function createOrUpdatePost(
  p: Omit<Post, "id"> & { id?: string }
) {
  await delay(jitter());
  if (maybeFail()) throw new Error("Save failed");
  if (p.id) {
    _posts = _posts.map((x) => (x.id === p.id ? (p as Post) : x));
    return p as Post;
  }
  const created = { ...p, id: crypto.randomUUID() };
  _posts = [..._posts, created];
  return created;
}
