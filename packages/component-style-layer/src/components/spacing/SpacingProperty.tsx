import React, { useState, useCallback, useEffect } from "react";
import {
  gray200,
  gray800,
  gray50,
  smallText,
  h5Heading,
} from "@atrilabs/design-system";
import Spacing from "./Spacing";
import "./Spacing.css";
import { CssProprtyComponentType } from "../../types";

import { assign, createMachine } from "xstate";
import { useMachine } from "@xstate/react";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "0.5rem",
    borderBottom: `1px solid ${gray800}`,
  },
  header: {
    ...h5Heading,
    color: gray200,
    paddingBottom: "0.5rem",
  },
  mainContainer: {
    marginTop: "1rem",
    position: "relative",
  },
  marginPaddingBoxContainer: {
    // position: "absolute",
    marginLeft: "0.75rem",
  },
  //Placeholders For Margin
  marginTopPlaceHolder: {
    ...smallText,
    color: gray50,
    position: "absolute",
    left: "105px",
    top: "-8px",
  },
  marginBottomPlaceHolder: {
    ...smallText,
    color: gray50,
    position: "absolute",
    left: "105px",
    bottom: "-5px",
  },
  marginRightPlaceHolder: {
    ...smallText,
    color: gray50,
    position: "absolute",
    right: "24px",
    top: "35px",
  },
  marginLeftPlaceHolder: {
    ...smallText,
    color: gray50,
    position: "absolute",
    left: "24px",
    top: "35px",
  },
  //Placeholders for Padding
  paddingTopPlaceHolder: {
    ...smallText,
    color: gray50,
    position: "absolute",
    left: "105px",
    top: "15px",
  },
  paddingBottomPlaceHolder: {
    ...smallText,
    color: gray50,
    position: "absolute",
    left: "105px",
    bottom: "17px",
  },
  paddingRightPlaceHolder: {
    ...smallText,
    color: gray50,
    position: "absolute",
    right: "60px",
    top: "35px",
  },
  paddingLeftPlaceHolder: {
    ...smallText,
    color: gray50,
    position: "absolute",
    left: "60px",
    top: "35px",
  },
  //Labels for Margin and Padding
  marginLabel: {
    ...smallText,
    color: gray50,
    position: "absolute",
    left: "15px",
    top: "-8px",
  },
  paddingLabel: {
    ...smallText,
    color: gray50,
    position: "absolute",
    left: "52px",
    top: "13px",
  },
};

// const marginTop = 0;
// const marginDown = 0;
// const marginLeft = 0;
// const marginRight = 0;

// const paddingTop = 0;
// const paddingDown = 0;
// const paddingLeft = 0;
// const paddingRight = 0;

//ACTIONS
const MOUSE_DOWN = "MOUSE_DOWN";
const MOUSE_MOVE = "MOUSE_MOVE";
const MOUSE_UP = "MOUSE_UP";
const MOUSE_LEAVE = "MOUSE_LEAVE";
//STATES
const dragging = "dragging";
// PADDING AREA TYPES
const paddingTopArea = "paddingTopArea";
const paddingBottomArea = "paddingBottomArea";
const paddingRightArea = "paddingRightArea";
const paddingLeftArea = "paddingLeftArea";
//MARGIN AREA TYPES
const marginTopArea = "marginTopArea";
const marginBottomArea = "marginBottomArea";
const marginLeftArea = "marginLeftArea";
const marginRightArea = "marginRightArea";

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

