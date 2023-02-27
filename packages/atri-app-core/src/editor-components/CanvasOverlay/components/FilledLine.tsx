export type FilledLineProps = {
  fill: string;
};

export const FilledLine: React.FC<FilledLineProps> = (props) => {
  return (
    <div
      style={{ background: props.fill, height: "100%", width: "100%" }}
    ></div>
  );
};
