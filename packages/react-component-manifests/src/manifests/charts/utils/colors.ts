import Color from "color";

export const palette: string[] = [
  "#FBBF24",
  "#38BDF8",
  "#FB923C",
  "#F87171",
  "#34D399",
  "#818CF8",
  "#C084FC",
  "#F472B6",
  "#FCD34D",
  "#7DD3FC",
  "#FDBA74",
  "#FCA5A5",
  "#6EE7B7",
  "#A3BFFA",
  "#D8B4FE",
  "#F9A8D4",
];

export const saturations: number[] = [0, 1, 0.8, 0.6, 0.4, 0.2];

export function getColorAt(index: number) {
  const numColors = palette.length;
  const selectedColorIndex = index % numColors;
  const numSaturations = saturations.length;
  const selectedSaturationIndex =
    Math.floor(index / numColors) % numSaturations;
  return Color(palette[selectedColorIndex])
    .saturate(saturations[selectedSaturationIndex])
    .hex();
}
