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

// SpacingProperty is a controlled component
const SpacingProperty: React.FC<CssProprtyComponentType> = (props) => {
  const [toggleClass, setToggleClass] = useState(true);
  const [state, send] = useMachine(dragMachine);

  const marginTopVal = props.styles.marginTop || 0;
  const marginRightVal = props.styles.marginRight || 0;
  const marginLeftVal = props.styles.marginLeft || 0;
  const marginBottomVal = props.styles.marginBottom || 0;
  const paddingTopVal = props.styles.paddingTop || 0;
  const paddingRightVal = props.styles.paddingRight || 0;
  const paddingLeftVal = props.styles.paddingLeft || 0;
  const paddingBottomVal = props.styles.paddingBottom || 0;

  // callbacks for different areas
  const onMouseDownPaddingTop = useCallback(
    (event: React.MouseEvent) => {
      send({
        type: MOUSE_DOWN,
        event: event,
        area: paddingTopArea,
        initialValue: paddingTopVal,
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
        initialValue: paddingBottomVal,
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
        initialValue: paddingRightVal,
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
        initialValue: paddingLeftVal,
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
        initialValue: marginTopVal,
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
        initialValue: marginBottomVal,
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
        initialValue: marginRightVal,
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
        initialValue: marginLeftVal,
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
    if (oldValue !== newValue)
      props.patchCb({
        property: { styles: { [state.context["area"]]: newValue } },
      });
  }, [state.context, state.value, props]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>Spacing</div>
      {toggleClass && (
        <main style={styles.mainContainer}>
          {/*Margin PlaceHolders*/}
          <p style={styles.marginTopPlaceHolder}>{marginTopVal}</p>
          <p style={styles.marginRightPlaceHolder}>{marginRightVal}</p>
          <p style={styles.marginBottomPlaceHolder}>{marginBottomVal}</p>
          <p style={styles.marginLeftPlaceHolder}>{marginLeftVal}</p>
          {/*Padding Placeholders*/}
          <p style={styles.paddingTopPlaceHolder}>{paddingTopVal}</p>
          <p style={styles.paddingRightPlaceHolder}>{paddingRightVal}</p>
          <p style={styles.paddingBottomPlaceHolder}>{paddingBottomVal}</p>
          <p style={styles.paddingLeftPlaceHolder}>{paddingLeftVal}</p>
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
            />
          </div>
        </main>
      )}
    </div>
  );
};

export default SpacingProperty;
