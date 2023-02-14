import { useMemo, forwardRef } from "react";
import PieChart from "./PieChart";

const DevPieChart: typeof PieChart = forwardRef((props, ref) => {
  const custom = useMemo(() => {
    const data = [
      [
        { name: "Group A", value: 400 },
        { name: "Group B", value: 300 },
        { name: "Group C", value: 300 },
        { name: "Group D", value: 200 },
      ],
      [
        { name: "A1", value: 100 },
        { name: "A2", value: 300 },
        { name: "B1", value: 100 },
        { name: "B2", value: 80 },
      ],
    ];
    const options = [
      {
        cx: "50%",
        cy: "50%",
        outerRadius: "40%",
        showLabel: true,
        animate: false,
      },
      {
        cx: "50%",
        cy: "50%",
        innerRadius: "65%",
        showLabel: true,
        animate: false,
      },
    ];
    return { ...props.custom, data, options };
  }, [props.custom]);

  return <PieChart {...props} ref={ref} custom={custom} />;
});

export default DevPieChart;
