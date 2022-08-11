import { useMemo } from "react";
import { CandleStickData, CandleStickPlot } from "./types";

export const useCandleStickPlot = (
  boxPlots: CandleStickPlot[]
): CandleStickData[] => {
  const data = useMemo(
    () =>
      boxPlots.map((v) => {
        return {
          min: v.min,
          bottomWhisker: v.lowerQuartile - v.min,
          bottomBox: v.median - v.lowerQuartile,
          topBox: v.upperQuartile - v.median,
          topWhisker: v.max - v.upperQuartile,
          average: v.average,
          size: 500,
          name: v.name,
        };
      }),
    [boxPlots]
  );

  return data;
};
