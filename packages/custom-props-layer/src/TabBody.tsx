import { gray300, gray800, h1Heading } from "@atrilabs/design-system";
import React, { useMemo } from "react";
import { TabBodyProps } from "./types";
import {
  ArrayMapCustomProp,
  MapCustomProp,
  VariableKeyMapCustomProp,
} from "@atrilabs/app-design-forest/lib/customPropsTree";
import { Map } from "./components/map/Map";
import { MapList } from "./components/map-list/MapList";
import { CommonPropTypeContainer } from "./components/commons/CommonPropTypeContainer";
import { usePageRoutes } from "./hooks/usePageRoutes";
import { VariableMap } from "./components/variable-map/VariableMap";

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
    return Object.keys(props.treeOptions.dataTypes);
  }, [props]);
  const { routes } = usePageRoutes();

  return (
    <div style={styles.container}>
      {propNames.map((propName) => {
        const propType = props.treeOptions.dataTypes[propName].type;
        if (propType === "map") {
          const mapCustomProps = props.treeOptions.dataTypes[
            propName
          ] as MapCustomProp;
          const attributes = mapCustomProps.attributes;
          return (
            <Map
              {...props}
              attributes={attributes}
              propName={propName}
              key={propName}
              routes={routes}
            />
          );
        }
        if (propType === "array_map") {
          const mapCustomProps = props.treeOptions.dataTypes[
            propName
          ] as ArrayMapCustomProp;
          const attributes = mapCustomProps.attributes;
          const singleObjectName = mapCustomProps.singleObjectName;
          return (
            <MapList
              {...props}
              selector={[propName]}
              attributes={attributes}
              propName={propName}
              singleObjectName={singleObjectName}
              key={propName}
              routes={routes}
            />
          );
        }
        if (propType === "variable_key_map") {
          const variableMapCustomProps = props.treeOptions.dataTypes[
            propName
          ] as VariableKeyMapCustomProp;
          const attributes = variableMapCustomProps.attributes;
          return (
            <VariableMap
              {...props}
              selector={[propName]}
              attributes={attributes}
              propName={propName}
              key={propName}
              routes={routes}
            />
          );
        }
        return (
          <CommonPropTypeContainer
            {...props}
            selector={[propName]}
            propType={propType}
            propName={propName}
            key={propName}
            routes={routes}
          />
        );
      })}
    </div>
  );
};
