import { gray200, smallText } from "@atrilabs/design-system";
import React, { useCallback, useMemo } from "react";
import { IconsContainer } from "../../IconsContainer";
import { ReactComponent as RightArrow } from "../../assets/right-arrow.svg";
import { ReactComponent as DownArrow } from "../../assets/down-arrow.svg";
import { ReactComponent as LeftArrow } from "../../assets/left-arrow.svg";
import { ReactComponent as UpArrow } from "../../assets/up-arrow.svg";
import { CssProprtyComponentType } from "../../types";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "0.5rem",
  },
  header: {
    ...smallText,
    color: gray200,
    paddingBottom: "0.5rem",
  },
  option: {
    display: "flex",
    height: "1.5rem",
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

// CSS Values for different CSS property (The default value must be at position 0)
// CSS values for flex-direction CSS property (The default value row is at position 0)
const directionValues = ["row", "column", "row-reverse", "column-reverse"];

// This serves as a Semi-Smart component, i.e. it uses useMemo but not useState or useRef.
export const Layout: React.FC<CssProprtyComponentType> = (props) => {
  const directionIndex = useMemo(() => {
    // It might happen that props.styles.flexDirection is undefined
    // because user has not set any flex direction yet. This is true
    // for any other CSS property as well. In those cases, the property component,
    // like this Layout component, will set the default CSS property.
    if (props.styles.flexDirection === undefined) {
      // return the default CSS value index
      return 0;
    } else {
      const index = directionValues.findIndex(
        (val) => val === props.styles.flexDirection
      );
      if (index >= 0) {
        return index;
      } else {
        console.error(
          `component-style-layer cannot find a match for the already set flex direction. Please report this to Atri Labs team.`
        );
        return 0;
      }
    }
  }, [props.styles.flexDirection]);

  const setDirectionSelectedIndexCb = useCallback(
    (index: number) => {
      // Calling patchCb informs the browser forest manager(editor's state manager)
      // to update the state and inform all subscribers about the state update.
      props.patchCb({
        property: { styles: { flexDirection: directionValues[index] } },
      });
    },
    [props]
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>Layout</div>
      <div style={styles.option}>
        <div style={styles.optionName}>Direction</div>
        <div style={styles.optionsIcons}>
          <IconsContainer
            selectedIndex={directionIndex}
            setSelectedIndexCb={setDirectionSelectedIndexCb}
          >
            <RightArrow />
            <DownArrow />
            <LeftArrow />
            <UpArrow />
          </IconsContainer>
        </div>
      </div>
      <div style={styles.option}>
        <div style={styles.optionName}>Align</div>
      </div>
      <div style={styles.option}>
        <div style={styles.optionName}>Justify</div>
      </div>
    </div>
  );
};
