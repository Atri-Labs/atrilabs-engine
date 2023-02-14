import { useMemo, forwardRef } from "react";
import GanttChart from "./GanttChart";

const DevGanttChart: typeof GanttChart = forwardRef((props, ref) => {
  const custom = useMemo(() => {
    const data = [
      {
        startDate: new Date("Sun Dec 09 01:36:45 EST 2012"),
        endDate: new Date("Sun Dec 09 02:36:45 EST 2012"),
        name: "A Job",
        status: "FAILED",
      },

      {
        startDate: new Date("Sun Dec 09 01:56:32 EST 2012"),
        endDate: new Date("Sun Dec 09 06:35:47 EST 2012"),
        name: "B Job",
        status: "RUNNING",
      },
      {
        startDate: new Date("Sun Dec 09 04:56:32 EST 2012"),
        endDate: new Date("Sun Dec 09 06:35:47 EST 2012"),
        name: "C Job",
        status: "RUNNING",
      },
    ];
    const options = {
      margin: {
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      },
    };
    return { ...props.custom, data, options };
  }, [props.custom]);
  return <GanttChart {...props} ref={ref} custom={custom} />;
});

export default DevGanttChart;
