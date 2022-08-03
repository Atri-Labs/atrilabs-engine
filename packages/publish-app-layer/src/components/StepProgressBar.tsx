export type StepProgressBarProps = {
  steps: {
    name: string;
    color: string;
  }[];
};

export const StepProgressBar = (props: StepProgressBarProps) => {
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {props.steps.map((step) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "4rem",
              gap: "4px",
              alignItems: "center",
            }}
            key={step.name}
          >
            <span>{step.name}</span>
            <div
              style={{ background: step.color, height: "4px", width: "100%" }}
            ></div>
          </div>
        );
      })}
    </div>
  );
};
