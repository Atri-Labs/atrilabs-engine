import React, { useMemo } from "react";
import { MissingIcon } from "./assets/MissingIcon";
import { gray200, smallText } from "@atrilabs/design-system";
import "./styles.css";

export type CommonIconsProps = {
  name: string;
  svg?: React.FC;
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
};

export const CommonIcon: React.FC<CommonIconsProps> = (props) => {
  const SVGComp = useMemo(() => {
    return props.svg ? <props.svg /> : <MissingIcon />;
  }, [props]);
  return (
    <div style={styles.container}>
      {SVGComp}
      <div style={{ ...smallText, color: gray200, paddingTop: "0.5rem" }}>
        {props.name}
      </div>
    </div>
  );
};
