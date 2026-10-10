import rawStations from "@/data/radio-stations.json";

export interface RadioStation {
  id: string;
  name: string;
  slug: string;
  href: string;
  logo: string;
  rating: number;
  country: string;
  genre: string;
  frequency: string;
  language: string;
  streamUrl: string;
  fallbackStreamUrl?: string;
}

export const radioStations: RadioStation[] = (rawStations as RadioStation[]).filter(
  (s) => Boolean(s.streamUrl && s.streamUrl.startsWith("http"))
);

export const TOP_FEATURED_SLUGS = [
  "mirchi",
  "vividh-bharati",
  "big",
  "fm-gold",
  "fm-rainbow",
  "city-91.1-fm",
  "red",
  "all-india-air-akashvani",
  "hungama-90s-once-again",
  "aaj-tak-radio",
  "hits-of-bollywood",
  "city-kishore-kumar",
];

export const GENRE_PRESETS = [
  { id: "all", label: "All Stations" },
  { id: "bollywood", label: "Bollywood & Hits" },
  { id: "air", label: "All India Radio (AIR)" },
  { id: "retro", label: "Retro & Golden Era" },
  { id: "news", label: "News & Talk" },
  { id: "regional", label: "Regional Indian" },
  { id: "devotional", label: "Devotional & Folk" },
] as const;

export function matchGenrePreset(station: RadioStation, presetId: string): boolean {
  if (presetId === "all") return true;
  const g = station.genre.toLowerCase();
  const n = station.name.toLowerCase();

  switch (presetId) {
    case "bollywood":
      return g.includes("bollywood") || g.includes("pop") || g.includes("indian music");
    case "air":
      return n.includes("all india radio") || n.includes("air") || n.includes("akashvani") || n.includes("vividh bharati");
    case "retro":
      return (
        g.includes("classic") ||
        g.includes("old songs") ||
        g.includes("retro") ||
        n.includes("90s") ||
        n.includes("rafi") ||
        n.includes("kishore") ||
        n.includes("evergreen")
      );
    case "news":
      return g.includes("news") || g.includes("talk") || n.includes("aaj tak") || n.includes("bbc");
    case "regional":
      return (
        station.language.toLowerCase().includes("punjabi") ||
        station.language.toLowerCase().includes("tamil") ||
        station.language.toLowerCase().includes("telugu") ||
        station.language.toLowerCase().includes("marathi") ||
        station.language.toLowerCase().includes("malayalam") ||
        station.language.toLowerCase().includes("bengali") ||
        station.language.toLowerCase().includes("gujarati") ||
        station.language.toLowerCase().includes("kannada") ||
        station.language.toLowerCase().includes("odia") ||
        station.language.toLowerCase().includes("assamese") ||
        station.language.toLowerCase().includes("urdu")
      );
    case "devotional":
      return g.includes("folk") || g.includes("devotional") || g.includes("bhakti") || g.includes("community");
    default:
      return true;
  }
}
