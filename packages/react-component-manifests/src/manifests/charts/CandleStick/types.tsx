// BoxPlot/CandleStickPlot code referenced from https://github.com/recharts/recharts/issues/369

export type CandleStickData = {
  min: number;
  bottomWhisker: number;
  bottomBox: number;
  topBox: number;
  topWhisker: number;
  average?: number;
  size: number; // for average dot size
  name?: string;
};

export type CandleStickPlot = {
  min: number;
  lowerQuartile: number;
  median: number;
  upperQuartile: number;
  max: number;
  average?: number;
  name?: string;
};
