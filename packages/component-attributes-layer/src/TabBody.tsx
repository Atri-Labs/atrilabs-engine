import { gray300, gray800, h1Heading } from "@atrilabs/design-system";
import React from "react";
import { TabBodyProps } from "./types";
import { usePageRoutes } from "./hooks/usePageRoutes";
import { Basics } from "./components/basics/Basics";
import { AriaLabelledBy } from "./components/ariaLabelledBy/AriaLabelledBy";

const styles: { [key: string]: React.CSSProperties } = {
  // top level container
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    rowGap: "0.5rem",
    overflow: "auto",
    height: "100%",
    boxSizing: "border-box",
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

// This serves as a Higher Order Component to arrange different sections
// such as Spacing, Layout, Typography etc. of styles panel.
export const TabBody: React.FC<TabBodyProps> = (props) => {
  const { routes } = usePageRoutes();
  return (
    <div style={styles.container}>
      {props.treeOptions.basics && <Basics {...props} routes={routes} />}
      {props.treeOptions.ariaLabelledBy && (
        <AriaLabelledBy {...props} routes={routes} />
      )}
    </div>
  );
};
