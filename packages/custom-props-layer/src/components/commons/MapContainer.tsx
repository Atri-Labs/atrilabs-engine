import { MapCustomProp } from "@atrilabs/app-design-forest/lib/customPropsTree";
import React from "react";
import { useMemo } from "react";
import { usePageRoutes } from "../../hooks/usePageRoutes";
import { CommonPropTypeContainerTypes } from "../../types";
import { Map } from "../map/Map";

export const MapContainer: React.FC<CommonPropTypeContainerTypes> = (props) => {
  const { routes } = usePageRoutes();

  const propName = useMemo(() => {
    return props.propName;
  }, [props.propName]);

  const selector = useMemo(() => {
    return props.selector || [];
  }, [props]);

  const mapCustomProps = props.treeOptions.dataTypes[propName] as MapCustomProp;
  const attributes = mapCustomProps.attributes;

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
};
