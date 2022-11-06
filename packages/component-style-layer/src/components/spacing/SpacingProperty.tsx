import React, { useState, useCallback, useEffect } from "react";
import {
  gray200,
  gray800,
  gray100,
  gray50,
  smallText,
  h5Heading,
} from "@atrilabs/design-system";
import Spacing from "./Spacing";
import "./Spacing.css";
import { CssProprtyComponentType } from "../../types";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";
import { assign, createMachine } from "xstate";
import { useMachine } from "@xstate/react";
import { useMarginOverlay } from "./hooks/useMarginOverlay";
export const fillColor = "rgba(75, 85, 99, 0.4)";
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    paddingTop: "1.2rem",
    paddingBottom: "1.8rem",
    borderBottom: `1px solid ${gray800}`,
    rowGap: "1.2rem",
  },
  drop: {
    display: "flex",
    alignItems: "baseline",
    cursor: "pointer",
  },
  header: {
    ...h5Heading,
    color: gray200,
    display: "flex",
    paddingLeft: "0.5rem",
    userSelect: "none",
  },
  mainContainer: {
    position: "relative",
  },
  marginPaddingBoxContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  //Placeholders For Margin
  marginTopPlaceHolder: {
    ...smallText,
    position: "absolute",
    left: "95px",
    top: "1px",
    userSelect: "none",
    outline: "none",
    color: gray100,
    padding: "3px",
    backgroundColor: fillColor,
    width: "18px",
    border: "none",
    lineHeight: "10px",
  },
  marginBottomPlaceHolder: {
    ...smallText,
    position: "absolute",
    left: "95px",
    bottom: "0px",
    userSelect: "none",
    outline: "none",
    color: gray100,
    padding: "3px",
    backgroundColor: fillColor,
    width: "18px",
    border: "none",
    lineHeight: "10px",
  },
  marginRightPlaceHolder: {
    ...smallText,
    position: "absolute",
    left: "182px",
    top: "41px",
    userSelect: "none",
    outline: "none",
    color: gray100,
    padding: "3px",
    backgroundColor: fillColor,
    width: "18px",
    border: "none",
    lineHeight: "10px",
  },
  marginLeftPlaceHolder: {
    ...smallText,
    position: "absolute",
    left: "15px",
    top: "41px",
    userSelect: "none",
    outline: "none",
    color: gray100,
    padding: "3px",
    backgroundColor: fillColor,
    width: "18px",
    border: "none",
    lineHeight: "10px",
  },
  //Placeholders for Padding
  paddingTopPlaceHolder: {
    ...smallText,
    position: "absolute",
    left: "95px",
    top: "22px",
    userSelect: "none",
    outline: "none",
    color: gray100,
    padding: "3px",
    backgroundColor: fillColor,
    width: "18px",
    border: "none",
    lineHeight: "10px",
  },
  paddingBottomPlaceHolder: {
    ...smallText,
    position: "absolute",
    left: "95px",
    bottom: "23px",
    userSelect: "none",
    outline: "none",
    color: gray100,
    padding: "3px",
    backgroundColor: fillColor,
    width: "18px",
    border: "none",
    lineHeight: "10px",
  },
  paddingRightPlaceHolder: {
    ...smallText,
    position: "absolute",
    left: "145px",
    top: "41px",
    userSelect: "none",
    outline: "none",
    color: gray100,
    padding: "3px",
    backgroundColor: fillColor,
    width: "18px",
    border: "none",
    lineHeight: "10px",
  },
  paddingLeftPlaceHolder: {
    ...smallText,
    position: "absolute",
    left: "50px",
    top: "41px",
    userSelect: "none",
    outline: "none",
    color: gray100,
    padding: "3px",
    backgroundColor: fillColor,
    width: "18px",
    border: "none",
    lineHeight: "10px",
  },
  //Labels for Margin and Padding
  marginLabel: {
    ...smallText,
    color: gray50,
    position: "absolute",
    left: "10px",
    top: "-7px",
    userSelect: "none",
    pointerEvents: "none",
  },
  paddingLabel: {
    ...smallText,
    color: gray50,
    position: "absolute",
    left: "46px",
    top: "13px",
    userSelect: "none",
    pointerEvents: "none",
  },
};

