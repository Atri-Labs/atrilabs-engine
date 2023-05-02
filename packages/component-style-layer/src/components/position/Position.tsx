import React, { useState, useCallback, useEffect, useMemo } from "react";
import PropertyRender from "../commons/PropertyRender";
import {
  gray200,
  gray100,
  gray400,
  gray800,
  smallText,
  h5Heading,
} from "@atrilabs/design-system";
import { assign, createMachine } from "xstate";
import { useMachine } from "@xstate/react";
import { CssProprtyComponentType } from "../../types";
import { ReactComponent as PR } from "../../assets/position/position/relative-icon.svg";
import { ReactComponent as PA } from "../../assets/position/position/absolute-icon.svg";
import { ReactComponent as PF } from "../../assets/position/position/fixed-icon.svg";
import { ReactComponent as PS } from "../../assets/position/position/static-icon.svg";
import { ReactComponent as FL } from "../../assets/position/float/left-icon.svg";
import { ReactComponent as FR } from "../../assets/position/float/right-icon.svg";
import { ReactComponent as FN } from "../../assets/position/float/none-icon.svg";
import { ReactComponent as CL } from "../../assets/position/clear/left-icon.svg";
import { ReactComponent as CR } from "../../assets/position/clear/right-icon.svg";
import { ReactComponent as CN } from "../../assets/position/clear/none-icon.svg";
import { ReactComponent as CB } from "../../assets/position/clear/both-icon.svg";
import { Input } from "../commons/Input";
import PositionTrapezoid from "./PositionTrapezoid";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";
import { ReactComponent as AddButton } from "../../assets/add.svg";
import { TransformSelector } from "./TransformSelector";
import { GradientColorSelector } from "../background/GradientSelector";
import { ReactComponent as MinusButton } from "../../assets/minus.svg";

