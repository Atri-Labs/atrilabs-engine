import { PropsWithChildren } from "react";

export const ArrayPropertyContainer: React.FC<PropsWithChildren<{}>> = (
  props
) => {
  return (
    <div
      style={{
        display: "grid",
        alignItems: "center",
        width: "100%",
        gridTemplateRows: "32px auto",
      }}
    >
      {props.children}
    </div>
  );
};
