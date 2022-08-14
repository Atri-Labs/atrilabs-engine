import { PropsWithChildren } from "react";

export const PropertyContainer: React.FC<PropsWithChildren<{}>> = (props) => {
  return (
    <div
      style={{
        display: "grid",
        alignItems: "center",
        height: "32px",
        gridTemplateColumns: "5rem auto",
      }}
    >
      {props.children}
    </div>
  );
};