export const fillColor = "rgba(75, 85, 99, 0.4)";
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "0.5rem",
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    paddingTop: "1.2rem",
    paddingBottom: "1.8rem",
    borderBottom: `1px solid ${gray800}`,
    rowGap: "1.2rem",
  },
  zindex: {
    display: "flex",
    justifyContent: "center",
  },

  header: {
    ...h5Heading,
    color: gray200,
    display: "flex",
    paddingLeft: "0.5rem",
    userSelect: "none",
  },
  drop: {
    display: "flex",
    alignItems: "baseline",
    cursor: "pointer",
  },
  option: {
    display: "flex",
    height: "25px",
    marginBottom: "25px",
    marginTop: "30px",
  },
  optionName: {
    ...smallText,
    textAlign: "left",
    color: "white",
    lineHeight: "25px",
    width: "4rem",
  },
  gridContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "2.5rem 50px 50px",
    textAlign: "center",
    columnGap: "25px",
    rowGap: "3px",
    marginBottom: "25px",
  },
  mainContainer: {
    position: "relative",
  },
  positionTrapezoid: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  positionTopPlaceHolder: {
    ...smallText,
    position: "absolute",
    left: "98px",
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
  positionBottomPlaceHolder: {
    ...smallText,
    position: "absolute",
    left: "98px",
    bottom: "22.5px",
    userSelect: "none",
    outline: "none",
    color: gray100,
    padding: "3px",
    backgroundColor: fillColor,
    width: "18px",
    border: "none",
    lineHeight: "10px",
  },
  positionRightPlaceHolder: {
    ...smallText,
    position: "absolute",
    left: "144px",
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
  positionLeftPlaceHolder: {
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
};
//ACTIONS
const MOUSE_DOWN = "MOUSE_DOWN";
const MOUSE_MOVE = "MOUSE_MOVE";
const MOUSE_UP = "MOUSE_UP";
const MOUSE_LEAVE = "MOUSE_LEAVE";
//STATES
const dragging = "dragging";
// PADDING AREA TYPES
const positionTopArea = "top" as "top";
const positionBottomArea = "bottom" as "bottom";
const positionRightArea = "right" as "right";
const positionLeftArea = "left" as "left";
const mouseDownAction = assign({
  area: (_context: any, event: any) => {
    return event["area"];
  },
  initialMousePosition: (_context: any, event: any) => {
    if ([positionTopArea, positionBottomArea].includes(event["area"])) {
      return event["event"]["pageY"];
    }
    if ([positionRightArea, positionLeftArea].includes(event["area"])) {
      return event["event"]["pageX"];
    }
  },
  finalMousePosition: (_context: any, event: any) => {
    if ([positionTopArea, positionBottomArea].includes(event["area"])) {
      return event["event"]["pageY"];
    }
    if ([positionRightArea, positionLeftArea].includes(event["area"])) {
      return event["event"]["pageX"];
    }
  },
  initialValue: (_context: any, event: any) => {
    return event["initialValue"];
  },
}) as any;
const mouseMoveAction = assign({
  finalMousePosition: (context: any, event: any) => {
    if ([positionTopArea, positionBottomArea].includes(context["area"])) {
      return event["event"]["pageY"];
    }
    if ([positionRightArea, positionLeftArea].includes(context["area"])) {
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
  predictableActionArguments: true,
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
  return !isNaN(parseFloat(size)) ? parseFloat(size).toString() : "0";
}

function convertSizeWithUnitsToStringWithUnits(size: string, unit: string) {
  return !isNaN(parseFloat(size)) ? parseFloat(size).toString() + unit : "";
}

const positionValues = ["static", "relative", "absolute", "fixed", "sticky"];
const floatValues = ["none", "left", "right"];
const clearValues = ["none", "left", "right", "both"];

const Position: React.FC<CssProprtyComponentType> = (props) => {
  const [state, send] = useMachine(dragMachine);
  const [showProperties, setShowProperties] = useState(true);

  const positionTopVal = props.styles.top?.toString() || "";
  const positionRightVal = props.styles.right?.toString() || "";
  const positionLeftVal = props.styles.left?.toString() || "";
  const positionBottomVal = props.styles.bottom?.toString() || "";

  const prevCSSUNnit = useMemo(() => {
    if (positionTopVal) {
      return positionTopVal.replace(/[0-9]/g, "");
    } else if (positionRightVal) {
      positionRightVal.replace(/[0-9]/g, "");
    } else if (positionLeftVal) {
      positionLeftVal.replace(/[0-9]/g, "");
    } else if (positionBottomVal) {
      positionBottomVal.replace(/[0-9]/g, "");
    }
    return "px";
  }, [positionBottomVal, positionLeftVal, positionRightVal, positionTopVal]);

  const [unit, setUnit] = useState<string>(prevCSSUNnit);
  const [transform, setTransform] = useState<
    | {
        transformStr: string;
        index: number;
      }
    | undefined
  >(undefined);

  const onMouseDownPositionTop = useCallback(
    (event: React.MouseEvent) => {
      send({
        type: MOUSE_DOWN,
        event: event,
        area: positionTopArea,
        initialValue: parseInt(positionTopVal || "0"),
      });
    },
    [send, positionTopVal]
  );
  const onMouseDownPositionBottom = useCallback(
    (event: React.MouseEvent) => {
      send({
        type: MOUSE_DOWN,
        event: event,
        area: positionBottomArea,
        initialValue: parseInt(positionBottomVal || "0"),
      });
    },
    [send, positionBottomVal]
  );
  const onMouseDownPositionRight = useCallback(
    (event: React.MouseEvent) => {
      send({
        type: MOUSE_DOWN,
        event: event,
        area: positionRightArea,
        initialValue: parseInt(positionRightVal || "0"),
      });
    },
    [send, positionRightVal]
  );
  const onMouseDownPositionLeft = useCallback(
    (event: React.MouseEvent) => {
      send({
        type: MOUSE_DOWN,
        event: event,
        area: positionLeftArea,
        initialValue: parseInt(positionLeftVal || "0"),
      });
    },
    [send, positionLeftVal]
  );
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

  // Synchronise the position property with the new CSS unit
  const updatePosition = useCallback(
    (unit: string) => {
      setUnit(unit);

      function patchStyle(cssProperty: string, cssPropertyVal: string) {
        props.patchCb({
          property: {
            styles: {
              [cssProperty]: convertSizeWithUnitsToStringWithUnits(
                cssPropertyVal,
                unit
              ),
            },
          },
        });
      }

      if (positionTopVal) {
        patchStyle("positionTop", positionTopVal);
      }
      if (positionRightVal) {
        patchStyle("positionRight", positionRightVal);
      }
      if (positionLeftVal) {
        patchStyle("positionLeft", positionLeftVal);
      }
      if (positionBottomVal) {
        patchStyle("positionBottom", positionBottomVal);
      }
    },
    [
      positionBottomVal,
      positionLeftVal,
      positionRightVal,
      positionTopVal,
      props,
    ]
  );

  const handleChangePositionTop = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let attrValue = event.target.value;
    props.patchCb({
      property: {
        styles: { top: convertSizeWithUnitsToStringWithUnits(attrValue, unit) },
      },
    });
  };
  const handleChangePositionRight = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let attrValue = event.target.value;
    props.patchCb({
      property: {
        styles: {
          right: convertSizeWithUnitsToStringWithUnits(attrValue, unit),
        },
      },
    });
  };
  const handleChangePositionLeft = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let attrValue = event.target.value;
    props.patchCb({
      property: {
        styles: {
          left: convertSizeWithUnitsToStringWithUnits(attrValue, unit),
        },
      },
    });
  };
  const handleChangePositionBottom = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let attrValue = event.target.value;
    props.patchCb({
      property: {
        styles: {
          bottom: convertSizeWithUnitsToStringWithUnits(attrValue, unit),
        },
      },
    });
  };
  const handleTransformChange = useCallback(
    (
      e: React.ChangeEvent<HTMLSelectElement>,
      fontItem: keyof React.CSSProperties
    ) => {
      props.patchCb({
        property: {
          styles: {
            [fontItem]: e.target.value,
          },
        },
      });
    },
    [props]
  );

  //////////
  const closeTransform = useCallback(() => {
    setTransform(undefined);
  }, []);

  const transforms = useMemo(() => {
    const transformString = (props.styles.transform as string) || "";
    const transformArray = transformString ? transformString.split("), ") : [];
    return transformArray.map((transformStr, index) =>
      index === transformArray.length - 1 ? transformStr : transformStr + ")"
    );
  }, [props.styles.transform]);

  const applyTransform = useCallback(
    (transforms: string[]) => {
      let transformsString = "";
      for (let i = 0; i < transforms.length; i++) {
        if (transformsString !== "" && i > 0) transformsString += ", ";
        transformsString += transforms[i];
      }
      props.patchCb({
        property: {
          styles: { transform: transformsString },
        },
      });
    },
    [props]
  );

  const addTransform = useCallback(() => {
    applyTransform([...transforms, "none"]);
  }, [applyTransform, transforms]);

  const removeTransform = useCallback(
    (index: number) => {
      const transformsValues = [...transforms];
      transformsValues.splice(index, 1);
      applyTransform(transformsValues);
    },
    [applyTransform, transforms]
  );

  const updateTransform = useCallback(
    (index: number, transform: string) => {
      const transformValues = [...transforms];
      transformValues.splice(index, 1, transform);
      applyTransform(transformValues);
    },
    [applyTransform, transforms]
  );

  //////
  return (
    <>
      <style>
        {`
           input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
          -webkit-appearance: none;
            margin: 0;
          }   
        `}
      </style>
      <div style={styles.container}>
        <div style={styles.drop}>
          <DropDownArrow
            onClick={() => setShowProperties(!showProperties)}
            style={
              !showProperties
                ? { transform: "rotate(-90deg)" }
                : { transform: "rotate(0deg)" }
            }
          />
          <div style={styles.header}>Position</div>
        </div>

        <div
          style={showProperties ? { display: "block" } : { display: "none" }}
        >
          <PropertyRender
            styleItem="position"
            styleText="Position"
            styleArray={positionValues}
            patchCb={props.patchCb}
            styles={props.styles}
          >
            <PS />
            <PR />
            <PA />
            <PF />
            <div style={{ ...smallText, color: gray200, cursor: "pointer" }}>
              Sticky
            </div>
          </PropertyRender>
          <div style={styles.mainContainer}>
            <div style={styles.positionTrapezoid}>
              <input
                type="number"
                value={parseFloat(positionTopVal) || ""}
                onChange={handleChangePositionTop}
                placeholder={convertSizeWithUnitsToString(positionTopVal)}
                style={styles.positionTopPlaceHolder}
              />

              <input
                type="number"
                value={parseFloat(positionRightVal) || ""}
                onChange={handleChangePositionRight}
                placeholder={convertSizeWithUnitsToString(positionRightVal)}
                style={styles.positionRightPlaceHolder}
              />

              <input
                type="number"
                value={parseFloat(positionBottomVal) || ""}
                onChange={handleChangePositionBottom}
                placeholder={convertSizeWithUnitsToString(positionBottomVal)}
                style={styles.positionBottomPlaceHolder}
              />

              <input
                type="number"
                value={parseFloat(positionLeftVal) || ""}
                onChange={handleChangePositionLeft}
                placeholder={convertSizeWithUnitsToString(positionLeftVal)}
                style={styles.positionLeftPlaceHolder}
              />

              <div
                className="dropdown"
                style={{ position: "absolute", left: "95px", height: "19px" }}
              >
                <button
                  className="dropbtn"
                  style={{ height: "19px", backgroundColor: "transparent" }}
                >
                  {unit}
                </button>
                <div
                  className="dropdown-content"
                  style={{
                    position: "absolute",
                    left: "0",
                    textAlign: "center",
                  }}
                >
                  {["px", "%", "em", "rem", "ch", "vw", "vh"].map(
                    (unit, idx) => (
                      <p
                        onClick={() => {
                          updatePosition(unit);
                        }}
                        key={unit + idx}
                      >
                        {unit}
                      </p>
                    )
                  )}
                </div>
              </div>

              <PositionTrapezoid
                onMouseDownPositionTop={onMouseDownPositionTop}
                onMouseDownPositionRight={onMouseDownPositionRight}
                onMouseDownPositionBottom={onMouseDownPositionBottom}
                onMouseDownPositionLeft={onMouseDownPositionLeft}
              />
            </div>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}
          >
            <div style={styles.zindex}>
              <div style={styles.optionName}>z-index</div>
              <div style={{ width: "55px" }}>
                <Input
                  styleItem="zIndex"
                  styles={props.styles}
                  patchCb={props.patchCb}
                  defaultValue=""
                  parseToInt={true}
                />
              </div>
            </div>
            <PropertyRender
              styleItem="float"
              styleText="Float"
              styleArray={floatValues}
              patchCb={props.patchCb}
              styles={props.styles}
            >
              <FN />
              <FL />
              <FR />
            </PropertyRender>
            <PropertyRender
              styleItem="clear"
              styleText="Clear"
              styleArray={clearValues}
              patchCb={props.patchCb}
              styles={props.styles}
            >
              <CN />
              <CL />
              <CR />
              <CB />
            </PropertyRender>
          </div>

          {/*<div style={styles.optionSelect}>*/}
          {/*  <div style={styles.optionNameSelect}>Transform</div>*/}
          {/*  <div>*/}
          {/*    <select*/}
          {/*      name="transform"*/}
          {/*      onChange={(e) => handleTransformChange(e, "transform")}*/}
          {/*      style={{...styles.inputBox, width: "80px"}}*/}
          {/*      value={props.styles.transform || "none"}*/}
          {/*      className="scroll"*/}
          {/*    >*/}
          {/*      <option style={styles.select} value="none">*/}
          {/*        none*/}
          {/*      </option>*/}
          {/*      <option style={styles.select} value="inherit">*/}
          {/*        inherit*/}
          {/*      </option>*/}
          {/*      <option style={styles.select} value="initial">*/}
          {/*        initial*/}
          {/*      </option>*/}
          {/*      <option style={styles.select} value="revert">*/}
          {/*        revert*/}
          {/*      </option>*/}
          {/*      <option style={styles.select} value="revert-layer">*/}
          {/*        revert-layer*/}
          {/*      </option>*/}
          {/*      <option style={styles.select} value="unset">*/}
          {/*        unset*/}
          {/*      </option>*/}
          {/*    </select>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "1em",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "16px",
              }}
            >
              <div style={styles.optionName}>Transform</div>
              <AddButton
                style={{ ...smallText, color: gray200, cursor: "pointer" }}
                onClick={() => addTransform()}
              />
            </div>
            {transforms.map((transform, index) => (
              <div
                key={index}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "1em",
                    border: "1px solid #fff",
                    padding: "0.3em",
                    width: "110px",
                  }}
                  onClick={() =>
                    setTransform({ transformStr: transform, index })
                  }
                >
                  <div
                    style={{
                      width: "1em",
                      height: "1em",
                      transform: `${transform}`,
                    }}
                  ></div>
                  <div
                    style={{
                      ...smallText,
                      color: gray200,
                      cursor: "pointer",
                    }}
                  >
                    {transform}
                    {/*{(gradient[0] === "r" && gradient[10] === "l") ||*/}
                    {/*gradient[0] === "l"*/}
                    {/*  ? "Linear Gradient"*/}
                    {/*  : (gradient[0] === "r" && gradient[10] === "r") ||*/}
                    {/*  (gradient[0] === "r" && gradient[1] === "a")*/}
                    {/*    ? "Radial Gradient"*/}
                    {/*    : "Conic Gradient"}*/}
                  </div>
                </div>

                <div
                  style={{
                    color: gray200,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    userSelect: "none",
                  }}
                  onClick={() => removeTransform(index)}
                >
                  <MinusButton />
                </div>
              </div>
            ))}
          </div>
        </div>
        {transform && (
          <div
            style={{
              position: "absolute",
              bottom: "0.2rem",
              right: "15.2rem",
            }}
          >
            <TransformSelector
              {...props}
              transform={transform.transformStr}
              index={transform.index}
              updateTransform={updateTransform}
              closeTransformSelector={closeTransform}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Position;