//ACTIONS
const MOUSE_DOWN = "MOUSE_DOWN";
const MOUSE_MOVE = "MOUSE_MOVE";
const MOUSE_UP = "MOUSE_UP";
const MOUSE_LEAVE = "MOUSE_LEAVE";
//STATES
const dragging = "dragging";
// PADDING AREA TYPES
const paddingTopArea = "paddingTop" as "paddingTop";
const paddingBottomArea = "paddingBottom" as "paddingBottom";
const paddingRightArea = "paddingRight" as "paddingRight";
const paddingLeftArea = "paddingLeft" as "paddingLeft";
//MARGIN AREA TYPES
const marginTopArea = "marginTop" as "marginTop";
const marginBottomArea = "marginBottom" as "marginBottom";
const marginLeftArea = "marginLeft" as "marginLeft";
const marginRightArea = "marginRight" as "marginRight";

const mouseDownAction = assign({
  area: (_context: any, event: any) => {
    return event["area"];
  },
  initialMousePosition: (_context: any, event: any) => {
    if (
      [
        paddingTopArea,
        paddingBottomArea,
        marginTopArea,
        marginBottomArea,
      ].includes(event["area"])
    ) {
      return event["event"]["pageY"];
    }
    if (
      [
        paddingRightArea,
        paddingLeftArea,
        marginLeftArea,
        marginRightArea,
      ].includes(event["area"])
    ) {
      return event["event"]["pageX"];
    }
  },
  finalMousePosition: (_context: any, event: any) => {
    if (
      [
        paddingTopArea,
        paddingBottomArea,
        marginTopArea,
        marginBottomArea,
      ].includes(event["area"])
    ) {
      return event["event"]["pageY"];
    }
    if (
      [
        paddingRightArea,
        paddingLeftArea,
        marginLeftArea,
        marginRightArea,
      ].includes(event["area"])
    ) {
      return event["event"]["pageX"];
    }
  },
  initialValue: (_context: any, event: any) => {
    return event["initialValue"];
  },
}) as any;
const mouseMoveAction = assign({
  finalMousePosition: (context: any, event: any) => {
    if (
      [
        paddingTopArea,
        paddingBottomArea,
        marginTopArea,
        marginBottomArea,
      ].includes(context["area"])
    ) {
      return event["event"]["pageY"];
    }
    if (
      [
        paddingRightArea,
        paddingLeftArea,
        marginLeftArea,
        marginRightArea,
      ].includes(context["area"])
    ) {
      return event["event"]["pageX"];
    }
  },
}) as any;
const resetAction = assign({
  area: () => {
    return "";
  },
  initialMousePosition: () => {
    return 0;
  },
  finalMousePosition: () => {
    return 0;
  },
  initialValue: () => {
    return 0;
  },
});
const dragMachine = createMachine({
  id: "dragMachine",
  context: {
    area: "",
    initialValue: 0,
    initialMousePosition: 0, // event.pageY event.pageX
    finalMousePosition: 0, // event.pageY event.pageX
  },
  initial: "idle",
  states: {
    idle: {
      on: {
        [MOUSE_DOWN]: {
          target: dragging,
          actions: [mouseDownAction],
        },
      },
    },
    [dragging]: {
      on: {
        [MOUSE_MOVE]: { target: dragging, actions: [mouseMoveAction] },
        [MOUSE_UP]: { target: "idle", actions: [resetAction] },
        [MOUSE_LEAVE]: { target: "idle", actions: [resetAction] },
      },
    },
  },
});

function convertSizeWithUnitsToString(size: string) {
  return !isNaN(parseFloat(size)) ? parseFloat(size).toString() : "";
}

function convertSizeWithUnitsToStringWithUnits(size: string) {
  return !isNaN(parseFloat(size)) ? parseFloat(size).toString() + "px" : "";
}

