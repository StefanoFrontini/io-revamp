type BluePalette = "500";
type GreyPalette = "200" | "300" | "650" | "850";

type BlueShades = `blue-${BluePalette}`;
type GreyShades = `grey-${GreyPalette}`;
type Shades = BlueShades | GreyShades;

type BlueColor = "#0B3EE3";
type GreyColors = "#D2D6E3" | "#BBC2D6" | "#636B82" | "#2B2E38";
type Colors = BlueColor | GreyColors;

export const dashboardColors: ReadonlyMap<Shades, Colors> = new Map([
  ["blue-500", "#0B3EE3"],
  ["grey-200", "#D2D6E3"],
  ["grey-300", "#BBC2D6"],
  ["grey-650", "#636B82"],
  ["grey-850", "#2B2E38"],
]);
