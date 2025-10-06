type BluePalette = "500";
type GreyPalette = "200" | "300" | "650" | "850";

type BlueShades = `blue-${BluePalette}`;
type GreyShades = `grey-${GreyPalette}`;
type Shades =
  | BlueShades
  | GreyShades
  | "turquoise"
  | "icon"
  | "alert-border"
  | "alert";

export const dashboardColors: ReadonlyMap<Shades, string> = new Map([
  ["blue-500", "#0B3EE3"],
  ["grey-200", "#D2D6E3"],
  ["grey-300", "#BBC2D6"],
  ["grey-650", "#636B82"],
  ["grey-850", "#2B2E38"],
  ["turquoise", "#EDFCFC"],
  ["icon", "#215C76"],
  ["alert-border", "#89D9FC"],
  ["alert", "#E0F5FE"],
]);
