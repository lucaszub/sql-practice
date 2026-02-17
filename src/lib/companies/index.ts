export interface CompanySummary {
  id: string;
  name: string;
  tagline: string;
  taglineFr: string;
  sector: string;
  sectorFr: string;
  icon: string;
  track: string;
  trackFr: string;
  ready: boolean;
}

export type { CompanyProfile } from "./types";

export function getCompanyProfile(id: string) {
  // Lazy-load to avoid bundling all companies upfront
  const loaders: Record<string, () => Promise<{ default: CompanyProfile } | Record<string, CompanyProfile>>> = {
    "neon-cart": () => import("./neon-cart").then((m) => ({ default: m.neonCart })),
    dataflow: () => import("./dataflow").then((m) => ({ default: m.dataflow })),
    pixelads: () => import("./pixelads").then((m) => ({ default: m.pixelAds })),
    cashbee: () => import("./cashbee").then((m) => ({ default: m.cashBee })),
    talenthub: () => import("./talenthub").then((m) => ({ default: m.talentHub })),
    cloudforge: () => import("./cloudforge").then((m) => ({ default: m.cloudForge })),
    freshbowl: () => import("./freshbowl").then((m) => ({ default: m.freshBowl })),
    streampulse: () => import("./streampulse").then((m) => ({ default: m.streamPulse })),
  };
  const loader = loaders[id];
  if (!loader) return null;
  return loader().then((m) => (m as { default: CompanyProfile }).default);
}

import type { CompanyProfile } from "./types";

export const companies: CompanySummary[] = [
  {
    id: "neon-cart",
    name: "NeonCart",
    tagline: "The futuristic e-commerce for geeks",
    taglineFr: "L'e-commerce futuriste pour geeks",
    sector: "E-commerce",
    sectorFr: "E-commerce",
    icon: "🛒",
    track: "DA Beginner–Intermediate",
    trackFr: "DA Debutant–Intermediaire",
    ready: true,
  },
  {
    id: "dataflow",
    name: "DataFlow",
    tagline: "The CRM salespeople actually use",
    taglineFr: "Le CRM que les commerciaux utilisent vraiment",
    sector: "SaaS B2B",
    sectorFr: "SaaS B2B",
    icon: "🔄",
    track: "DA Intermediate–Advanced",
    trackFr: "DA Intermediaire–Avance",
    ready: true,
  },
  {
    id: "pixelads",
    name: "PixelAds",
    tagline: "Your ads, our pixels, your growth",
    taglineFr: "Vos pubs, nos pixels, votre croissance",
    sector: "Marketing / Adtech",
    sectorFr: "Marketing / Adtech",
    icon: "📊",
    track: "DA Intermediate",
    trackFr: "DA Intermediaire",
    ready: true,
  },
  {
    id: "cashbee",
    name: "CashBee",
    tagline: "The bank that never sleeps",
    taglineFr: "La banque qui ne dort jamais",
    sector: "Fintech",
    sectorFr: "Fintech / Neobanque",
    icon: "🐝",
    track: "DA Advanced",
    trackFr: "DA Avance",
    ready: true,
  },
  {
    id: "talenthub",
    name: "TalentHub",
    tagline: "We don't recruit resumes, we recruit humans",
    taglineFr: "On ne recrute pas des CV, on recrute des humains",
    sector: "HR / Recruitment",
    sectorFr: "RH / Recrutement",
    icon: "👥",
    track: "DA Intermediate",
    trackFr: "DA Intermediaire",
    ready: true,
  },
  {
    id: "cloudforge",
    name: "CloudForge",
    tagline: "Your data, our forge",
    taglineFr: "Vos donnees, notre forge",
    sector: "Data Platform",
    sectorFr: "Data Platform",
    icon: "⚒️",
    track: "DE Intermediate–Advanced",
    trackFr: "DE Intermediaire–Avance",
    ready: true,
  },
  {
    id: "freshbowl",
    name: "FreshBowl",
    tagline: "Fresh bowls, delivered warm",
    taglineFr: "Des bowls frais, livres chauds",
    sector: "Foodtech / Delivery",
    sectorFr: "Foodtech / Livraison",
    icon: "🥗",
    track: "DA Beginner",
    trackFr: "DA Debutant",
    ready: true,
  },
  {
    id: "streampulse",
    name: "StreamPulse",
    tagline: "The sound that pulses, the data that speaks",
    taglineFr: "Le son qui pulse, les donnees qui parlent",
    sector: "Streaming / Media",
    sectorFr: "Streaming / Media",
    icon: "🎵",
    track: "DA Intermediate–Advanced",
    trackFr: "DA Intermediaire–Avance",
    ready: true,
  },
];
