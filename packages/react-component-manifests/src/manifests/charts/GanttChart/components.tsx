import React from "react";
export const convertTasksToRechartsData = (tasks: task[]) => {
  const minTimestamp: number = tasks[0].startDate.valueOf() as number;
  return tasks.map((task: any) => {
    const startTimestamp: number = task.startDate.getTime();
    const duration: number = task.endDate.valueOf() - startTimestamp;
    return {
      ...task,
      value: startTimestamp - minTimestamp + duration / 2,
    };
  });
};
export const noLine = () => ({
  lineStart() {},
  lineEnd() {},
  point(x: number, y: number) {},
});
export const CustomizedDot: React.FC<CustomizedDotProp> = ({
  cx,
  cy,
  payload,
}) => {
  // REFERENCE : https://recharts.org/en-US/examples/CustomizedDotLineChart
  const height = 16;
  const width = 80;
  return (
    <rect
      width={width}
      height={height}
      x={cx - width / 2}
      y={cy - height / 2}
      fill={payload.status === "FAILED" ? "red" : "green"}
    />
  );
};

type task = {
  [key: string]: number | string | Date;
};
type CustomizedDotProp = {
  cx: number;
  cy: number;
  payload: task;
};