const SpacingProperty: React.FC<CssProprtyComponentType> = (props) => {
  const [toggleClass, setToggleClass] = useState(true);
  const [state, send] = useMachine(dragMachine);

  const onMouseDownPaddingTop = useCallback(
    (event: React.MouseEvent) => {
      send({
        type: MOUSE_DOWN,
        event: event,
        area: paddingTopArea,
        initialValue: props.styles.paddingTop,
      });
    },
    [send, props]
  );
  const onMouseDownPaddingBottom = useCallback(
    (event: React.MouseEvent) => {
      send({
        type: MOUSE_DOWN,
        event: event,
        area: paddingBottomArea,
        initialValue: props.styles.paddingBottom,
      });
    },
    [send, props]
  );
  const onMouseDownPaddingRight = useCallback(
    (event: React.MouseEvent) => {
      send({
        type: MOUSE_DOWN,
        event: event,
        area: paddingRightArea,
        initialValue: props.styles.paddingRight,
      });
    },
    [send, props]
  );
  const onMouseDownPaddingLeft = useCallback(
    (event: React.MouseEvent) => {
      send({
        type: MOUSE_DOWN,
        event: event,
        area: paddingLeftArea,
        initialValue: props.styles.paddingLeft,
      });
    },
    [send, props]
  );

  const onMouseDownMarginTop = useCallback(
    (event: React.MouseEvent) => {
      console.log("Mouse Down On Margin Top");
      const onMouseMove = (event: MouseEvent) => {
        send({ type: MOUSE_MOVE, event: event });
      };
      const onMouseUp = () => {
        send({ type: MOUSE_UP, event: event });
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      send({
        type: MOUSE_DOWN,
        event: event,
        area: marginTopArea,
        initialValue: props.styles.marginTop,
      });
    },
    [send, props.styles.marginTop]
  );
  const onMouseDownMarginBottom = useCallback(
    (event: React.MouseEvent) => {
      send({
        type: MOUSE_DOWN,
        event: event,
        area: marginBottomArea,
        initialValue: props.styles.marginBottom,
      });
    },
    [send, props]
  );
  const onMouseDownMarginRight = useCallback(
    (event: React.MouseEvent) => {
      send({
        type: MOUSE_DOWN,
        event: event,
        area: marginRightArea,
        initialValue: props.styles.marginRight,
      });
    },
    [send, props]
  );
  const onMouseDownMarginLeft = useCallback(
    (event: React.MouseEvent) => {
      send({
        type: MOUSE_DOWN,
        event: event,
        area: marginLeftArea,
        initialValue: props.styles.marginLeft,
      });
    },
    [send, props]
  );

  useEffect(() => {
    if (state.value !== dragging) return;
    if (state.context["area"] === marginTopArea) {
      const change =
        state.context["finalMousePosition"] -
        state.context["initialMousePosition"];
      let marginTop = 0;
      if (typeof props.styles.marginTop === "string") {
        marginTop = parseInt(props.styles.marginTop);
      }
      if (typeof props.styles.marginTop === "number") {
        marginTop = props.styles.marginTop;
      }
      const changedValue = marginTop + change;
      props.patchCb({
        property: { styles: { marginTop: changedValue } },
      });
    }
  }, [state.context, state.value, props]);
  return (
    <div style={styles.container}>
      <div style={styles.header}>Spacing</div>
      {toggleClass && (
        <main style={styles.mainContainer}>
          {/*Margin PlaceHolders*/}
          <p style={styles.marginTopPlaceHolder}>{props.styles.marginTop}</p>
          <p style={styles.marginRightPlaceHolder}>0</p>
          <p style={styles.marginBottomPlaceHolder}>0</p>
          <p style={styles.marginLeftPlaceHolder}>0</p>
          {/*Padding Placeholders*/}
          <p style={styles.paddingTopPlaceHolder}>0</p>
          <p style={styles.paddingRightPlaceHolder}>0</p>
          <p style={styles.paddingBottomPlaceHolder}>0</p>
          <p style={styles.paddingLeftPlaceHolder}>0</p>
          {/*Margin Label*/}
          <p style={styles.marginLabel}>Margin</p>
          {/* Padding Label */}
          <p style={styles.paddingLabel}>Padding</p>
          <div style={styles.marginPaddingBoxContainer}>
            <Spacing
              onMouseDownMarginTop={onMouseDownMarginTop}
              onMouseDownMarginRight={onMouseDownMarginRight}
              onMouseDownMarginBottom={onMouseDownMarginBottom}
              onMouseDownMarginLeft={onMouseDownMarginLeft}
              onMouseDownPaddingTop={onMouseDownPaddingTop}
              onMouseDownPaddingRight={onMouseDownPaddingRight}
              onMouseDownPaddingBottom={onMouseDownPaddingBottom}
              onMouseDownPaddingLeft={onMouseDownPaddingLeft}
              marginTop={props.styles.marginTop || 0}
              paddingTop={props.styles.paddingTop || 0}
            />
          </div>
        </main>
      )}
    </div>
  );
};

export default SpacingProperty;
