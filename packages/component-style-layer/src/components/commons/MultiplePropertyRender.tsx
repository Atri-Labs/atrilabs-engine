import { gray200, h5Heading, smallText } from "@atrilabs/design-system";
import React, { useMemo, useCallback } from "react";
import { IconsContainer } from "./IconsContainer";
import { CssProprtyComponentType } from "../../types";

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
    paddingLeft: "0.5rem",
    userSelect: "none",
  },
  option: {
    display: "flex",
    height: "25px",
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

function MultiplePropertyRender(props: {
  styleText: string;
  styleItems: (keyof React.CSSProperties)[];
  styleArray: (string | number)[];
  patchCb: CssProprtyComponentType["patchCb"];
  styles: CssProprtyComponentType["styles"];
  children: React.ReactNode[];
  defaultCSSIndex?: number;
}) {
  const styleIndex = useMemo(() => {
    // It might happen that props.styleArray is undefined
    // because user has not set any style array yet. This is true
    // for any other CSS property as well. In those cases, the property component,
    // like this Layout component, will set the default CSS property.
    const styleItem = props.styleItems[0];
    if (props.styles[styleItem] === undefined) {
      // return the default CSS value index
      return props.defaultCSSIndex || 0;
    } else {
      const index = props.styleArray.findIndex(
        (val) => val === props.styles[styleItem]
      );
      if (index >= 0) {
        return index;
      } else {
        console.error(
          `component-style-layer cannot find a match for the already property. Please report this to Atri Labs team.`
        );
        return 0;
      }
    }
  }, [props.styleArray, props.styleItems, props.styles, props.defaultCSSIndex]);

  const setStyleItemSelectedIndexCb = useCallback(
    (index: number) => {
      // Calling patchCb informs the browser forest manager(editor's state manager)
      // to update the state and inform all subscribers about the state update.
      const styles: { [key: string]: string | number } = {};
      props.styleItems.forEach((styleItem) => {
        styles[styleItem] = props.styleArray[index];
      });
      props.patchCb({
        property: {
          styles,
        },
      });
    },
    [props]
  );

  return (
    <div style={styles.option} key={props.styleItems[0]}>
      <div style={styles.optionName}>{props.styleText}</div>
      <div style={styles.optionsIcons}>
        <IconsContainer
          selectedIndex={styleIndex}
          setSelectedIndexCb={setStyleItemSelectedIndexCb}
          children={props.children}
          styleArray={props.styleArray}
        />
      </div>
    </div>
  );
}

export default MultiplePropertyRender;
