import { gray300, gray800, h1Heading } from "@atrilabs/design-system";
import React, { useMemo } from "react";
import { TabBodyProps } from "./types";
import { Text } from "./components/text/Text";
import { StaticAsset } from "./components/static-asset/StaticAsset";
import { Boolean } from "./components/boolean/Boolean";
import { LargeText } from "./components/large-text/LargeText";
import { ListField } from "./components/list/ListField";
import { Number } from "./components/number/Number";
import { BooleanList } from "./components/boolean-list/BooleanList";
import { NumberList } from "./components/number-list/NumberList";
import { StaticAssetList } from "./components/static-asset-list/StaticAssetList";
import { Color } from "./components/color/Color";
import { InternalLink } from "./components/internal-link/InternalLink";
import { usePageRoutes } from "./hooks/usePageRoutes";
import { ComponentSelector } from "./components/component-selector/ComponentSelector";
import { ExternalLink } from "./components/external-link/ExternalLink";
import { Enum } from "./components/enum/Enum";
import { EnumCustomProp } from "@atrilabs/app-design-forest/lib/customPropsTree";

const styles: { [key: string]: React.CSSProperties } = {
  // top level container
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    rowGap: "0.5rem",
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
        if (propType === "text")
          return (
            <Text
              {...props}
              propName={propName}
              key={propName}
              routes={routes}
            />
          );
        if (propType === "static_asset")
          return (
            <StaticAsset
              {...props}
              propName={propName}
              key={propName}
              routes={routes}
            />
          );
        if (propType === "boolean")
          return (
            <Boolean
              {...props}
              propName={propName}
              key={propName}
              routes={routes}
            />
          );
        if (propType === "large_text")
          return (
            <LargeText
              {...props}
              propName={propName}
              key={propName}
              routes={routes}
            />
          );
        if (propType === "array")
          return (
            <ListField
              {...props}
              propName={propName}
              key={propName}
              routes={routes}
            />
          );
        if (propType === "number")
          return (
            <Number
              {...props}
              propName={propName}
              key={propName}
              routes={routes}
            />
          );
        if (propType === "array_boolean")
          return (
            <BooleanList
              {...props}
              propName={propName}
              key={propName}
              routes={routes}
            />
          );
        if (propType === "array_number")
          return (
            <NumberList
              {...props}
              propName={propName}
              key={propName}
              routes={routes}
            />
          );
        if (propType === "array_static_asset")
          return (
            <StaticAssetList
              {...props}
              propName={propName}
              key={propName}
              routes={routes}
            />
          );
        if (propType === "color")
          return (
            <Color
              {...props}
              propName={propName}
              key={propName}
              routes={routes}
            />
          );
        if (propType === "internal_link")
          return (
            <InternalLink
              {...props}
              propName={propName}
              key={propName}
              routes={routes}
            />
          );
        if (propType === "component_selector")
          return (
            <ComponentSelector
              {...props}
              propName={propName}
              key={propName}
              routes={routes}
            />
          );
        if (propType === "external_link")
          return (
            <ExternalLink
              {...props}
              propName={propName}
              key={propName}
              routes={routes}
            />
          );
        if (propType === "enum") {
          const enumCustomProps = props.treeOptions.dataTypes[
            propName
          ] as EnumCustomProp;
          const options = enumCustomProps.options;
          return (
            <Enum
              {...props}
              options={options}
              propName={propName}
              key={propName}
              routes={routes}
            />
          );
        }
        return <React.Fragment key={propName}></React.Fragment>;
      })}
    </div>
  );
};
