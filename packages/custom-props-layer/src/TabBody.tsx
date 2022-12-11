import { gray300, gray800, h1Heading } from "@atrilabs/design-system";
import React, { useMemo } from "react";
import { TabBodyProps } from "./types";
import {
  ArrayTypedMapCustomProp,
  TypedMapCustomProp,
} from "@atrilabs/app-design-forest/lib/customPropsTree";
import { CommonPropTypeContainer } from "./components/commons/CommonPropTypeContainer";
import { usePageRoutes } from "./hooks/usePageRoutes";
import { TypedMap } from "./components/typed-map/TypedMap";
import { MapContainer } from "./components/commons/MapContainer";
import { TypedMapList } from "./components/typed-map-list/TypedMapList";

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
        if (propType === "map" || propType === "array_map") {
          return (
            <MapContainer
              {...props}
              selector={[propName]}
              propType={propType}
              propName={propName}
              key={propName}
              routes={routes}
            />
          );
        }
        if (propType === "typed_map") {
          const typedMapCustomProps = props.treeOptions.dataTypes[
            propName
          ] as TypedMapCustomProp;
          const attributes = typedMapCustomProps.attributes;
          return (
            <TypedMap
              {...props}
              selector={[propName]}
              attributes={attributes}
              propName={propName}
              key={propName}
              routes={routes}
            />
          );
        }
        if (propType === "array_typed_map") {
          const typedMapCustomProps = props.treeOptions.dataTypes[
            propName
          ] as ArrayTypedMapCustomProp;
          const attributes = typedMapCustomProps.attributes;
          return (
            <TypedMapList
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
