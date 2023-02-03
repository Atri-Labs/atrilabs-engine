import { useMemo, forwardRef } from "react";
import BarChart from "./BarChart";

const DevBarChart: typeof BarChart = forwardRef((props, ref) => {
  const custom = useMemo(() => {
    const data = [
      {
        x: "Page A",
        uv: 4000,
        pv: 2400,
        amt: 2400,
      },
      {
        x: "Page B",
        uv: 3000,
        pv: 1398,
        amt: 2210,
      },
      {
        x: "Page C",
        uv: 2000,
        pv: 9800,
        amt: 2290,
      },
      {
        x: "Page D",
        uv: 2780,
        pv: 3908,
        amt: 2000,
      },
      {
        x: "Page E",
        uv: 1890,
        pv: 4800,
        amt: 2181,
      },
      {
        x: "Page F",
        uv: 2390,
        pv: 3800,
        amt: 2500,
      },
      {
        x: "Page G",
        uv: 3490,
        pv: 4300,
        amt: 2100,
      },
    ];
    const options = {
      uv: { animate: false },
      pv: { animate: false },
      amt: { animate: false },
    };
    return { ...props.custom, data: data, options };
  }, [props.custom]);

  return <BarChart {...props} ref={ref} custom={custom} />;
});

export default DevBarChart;
