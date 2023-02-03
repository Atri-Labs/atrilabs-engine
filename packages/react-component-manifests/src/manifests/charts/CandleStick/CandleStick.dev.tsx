import { useMemo, forwardRef } from "react";
import CandleStick from "./CandleStick";

export const DevCandleStickChart: typeof CandleStick = forwardRef(
  (props, ref) => {
    const custom = useMemo(() => {
      const data = [
        {
          min: 100,
          lowerQuartile: 200,
          median: 250,
          upperQuartile: 450,
          max: 650,
          average: 150,
          name: "Page A",
        },
        {
          min: 200,
          lowerQuartile: 400,
          median: 600,
          upperQuartile: 700,
          max: 800,
          average: 550,
          name: "Page B",
        },
        {
          min: 0,
          lowerQuartile: 200,
          median: 400,
          upperQuartile: 600,
          max: 800,
          average: 400,
          name: "Page C",
        },
      ];
      const options = {
        ...props.custom.options,
        animate: false,
      };
      return { ...props.custom, data, options };
    }, [props.custom]);

    return <CandleStick {...props} ref={ref} custom={custom} />;
  }
);

export default DevCandleStickChart;
