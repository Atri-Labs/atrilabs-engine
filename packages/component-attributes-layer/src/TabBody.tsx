import {gray300, gray800, h1Heading} from "@atrilabs/design-system";
import React, {useMemo} from "react";
import {TabBodyProps} from "./types";
import {usePageRoutes} from "./hooks/usePageRoutes";
import {Text} from "./components/text/Text";


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
  const propNames = useMemo(() => {
    return Object.keys(props.attrs);
  }, [props]);

  const {routes} = usePageRoutes();

  return (
    <div style={styles.container}>
      {propNames.map((propName) =>
        <Text
          {...props}
          selector={[propName]}
          propName={propName}
          routes={routes}
          key={propName}
        />)}

    </div>
  );
};
