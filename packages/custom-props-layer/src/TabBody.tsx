import { gray300, gray800, h1Heading } from "@atrilabs/design-system";
import React, { useMemo } from "react";
import { TabBodyProps } from "./types";
import { Text } from "./components/text/Text";
import { StaticAsset } from "./components/static-asset/StaticAsset";
import { Boolean } from "./components/boolean/Boolean";

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

// This serves as a Higher Order Component to arrange different sections
// such as Spacing, Layout, Typography etc. of styles panel.
export const TabBody: React.FC<TabBodyProps> = (props) => {
  const propNames = useMemo(() => {
    return Object.keys(props.treeOptions.dataTypes);
  }, [props]);
  console.log(props);
  return (
    <div style={styles.container}>
      {propNames.map((propName) => {
        const propType = props.treeOptions.dataTypes[propName];
        if (propType === "text")
          return <Text {...props} propName={propName} key={propName} />;
        if (propType === "static_asset")
          return <StaticAsset {...props} propName={propName} key={propName} />;
        if (propType === "boolean")
          return <Boolean {...props} propName={propName} key={propName} />;
        return <React.Fragment key={propName}></React.Fragment>;
      })}
    </div>
  );
};
