import {gray300, gray800, h1Heading, smallText} from "@atrilabs/design-system";
import React, {useMemo} from "react";
import {TabBodyProps} from "./types";
import {Label} from "./components/commons/Label";
import {TextInput} from "./components/commons/TextInput";
import {PropertyContainer} from "./components/commons/PropertyContainer";
import {usePageRoutes} from "./hooks/usePageRoutes";

;

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
  // const propNames = useMemo(() => {
  //   return Object.keys(props.treeOptions.dataTypes);
  // }, [props]);
  console.log("props in attrs", props);
  const {routes} = usePageRoutes();

  return (
    <div style={styles.container}>
      <PropertyContainer>
        <Label name="id"/>
        <TextInput value="attrs" onChange={() => {
        }}/>
      </PropertyContainer>
      <PropertyContainer>
        <Label name="aria-labelledby"/>
        <TextInput value="attrs" onChange={() => {
        }}/>
      </PropertyContainer>
      <PropertyContainer>
        <Label name="class"/>
        <TextInput value="attrs" onChange={() => {
        }}/>
      </PropertyContainer>

      {/*{propNames.map((propName) => {*/}
      {/*  const propType = props.treeOptions.dataTypes[propName].type;*/}
      {/*  if (propType === "map" || propType === "array_map") {*/}
      {/*    return (*/}
      {/*      <MapContainer*/}
      {/*        {...props}*/}
      {/*        selector={[propName]}*/}
      {/*        propType={propType}*/}
      {/*        propName={propName}*/}
      {/*        key={propName}*/}
      {/*        routes={routes}*/}
      {/*      />*/}
      {/*    );*/}
      {/*  }*/}
      {/*  if (propType === "typed_map") {*/}
      {/*    const typedMapCustomProps = props.treeOptions.dataTypes[*/}
      {/*      propName*/}
      {/*    ] as TypedMapCustomProp;*/}
      {/*    const attributes = typedMapCustomProps.attributes;*/}
      {/*    return (*/}
      {/*      <TypedMap*/}
      {/*        {...props}*/}
      {/*        selector={[propName]}*/}
      {/*        attributes={attributes}*/}
      {/*        propName={propName}*/}
      {/*        key={propName}*/}
      {/*        routes={routes}*/}
      {/*      />*/}
      {/*    );*/}
      {/*  }*/}
      {/*  if (propType === "array_typed_map") {*/}
      {/*    const typedMapCustomProps = props.treeOptions.dataTypes[*/}
      {/*      propName*/}
      {/*    ] as ArrayTypedMapCustomProp;*/}
      {/*    const attributes = typedMapCustomProps.attributes;*/}
      {/*    return (*/}
      {/*      <TypedMapList*/}
      {/*        {...props}*/}
      {/*        selector={[propName]}*/}
      {/*        attributes={attributes}*/}
      {/*        propName={propName}*/}
      {/*        key={propName}*/}
      {/*        routes={routes}*/}
      {/*      />*/}
      {/*    );*/}
      {/*  }*/}
      {/*  return (*/}
      {/*    <CommonPropTypeContainer*/}
      {/*      {...props}*/}
      {/*      selector={[propName]}*/}
      {/*      propType={propType}*/}
      {/*      propName={propName}*/}
      {/*      key={propName}*/}
      {/*      routes={routes}*/}
      {/*    />*/}
      {/*  );*/}
      {/*})}*/}
    </div>
  );
};
