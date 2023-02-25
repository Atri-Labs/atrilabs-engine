export type OpacityBoxProps = {
  opacity: number;
};

export const OpacityBox: React.FC<OpacityBoxProps> = (props) => {
  return (
    <div
      style={{
        opacity: props.opacity,
        height: "100%",
        width: "100%",
        backgroundColor: "white",
      }}
    ></div>
  );
};
