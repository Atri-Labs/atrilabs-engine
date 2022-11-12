import React from "react";
import { useMemo } from "react";
import { usePageRoutes } from "../../hooks/usePageRoutes";
import { CommonPropTypeContainerTypes } from "../../types";
import { StaticAsset } from "../static-asset/StaticAsset";
import { Text } from "../text/Text";
import { Boolean } from "../boolean/Boolean";
import { LargeText } from "../large-text/LargeText";
import { ListField } from "../list/ListField";
import { Number } from "../number/Number";
import { BooleanList } from "../boolean-list/BooleanList";
import { NumberList } from "../number-list/NumberList";
import { StaticAssetList } from "../static-asset-list/StaticAssetList";
import { Color } from "../color/Color";
import { InternalLink } from "../internal-link/InternalLink";
import { ComponentSelector } from "../component-selector/ComponentSelector";
import { ExternalLink } from "../external-link/ExternalLink";
import { EnumCustomProp } from "@atrilabs/app-design-forest/lib/customPropsTree";
import { Enum } from "../enum/Enum";
import { EnumList } from "../enum-list/EnumList";

export const CommonPropTypeContainer: React.FC<CommonPropTypeContainerTypes> = (
  props
) => {
  const { routes } = usePageRoutes();
  const propType = useMemo(() => {
    return props.propType;
  }, [props.propType]);
  const propName = useMemo(() => {
    return props.propName;
  }, [props.propName]);
  const selector = useMemo(() => {
    return props.selector || [];
  }, [props]);

  if (propType === "text")
    return (
      <Text
        {...props}
        selector={selector}
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
      <Boolean {...props} propName={propName} key={propName} routes={routes} />
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
      <Number {...props} propName={propName} key={propName} routes={routes} />
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
      <Color {...props} propName={propName} key={propName} routes={routes} />
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
    const options = props.options || enumCustomProps.options;

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
  if (propType === "array_enum") {
    const enumListCustomProps = props.treeOptions.dataTypes[
      propName
    ] as EnumCustomProp;
    const options = props.options || enumListCustomProps.options;

    return (
      <EnumList
        {...props}
        options={options}
        propName={propName}
        key={propName}
        routes={routes}
      />
    );
  }
  return <React.Fragment key={propName}></React.Fragment>;
};
