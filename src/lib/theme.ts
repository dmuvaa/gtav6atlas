/** Leonida / GTA VI–inspired accents (fan project — not official Rockstar branding) */
export const LEONIDA = {
  night: "#08050f",
  dusk: "#120e24",
  panel: "#1a1530",
  pink: "#ff2d95",
  pinkBright: "#ff5cad",
  pinkDim: "#c9186e",
  coral: "#ff7a59",
  teal: "#3ee9c7",
  tealDim: "#2ab89a",
  gold: "#ffc14d",
  lavender: "#9d8ec7",
  mist: "#a8a3c4",
} as const;

export type CategoryAccent =
  | "pink"
  | "teal"
  | "coral"
  | "gold"
  | "lavender"
  | "violet";

export const CATEGORY_ACCENTS: Record<CategoryAccent, { border: string; glow: string; text: string }> = {
  pink: {
    border: "from-[#ff4da6]/50 via-transparent to-transparent",
    glow: "group-hover:shadow-[0_0_40px_-8px_rgba(255,77,166,0.45)]",
    text: "text-[#ff7cc4]",
  },
  teal: {
    border: "from-[#3ee9c7]/50 via-transparent to-transparent",
    glow: "group-hover:shadow-[0_0_40px_-8px_rgba(62,233,199,0.4)]",
    text: "text-[#5ef5d5]",
  },
  coral: {
    border: "from-[#ff7a59]/50 via-transparent to-transparent",
    glow: "group-hover:shadow-[0_0_40px_-8px_rgba(255,122,89,0.4)]",
    text: "text-[#ff9a7a]",
  },
  gold: {
    border: "from-[#ffc14d]/50 via-transparent to-transparent",
    glow: "group-hover:shadow-[0_0_40px_-8px_rgba(255,193,77,0.35)]",
    text: "text-[#ffd57a]",
  },
  lavender: {
    border: "from-[#9d8ec7]/50 via-transparent to-transparent",
    glow: "group-hover:shadow-[0_0_40px_-8px_rgba(157,142,199,0.35)]",
    text: "text-[#bdb0e0]",
  },
  violet: {
    border: "from-[#7b5cff]/45 via-transparent to-transparent",
    glow: "group-hover:shadow-[0_0_40px_-8px_rgba(123,92,255,0.35)]",
    text: "text-[#a894ff]",
  },
};