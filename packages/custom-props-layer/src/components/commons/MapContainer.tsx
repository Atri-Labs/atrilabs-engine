import {
  ArrayMapCustomProp,
  MapCustomProp,
} from "@atrilabs/app-design-forest/lib/customPropsTree";
import React from "react";
import { useMemo } from "react";
import { usePageRoutes } from "../../hooks/usePageRoutes";
import { CommonPropTypeContainerTypes } from "../../types";
import { MapList } from "../map-list/MapList";
import { Map } from "../map/Map";

export const MapContainer: React.FC<CommonPropTypeContainerTypes> = (props) => {
  const { routes } = usePageRoutes();

  const propName = useMemo(() => {
    return props.propName;
  }, [props.propName]);

  const selector = useMemo(() => {
    return props.selector || [];
  }, [props]);

  const attributes = useMemo(() => {
    const mapCustomProps = props.treeOptions.dataTypes[
      propName
    ] as MapCustomProp;
    if (mapCustomProps !== undefined) return mapCustomProps.attributes;
    return props.attributes;
  }, [propName, props.attributes, props.treeOptions.dataTypes]);

  const singleObjectName = useMemo(() => {
    const mapCustomProps = props.treeOptions.dataTypes[
      propName
    ] as ArrayMapCustomProp;
    if (mapCustomProps !== undefined) return mapCustomProps.singleObjectName;
    return props.singleObjectName;
  }, [propName, props.singleObjectName, props.treeOptions.dataTypes]);

  if (props.propType === "map") {
    return (
      <Map
        {...props}
        selector={selector}
        attributes={attributes}
        propName={propName}
        key={propName}
        routes={routes}
      />
    );
  }
  if (props.propType === "array_map") {
    return (
      <MapList
        {...props}
        selector={selector}
        attributes={attributes}
        propName={propName}
        singleObjectName={singleObjectName}
        key={propName}
        routes={routes}
      />
    );
  }
  return <React.Fragment key={propName}></React.Fragment>;
};
