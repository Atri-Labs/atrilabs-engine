import { useMemo, forwardRef } from "react";
import { RadialbarChart } from "./RadiadbarChart";

export const DevRadialbarChart: typeof RadialbarChart = forwardRef(
  (props, ref) => {
    const custom = useMemo(() => {
      const data = [
        {
          name: "A",
          uv: 31.47,
        },
        {
          name: "B",
          uv: 26.69,
        },
        {
          name: "C",
          uv: 15.69,
        },
        {
          name: "D",
          uv: 8.22,
        },
        {
          name: "E",
          uv: 8.63,
        },
        {
          name: "F",
          uv: 2.63,
        },
      ];
      const options = {
        uv: { animate: false },
        pv: { animate: false },
        amt: { animate: false },
      };
      return { ...props.custom, data: data, options };
    }, [props.custom]);

    return <RadialbarChart {...props} ref={ref} custom={custom} />;
  }
);

export default DevRadialbarChart;
