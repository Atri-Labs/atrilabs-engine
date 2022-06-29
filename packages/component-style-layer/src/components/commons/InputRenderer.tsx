import React, { useState, useMemo, useCallback } from "react";
import { CssProprtyComponentType } from "../../types";
import {
  gray200,
  gray400,
  smallText,
  h5Heading,
} from "@atrilabs/design-system";
import { IconsContainer } from "./IconsContainer";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "0.5rem",
    borderBottom: "1px solid #111827",
  },
  header: {
    ...h5Heading,
    color: gray200,
    display: "flex",
    paddingBottom: "0.5rem",
    height: "25px",
    marginTop: "5px",
    paddingLeft: "0.5rem",
    userSelect: "none",
  },
  rectLabel: {
    ...smallText,
    color: gray400,
    display: "flex",
    textAlign: "center",
    lineHeight: "0px",
  },
  label: {
    marginTop: "0px",
    marginBottom: "10px",
  },
  drop: {
    display: "flex",
    alignItems: "baseline",
  },
  option: {
    display: "flex",
    height: "25px",
    marginBottom: "15px",
  },
  optionName: {
    ...smallText,
    width: "4rem",
    color: "white",
    display: "flex",
    alignItems: "center",
  },
  optionsIcons: {
    flexGrow: 1,
  },
};

function InputRenderer(props: {
    styleText: string;
    styleValue: number;
    styleItem: string;
    styleUnit: string | number;
    patchCb: CssProprtyComponentType["patchCb"];
  children: React.ReactNode[];
}) {
  const [index, setIndex] = useState(0);
  const styleValue = useMemo(() => {
    // It might happen that props.styles.styleArray is undefined
    // because user has not set any style array yet. This is true
    // for any other CSS property as well. In those cases, the property component,
    // like this Layout component, will set the default CSS property.
    if (props.styleValue === undefined) {
      // return the default CSS value index
      return 0;
    } else {
      // const index = props.styles.styleArray.findIndex(
      //   val => val === props.styles.styleItem
      // );
      // if (index >= 0) {
      //   return index;
      // } else {
      //   console.error(

      //     `component-style-layer cannot find a match for the already property. Please report this to Atri Labs team.`
      //   );
      //   return 0;
      // }
    //   const index = props.styles.styleValue;
      return index;
    }
  }, [index, props.styleValue]);

  const setStyleItemSelectedValueCb = useCallback(
    (index: number) => {
      // Calling patchCb informs the browser forest manager(editor's state manager)
      // to update the state and inform all subscribers about the state update.
      props.patchCb({
        property: { styles: { styleItem: index } },
      });
    },
    [props]
  );
  return (
    <div style={styles.option} key={props.styleItem}>
      <div style={styles.optionName}>{props.styleText}</div>
      <div style={styles.optionsIcons}>
        <input type="number" onChange={(e)=>setIndex(Number(e.target.value))}></input>
        <IconsContainer
          selectedIndex={styleValue}
          setSelectedIndexCb={setStyleItemSelectedValueCb}
          children={props.children}
        />
      </div>
    </div>
  );
}

export default InputRenderer;
