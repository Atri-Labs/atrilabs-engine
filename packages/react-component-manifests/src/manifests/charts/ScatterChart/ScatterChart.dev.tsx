import { forwardRef, useMemo } from "react";
import { SymbolType } from "recharts/types/util/types";
import ScatterChart from "./ScatterChart";

const DevScatterChart: typeof ScatterChart = forwardRef((props, ref) => {
  const custom = useMemo(() => {
    const data = [
      [
        { x: 100, y: 200, z: 400 },
        { x: 120, y: 100, z: 260 },
        { x: 170, y: 300, z: 400 },
        { x: 140, y: 250, z: 280 },
        { x: 150, y: 400, z: 500 },
        { x: 110, y: 280, z: 200 },
      ],
      [
        { x: 200, y: 260, z: 240 },
        { x: 240, y: 290, z: 220 },
        { x: 190, y: 290, z: 250 },
        { x: 198, y: 250, z: 210 },
        { x: 180, y: 280, z: 260 },
        { x: 210, y: 220, z: 230 },
      ],
    ];
    const options = [
      { name: "pv", shape: "circle" as SymbolType, animate: false },
      { name: "uv", shape: "cross" as SymbolType, animate: false },
    ];

    return {
      ...props.custom,
      data,
      options,
      zAxis: { range: [50, 200] as [number, number], show: true },
    };
  }, [props.custom]);

  return <ScatterChart {...props} ref={ref} custom={custom} />;
});

export default DevScatterChart;
