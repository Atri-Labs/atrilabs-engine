import HistogramChart from "./HistogramChart";
import { forwardRef, useMemo } from "react";

const DevHistogramChart: typeof HistogramChart = forwardRef((props, ref) => {
  const custom = useMemo(() => {
    const data = [
      {
        x: 0,
        y: 4000,
      },
      {
        x: 1,
        y: 3000,
      },
      {
        x: 2,
        y: 2000,
      },
      {
        x: 3,
        y: 2780,
      },
      {
        x: 4,
        y: 1890,
      },
      {
        x: 5,
        y: 2390,
      },
      {
        x: 6,
        y: 3490,
      },
      {
        x: 7,
        y: 3000,
      },
      {
        x: 8,
        y: 2990,
      },
      {
        x: 9,
        y: 2590,
      },
      {
        x: 10,
        y: 2090,
      },
      {
        x: 11,
        y: 1890,
      },
      {
        x: 12,
        y: 1690,
      },
    ];
    const options = {
      line: { ...props.custom.options?.line, animate: false },
      bar: { ...props.custom.options?.bar, animate: false },
    };
    return { ...props.custom, data, options };
  }, [props.custom]);

  return <HistogramChart {...props} ref={ref} custom={custom} />;
});

export default DevHistogramChart;
