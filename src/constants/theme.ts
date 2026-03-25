export const SpringTheme = {
  mode: "spring",
  bg: "#FFF5F7",
  card: "rgba(255, 255, 255, 0.85)",
  text: "#D81B60",
  accent: "#FF8DA1",
  muted: "#D81B60", // Match text for labels
  resCard: "rgba(255, 255, 255, 0.9)",
  particle: "🌸",
};

export const NightTheme = {
  mode: "night",
  bg: "#0F172A", // Deep Slate Blue (very modern)
  card: "rgba(30, 41, 59, 0.7)", // Slightly lighter slate
  text: "#F8FAFC", // Off-white for perfect readability
  accent: "#10B981", // Vibrant Emerald Green
  muted: "rgba(148, 163, 184, 0.2)", // Subtle Slate tint
  resCard: "rgba(16, 185, 129, 0.15)", // Translucent emerald glow
  particle: "✨", // Stars feel better in this theme
};

// Define a type based on one of the themes for TypeScript safety elsewhere
export type AppTheme = typeof SpringTheme;
