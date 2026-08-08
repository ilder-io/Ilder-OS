/**
 * Central place for the raw color values Recharts needs (it cannot consume
 * Tailwind classes or `hsl(var(--x))` directly in SVG fill/stroke props on
 * the server-rendered path, so we mirror the token values here). Keep this
 * in sync with the CSS custom properties in globals.css.
 */
export const CHART_COLORS = {
  primary: "#7C7DF5",
  primaryMuted: "rgba(124,125,245,0.15)",
  success: "#34D399",
  warning: "#FBBF24",
  destructive: "#F87171",
  grid: "#232329",
  axis: "#6B6B76",
  series: ["#7C7DF5", "#2DD4BF", "#FBBF24", "#FB7185", "#60A5FA", "#A78BFA"],
};

export const CHART_TOOLTIP_STYLE = {
  background: "#1B1B1F",
  border: "1px solid #232329",
  borderRadius: "8px",
  fontSize: "12px",
  padding: "8px 10px",
  boxShadow: "0 8px 30px -6px rgb(0 0 0 / 0.5)",
};