// SpacingProperty is a controlled component
const SpacingProperty: React.FC<CssProprtyComponentType> = (props) => {
  const [showProperties, setShowProperties] = useState(true);
  const [state, send] = useMachine(dragMachine);

  const marginTopVal = props.styles.marginTop?.toString() || "";
  const marginRightVal = props.styles.marginRight?.toString() || "";
  const marginLeftVal = props.styles.marginLeft?.toString() || "";
  const marginBottomVal = props.styles.marginBottom?.toString() || "";
  const paddingTopVal = props.styles.paddingTop?.toString() || "";
  const paddingRightVal = props.styles.paddingRight?.toString() || "";
  const paddingLeftVal = props.styles.paddingLeft?.toString() || "";
  const paddingBottomVal = props.styles.paddingBottom?.toString() || "";

  // callbacks for different areas
  const onMouseDownPaddingTop = useCallback(
    (event: React.MouseEvent) => {
      send({
        type: MOUSE_DOWN,
        event: event,
        area: paddingTopArea,
        initialValue: parseInt(paddingTopVal || "0"),
      });
    },
    [send, paddingTopVal]
  );
  const onMouseDownPaddingBottom = useCallback(
    (event: React.MouseEvent) => {
      send({
        type: MOUSE_DOWN,
        event: event,
        area: paddingBottomArea,
        initialValue: parseInt(paddingBottomVal || "0"),
      });
    },
    [send, paddingBottomVal]
  );
  const onMouseDownPaddingRight = useCallback(
    (event: React.MouseEvent) => {
      send({
        type: MOUSE_DOWN,
        event: event,
        area: paddingRightArea,
        initialValue: parseInt(paddingRightVal || "0"),
      });
    },
    [send, paddingRightVal]
  );
  const onMouseDownPaddingLeft = useCallback(
    (event: React.MouseEvent) => {
      send({
        type: MOUSE_DOWN,
        event: event,
        area: paddingLeftArea,
        initialValue: parseInt(paddingLeftVal || "0"),
      });
    },
    [send, paddingLeftVal]
  );
  const onMouseDownMarginTop = useCallback(
    (event: React.MouseEvent) => {
      send({
        type: MOUSE_DOWN,
        event: event,
        area: marginTopArea,
        initialValue: parseInt(marginTopVal || "0"),
      });
    },
    [send, marginTopVal]
  );
  const onMouseDownMarginBottom = useCallback(
    (event: React.MouseEvent) => {
      send({
        type: MOUSE_DOWN,
        event: event,
        area: marginBottomArea,
        initialValue: parseInt(marginBottomVal || "0"),
      });
    },
    [send, marginBottomVal]
  );
  const onMouseDownMarginRight = useCallback(
    (event: React.MouseEvent) => {
      send({
        type: MOUSE_DOWN,
        event: event,
        area: marginRightArea,
        initialValue: parseInt(marginRightVal || "0"),
      });
    },
    [send, marginRightVal]
  );
  const onMouseDownMarginLeft = useCallback(
    (event: React.MouseEvent) => {
      send({
        type: MOUSE_DOWN,
        event: event,
        area: marginLeftArea,
        initialValue: parseInt(marginLeftVal || "0"),
      });
    },
    [send, marginLeftVal]
  );

  // add temporary event listeners to window
  useEffect(() => {
    if (state.value === dragging) {
      const onMouseMove = (event: MouseEvent) => {
        send({ type: MOUSE_MOVE, event: event });
      };
      const onMouseUp = () => {
        send({ type: MOUSE_UP });
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
  }, [state.value, send]);

  // call patch only if the value has changed as compared to previous value
  // this will prevent un-necessary patchCb calls
  useEffect(() => {
    if (state.value !== dragging) return;
    const change =
      state.context["finalMousePosition"] -
      state.context["initialMousePosition"];
    const newValue = state.context.initialValue + change;
    const oldValue =
      props.styles[state.context["area"] as keyof React.CSSProperties];
    if (typeof oldValue === "string" && parseFloat(oldValue) !== newValue) {
      props.patchCb({
        property: { styles: { [state.context["area"]]: newValue + "px" } },
      });
    } else if (oldValue !== newValue) {
      props.patchCb({
        property: { styles: { [state.context["area"]]: newValue + "px" } },
      });
    }
  }, [state.context, state.value, props]);

  // show margin overlays when in draggin state
  const { createMarginOverlay, removeMarginOverlay } = useMarginOverlay();
  useEffect(() => {
    if (state.value === dragging) {
      // display overlay
      createMarginOverlay(props.compId);
    }
    if (state.value !== dragging) {
      // clean overlay
      removeMarginOverlay();
    }
  }, [props, state.value, createMarginOverlay, removeMarginOverlay]);

  const handleChangeMarginTop = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const attrValue = event.target.value;
    props.patchCb({
      property: {
        styles: { marginTop: convertSizeWithUnitsToStringWithUnits(attrValue) },
      },
    });
  };
  const handleChangeMarginRight = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const attrValue = event.target.value;
    props.patchCb({
      property: {
        styles: {
          marginRight: convertSizeWithUnitsToStringWithUnits(attrValue),
        },
      },
    });
  };
  const handleChangeMarginLeft = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const attrValue = event.target.value;
    props.patchCb({
      property: {
        styles: {
          marginLeft: convertSizeWithUnitsToStringWithUnits(attrValue),
        },
      },
    });
  };
  const handleChangeMarginBottom = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const attrValue = event.target.value;
    props.patchCb({
      property: {
        styles: {
          marginBottom: convertSizeWithUnitsToStringWithUnits(attrValue),
        },
      },
    });
  };
  const handleChangePaddingTop = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const attrValue = event.target.value;
    props.patchCb({
      property: {
        styles: {
          paddingTop: convertSizeWithUnitsToStringWithUnits(attrValue),
        },
      },
    });
  };
  const handleChangePaddingRight = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const attrValue = event.target.value;
    props.patchCb({
      property: {
        styles: {
          paddingRight: convertSizeWithUnitsToStringWithUnits(attrValue),
        },
      },
    });
  };
  const handleChangePaddingLeft = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const attrValue = event.target.value;
    props.patchCb({
      property: {
        styles: {
          paddingLeft: convertSizeWithUnitsToStringWithUnits(attrValue),
        },
      },
    });
  };
  const handleChangePaddingBottom = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const attrValue = event.target.value;
    props.patchCb({
      property: {
        styles: {
          paddingBottom: convertSizeWithUnitsToStringWithUnits(attrValue),
        },
      },
    });
  };

  return (
    <div
      style={{
        ...styles.container,
        userSelect: state.value === dragging ? "none" : "auto",
      }}
    >
      <div style={styles.drop}>
        <DropDownArrow
          onClick={() => setShowProperties(!showProperties)}
          style={
            !showProperties
              ? { transform: "rotate(-90deg)" }
              : { transform: "rotate(0deg)" }
          }
        />
        <div style={styles.header}>Spacing</div>
      </div>
      <div style={showProperties ? { display: "block" } : { display: "none" }}>
        <main style={styles.mainContainer}>
          <div style={styles.marginPaddingBoxContainer}>
            {/*Margin PlaceHolders*/}
            <input
              value={convertSizeWithUnitsToString(marginTopVal) || ""}
              onChange={handleChangeMarginTop}
              placeholder={convertSizeWithUnitsToString(marginTopVal) || "0"}
              style={styles.marginTopPlaceHolder}
            />
            <input
              value={convertSizeWithUnitsToString(marginRightVal) || ""}
              onChange={handleChangeMarginRight}
              placeholder={convertSizeWithUnitsToString(marginRightVal) || "0"}
              style={styles.marginRightPlaceHolder}
            />
            <input
              value={convertSizeWithUnitsToString(marginBottomVal) || ""}
              onChange={handleChangeMarginBottom}
              placeholder={convertSizeWithUnitsToString(marginBottomVal) || "0"}
              style={styles.marginBottomPlaceHolder}
            />

            <input
              value={convertSizeWithUnitsToString(marginLeftVal) || ""}
              onChange={handleChangeMarginLeft}
              placeholder={convertSizeWithUnitsToString(marginLeftVal) || "0"}
              style={styles.marginLeftPlaceHolder}
            />
            {/*Padding Placeholders*/}
            <input
              value={convertSizeWithUnitsToString(paddingTopVal) || ""}
              onChange={handleChangePaddingTop}
              placeholder={convertSizeWithUnitsToString(paddingTopVal) || "0"}
              style={styles.paddingTopPlaceHolder}
            />

            <input
              value={convertSizeWithUnitsToString(paddingRightVal) || ""}
              onChange={handleChangePaddingRight}
              placeholder={convertSizeWithUnitsToString(paddingRightVal) || "0"}
              style={styles.paddingRightPlaceHolder}
            />

            <input
              value={convertSizeWithUnitsToString(paddingBottomVal) || ""}
              onChange={handleChangePaddingBottom}
              placeholder={
                convertSizeWithUnitsToString(paddingBottomVal) || "0"
              }
              style={styles.paddingBottomPlaceHolder}
            />

            <input
              value={convertSizeWithUnitsToString(paddingLeftVal) || ""}
              onChange={handleChangePaddingLeft}
              placeholder={convertSizeWithUnitsToString(paddingLeftVal) || "0"}
              style={styles.paddingLeftPlaceHolder}
            />
            {/*Margin Label*/}
            <p style={styles.marginLabel}>Margin</p>
            {/* Padding Label */}
            <p style={styles.paddingLabel}>Padding</p>
            <Spacing
              onMouseDownMarginTop={onMouseDownMarginTop}
              onMouseDownMarginRight={onMouseDownMarginRight}
              onMouseDownMarginBottom={onMouseDownMarginBottom}
              onMouseDownMarginLeft={onMouseDownMarginLeft}
              onMouseDownPaddingTop={onMouseDownPaddingTop}
              onMouseDownPaddingRight={onMouseDownPaddingRight}
              onMouseDownPaddingBottom={onMouseDownPaddingBottom}
              onMouseDownPaddingLeft={onMouseDownPaddingLeft}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SpacingProperty;
