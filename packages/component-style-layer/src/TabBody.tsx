import { gray300, gray800, h1Heading } from "@atrilabs/design-system";
import React from "react";
import { Layout } from "./components/layout/Layout";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";

export type TabBodyProps = {
  alias: string;
  setAliasCb: (event: React.ChangeEvent<HTMLInputElement>) => void;
  patchCb: (slice: any) => void;
  styles: React.CSSProperties;
  treeOptions: CSSTreeOptions;
};

const styles: { [key: string]: React.CSSProperties } = {
  // top level container
  container: {
    display: "flex",
    flexDirection: "column",
  },

  // alias container
  aliasContainer: {
    ...h1Heading,
    color: gray300,
    padding: "0.5rem",
    borderBottom: `1px solid ${gray800}`,
    background: "transparent",
  },
};

export const TabBody: React.FC<TabBodyProps> = (props) => {
  return (
    <div style={styles.container}>
      <input
        style={styles.aliasContainer}
        onChange={props.setAliasCb}
        value={props.alias}
      />
      {props.treeOptions && props.treeOptions.flexContainerOptions ? (
        <Layout styles={props.styles} patchCb={props.patchCb} />
      ) : null}
    </div>
  );
};
