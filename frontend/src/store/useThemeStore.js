import { create } from "zustand";

const VALID_THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
]; // Add valid themes here

export const useThemeStore = create((set) => ({
  theme: VALID_THEMES.includes(localStorage.getItem("chat-theme"))
    ? localStorage.getItem("chat-theme")
    : "coffee", // Default to "coffee" if the theme in localStorage is invalid
  setTheme: (theme) => {
    // Only set the theme if it is valid
    if (VALID_THEMES.includes(theme)) {
      localStorage.setItem("chat-theme", theme);
      set({ theme });
    }
  },
}));
