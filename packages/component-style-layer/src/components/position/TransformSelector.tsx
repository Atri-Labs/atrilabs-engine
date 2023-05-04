import { smallText, gray100, gray800 } from "@atrilabs/design-system";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Cross } from "../../icons/Cross";
import { NumberList } from "../number-list/NumberList";
import { SizeInputWithUnits } from "../commons/SizeInputWithUnits";

type GradientSelectorType = {
  transform: string;
  index: number;
  updateTransform: (index: number, transform: string) => void;
  closeTransformSelector: () => void;
  styles?: React.CSSProperties;
};

type TransformType = {
  transformType: string;
  transformAngle: number;
  transformAngle2: number;
  number: number;
  number2: number;
  number3: number;
  matrix: number[];
};

const AngleSelector: React.FC<{
  angle: number;
  setAngle: (angle: number) => void;
}> = (props) => {
  const divRef = useRef<HTMLDivElement>(null);

  const calculateAngle = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const { clientX, clientY } = event;
      const { top, left } = divRef.current!.getBoundingClientRect();
      const x = clientX - left - 10;
      const y = clientY - top - 10;
      const degrees = Math.trunc(Math.atan2(y, x) * (180 / Math.PI) + 90);
      props.setAngle(degrees < 0 ? 360 + degrees : degrees);
    },
    [props]
  );
  return (
    <div
      ref={divRef}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        border: "2px solid #fff",
        position: "relative",
      }}
      onMouseMove={calculateAngle}
    >
      <div
        style={{
          position: "relative",
          width: "5px",
          height: "18px",
          transform: `translateZ(0px) rotate(${props.angle}deg)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "2px",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            backgroundColor: "#fff",
          }}
        />
      </div>
    </div>
  );
};

function createTransformObject(transformStr: string): TransformType {
  const transformObject: TransformType = {
    transformType: "",
    transformAngle: 0,
    transformAngle2: 0,
    number: 1,
    number2: 1,
    number3: 1,
    matrix: [1, 1, 1, 1, 1, 1],
  };

  return transformObject;
}

function createTransformString(transformObject: TransformType): string {
  const {
    transformAngle,
    transformType,
    number,
    transformAngle2,
    number2,
    number3,
    matrix,
  } = transformObject;

  let transformStr = "";
  if (transformType === "rotate") transformStr += `rotate(${transformAngle}deg`;
  else if (transformType === "rotate3d")
    transformStr += `rotate3d( ${number}, ${number2}, ${number3}, ${transformAngle}deg`;
  else if (transformType === "rotateX")
    transformStr += `rotateX(${transformAngle}deg`;
  else if (transformType === "rotateY")
    transformStr += `rotateY(${transformAngle}deg`;
  else if (transformType === "rotateZ")
    transformStr += `rotateZ(${transformAngle}deg`;
  else if (transformType === "skewX")
    transformStr += `skewX(${transformAngle}deg`;
  else if (transformType === "skew")
    transformStr += `skew(${transformAngle}deg, ${transformAngle2}deg`;
  else if (transformType === "skew")
    transformStr += `skewY(${transformAngle}deg`;
  else if (transformType === "scaleX") transformStr += `scaleX(${number}`;
  else if (transformType === "scaleY") transformStr += `scaleY(${number}`;
  else if (transformType === "scaleZ") transformStr += `scaleZ(${number}`;
  else if (transformType === "scale")
    transformStr += `scale(${number}, ${number2}`;
  else if (transformType === "scale3d")
    transformStr += `scale3d(${number}, ${number2}, ${number3}`;
  else if (transformType === "translateX")
    transformStr += `translateX(${number}px`;
  else if (transformType === "translateY")
    transformStr += `translateY(${number}px`;
  else if (transformType === "translateZ")
    transformStr += `translateZ(${number}px`;
  else if (transformType === "translate3d")
    transformStr += `translate3d(${number}px, ${number2}px, ${number3}px`;
  else if (transformType === "translate")
    transformStr += `translate(${number}px, ${number2}px`;
  else if (transformType === "none") transformStr += `(none`;
  else if (transformType === "initial") transformStr += `(initial`;
  else if (transformType === "inherit") transformStr += `(inherit`;
  transformStr += ")";
  console.log("transform string...", transformStr);
  return transformStr || "";
}

export const TransformSelector: React.FC<GradientSelectorType> = (props) => {
  // Use gradientProperty only in UI, not for update
  const transformProperty = useMemo(() => {
    return createTransformObject(props.transform);
  }, [props.transform]);

  const [scale, setScale] = useState<string>("");

  const updateTransformCb = useCallback(
    (update: Partial<TransformType>) => {
      const transformProperty: TransformType = {
        ...createTransformObject(props.transform),
        ...update,
      };
      const transformStr = createTransformString(transformProperty);
      props.updateTransform(props.index, transformStr);
    },
    [props]
  );

  const setTransformAngle = useCallback(
    (angle: number) => {
      const prevTransformProperty = transformProperty;
      prevTransformProperty.transformAngle = angle;
      updateTransformCb(prevTransformProperty);
    },
    [transformProperty, updateTransformCb]
  );

  const setTransformAngle2 = useCallback(
    (angle: number) => {
      const prevTransformProperty = transformProperty;
      prevTransformProperty.transformAngle2 = angle;
      updateTransformCb(prevTransformProperty);
    },
    [transformProperty, updateTransformCb]
  );

  // const setTransformAttribute = useCallback(
  //   (
  //     attribute: "transformType" | "number" | "number2" | "number3",
  //     value: string
  //   ) => {
  //     const prevGradientProperty = transformProperty;
  //     if (
  //       attribute === "number" ||
  //       attribute === "number2" ||
  //       attribute === "number3"
  //     ) {
  //       prevGradientProperty[attribute] = parseInt(value);
  //     } else {
  //       prevGradientProperty[attribute] = value;
  //     }
  //     updateTransformCb(prevGradientProperty);
  //   },
  //   [transformProperty, updateTransformCb]
  // );

  const setTransformAttribute = useCallback(
    (
      attribute: "transformType" | "number" | "number2" | "number3" | "matrix",
      value: string | number[]
    ) => {
      const prevTransformProperty = transformProperty;
      if (typeof value === "string") {
        if (
          attribute === "number" ||
          attribute === "number2" ||
          attribute === "number3"
        ) {
          prevTransformProperty[attribute] = parseInt(value);
        }
      } else if (attribute === "matrix" && Array.isArray(value)) {
        //prevTransformProperty[attribute] = value.join(",");
      } else {
        prevTransformProperty[attribute] = value;
      }
      updateTransformCb(prevTransformProperty);
    },
    [transformProperty, updateTransformCb]
  );

  return (
    <>
      <style>
        {`
        #gradientBar:focus-visible {outline: none} 
        #gradientBar:hover {cursor: crosshair} 
        #gradientType {border: none} 
        #gradientType:hover {border: 1px solid #fff}`}
      </style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: "1em",
          backgroundColor: "#374151",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <select
              name="transformType"
              id="transformType"
              style={{
                ...smallText,
                color: gray100,
                backgroundColor: "rgb(31, 41, 55)",
                outline: "none",
                height: "28px",
                paddingLeft: "0.5em",
                borderRadius: "2px",
                width: "145px",
                WebkitAppearance: "none",
                MozAppearance: "none",
              }}
              onChange={(e) => {
                setTransformAttribute("transformType", e.target.value);
              }}
              value={transformProperty.transformType}
            >
              <option value="none">none</option>
              <option value="matrix">matrix</option>
              <option value="matrix3d">matrix3d</option>
              <option value="translate">translate</option>
              <option value="translate3d">translate3d</option>
              <option value="translateX">translateX</option>
              <option value="translateY">translateY</option>
              <option value="translateZ">translateZ</option>
              <option value="scale">scale</option>
              <option value="scale3d">scale3d</option>
              <option value="scaleX">scaleX</option>
              <option value="scaleY">scaleY</option>
              <option value="scaleZ">scaleZ</option>
              <option value="rotate">rotate</option>
              <option value="rotate3d">rotate3d</option>
              <option value="rotateX">rotateX</option>
              <option value="rotateY">rotateY</option>
              <option value="rotateZ">rotateZ</option>
              <option value="skew">skew</option>
              <option value="skewX">skewX</option>
              <option value="skewY">skewY</option>
              <option value="perspective">perspective</option>
              <option value="initial">initial</option>
              <option value="inherit">inherit</option>
            </select>
          </div>
          <div
            onClick={() => {
              props.closeTransformSelector();
            }}
          >
            <Cross />
          </div>
        </div>

        {[
          "scaleX",
          "scaleY",
          "scaleZ",
          "translateX",
          "translateY",
          "translateZ",
        ].includes(transformProperty.transformType) && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "1em",
              paddingRight: "1em",
            }}
          >
            <div
              style={{
                ...smallText,
                color: gray100,
                backgroundColor: "transparent",
              }}
            >
              {transformProperty.transformType}
            </div>
            <input
              style={{
                ...smallText,
                outline: "none",
                color: gray100,
                backgroundColor: gray800,
                height: "26px",
                width: "45px",
                border: "none",
                borderRadius: "2px 0 0 2px",
                paddingLeft: "6px",
                paddingRight: "6px",
                display: "flex",
                alignItems: "center",
              }}
              type="number"
              value={transformProperty.number}
              id="number"
              onChange={(e) => {
                setTransformAttribute("number", e.target.value);
              }}
            />
          </div>
        )}

        {["scale", "translate"].includes(transformProperty.transformType) && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: "1em",
                paddingRight: "1em",
              }}
            >
              <div
                style={{
                  ...smallText,
                  color: gray100,
                  backgroundColor: "transparent",
                }}
              >
                x
              </div>
              <input
                style={{
                  ...smallText,
                  outline: "none",
                  color: gray100,
                  backgroundColor: gray800,
                  height: "26px",
                  width: "45px",
                  border: "none",
                  borderRadius: "2px 0 0 2px",
                  paddingLeft: "6px",
                  paddingRight: "6px",
                  display: "flex",
                  alignItems: "center",
                }}
                type="number"
                value={transformProperty.number}
                id="number"
                onChange={(e) => {
                  setTransformAttribute("number", e.target.value);
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: "1em",
                paddingRight: "1em",
              }}
            >
              <div
                style={{
                  ...smallText,
                  color: gray100,
                  backgroundColor: "transparent",
                }}
              >
                y
              </div>
              <input
                style={{
                  ...smallText,
                  outline: "none",
                  color: gray100,
                  backgroundColor: gray800,
                  height: "26px",
                  width: "45px",
                  border: "none",
                  borderRadius: "2px 0 0 2px",
                  paddingLeft: "6px",
                  paddingRight: "6px",
                  display: "flex",
                  alignItems: "center",
                }}
                type="number"
                value={transformProperty.number2}
                id="number2"
                onChange={(e) => {
                  setTransformAttribute("number2", e.target.value);
                }}
              />
            </div>
          </>
        )}

        {["scale3d", "translate3d"].includes(
          transformProperty.transformType
        ) && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: "1em",
                paddingRight: "1em",
              }}
            >
              <div
                style={{
                  ...smallText,
                  color: gray100,
                  backgroundColor: "transparent",
                }}
              >
                x
              </div>
              <input
                style={{
                  ...smallText,
                  outline: "none",
                  color: gray100,
                  backgroundColor: gray800,
                  height: "26px",
                  width: "45px",
                  border: "none",
                  borderRadius: "2px 0 0 2px",
                  paddingLeft: "6px",
                  paddingRight: "6px",
                  display: "flex",
                  alignItems: "center",
                }}
                type="number"
                value={transformProperty.number}
                id="number"
                onChange={(e) => {
                  setTransformAttribute("number", e.target.value);
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: "1em",
                paddingRight: "1em",
              }}
            >
              <div
                style={{
                  ...smallText,
                  color: gray100,
                  backgroundColor: "transparent",
                }}
              >
                y
              </div>
              <input
                style={{
                  ...smallText,
                  outline: "none",
                  color: gray100,
                  backgroundColor: gray800,
                  height: "26px",
                  width: "45px",
                  border: "none",
                  borderRadius: "2px 0 0 2px",
                  paddingLeft: "6px",
                  paddingRight: "6px",
                  display: "flex",
                  alignItems: "center",
                }}
                type="number"
                value={transformProperty.number2}
                id="number2"
                onChange={(e) => {
                  setTransformAttribute("number2", e.target.value);
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: "1em",
                paddingRight: "1em",
              }}
            >
              <div
                style={{
                  ...smallText,
                  color: gray100,
                  backgroundColor: "transparent",
                }}
              >
                z
              </div>
              <input
                style={{
                  ...smallText,
                  outline: "none",
                  color: gray100,
                  backgroundColor: gray800,
                  height: "26px",
                  width: "45px",
                  border: "none",
                  borderRadius: "2px 0 0 2px",
                  paddingLeft: "6px",
                  paddingRight: "6px",
                  display: "flex",
                  alignItems: "center",
                }}
                type="number"
                value={transformProperty.number3}
                id="number3"
                onChange={(e) => {
                  setTransformAttribute("number3", e.target.value);
                }}
              />
            </div>
          </>
        )}

        {["rotate3d"].includes(transformProperty.transformType) && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: "1em",
                paddingRight: "1em",
              }}
            >
              <div
                style={{
                  ...smallText,
                  color: gray100,
                  backgroundColor: "transparent",
                }}
              >
                x
              </div>
              <input
                style={{
                  ...smallText,
                  outline: "none",
                  color: gray100,
                  backgroundColor: gray800,
                  height: "26px",
                  width: "45px",
                  border: "none",
                  borderRadius: "2px 0 0 2px",
                  paddingLeft: "6px",
                  paddingRight: "6px",
                  display: "flex",
                  alignItems: "center",
                }}
                type="number"
                value={transformProperty.number}
                id="number"
                onChange={(e) => {
                  setTransformAttribute("number", e.target.value);
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: "1em",
                paddingRight: "1em",
              }}
            >
              <div
                style={{
                  ...smallText,
                  color: gray100,
                  backgroundColor: "transparent",
                }}
              >
                y
              </div>
              <input
                style={{
                  ...smallText,
                  outline: "none",
                  color: gray100,
                  backgroundColor: gray800,
                  height: "26px",
                  width: "45px",
                  border: "none",
                  borderRadius: "2px 0 0 2px",
                  paddingLeft: "6px",
                  paddingRight: "6px",
                  display: "flex",
                  alignItems: "center",
                }}
                type="number"
                value={transformProperty.number2}
                id="number2"
                onChange={(e) => {
                  setTransformAttribute("number2", e.target.value);
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: "1em",
                paddingRight: "1em",
              }}
            >
              <div
                style={{
                  ...smallText,
                  color: gray100,
                  backgroundColor: "transparent",
                }}
              >
                z
              </div>
              <input
                style={{
                  ...smallText,
                  outline: "none",
                  color: gray100,
                  backgroundColor: gray800,
                  height: "26px",
                  width: "45px",
                  border: "none",
                  borderRadius: "2px 0 0 2px",
                  paddingLeft: "6px",
                  paddingRight: "6px",
                  display: "flex",
                  alignItems: "center",
                }}
                type="number"
                value={transformProperty.number3}
                id="number3"
                onChange={(e) => {
                  setTransformAttribute("number3", e.target.value);
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: "1em",
                paddingRight: "1em",
              }}
            >
              <div
                style={{
                  ...smallText,
                  color: gray100,
                  backgroundColor: "transparent",
                }}
              >
                Angle
              </div>
              <AngleSelector
                angle={transformProperty.transformAngle}
                setAngle={setTransformAngle}
              />

              <div
                style={{
                  ...smallText,
                  outline: "none",
                  color: gray100,
                  backgroundColor: gray800,
                  height: "26px",
                  width: "25px",
                  border: "none",
                  borderRadius: "2px 0 0 2px",
                  paddingLeft: "6px",
                  paddingRight: "6px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {transformProperty.transformAngle}
              </div>
            </div>
          </>
        )}

        {["rotate", "rotateX", "rotateY", "rotateZ", "skewX", "skewY"].includes(
          transformProperty.transformType
        ) && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "1em",
              paddingRight: "1em",
            }}
          >
            <div
              style={{
                ...smallText,
                color: gray100,
                backgroundColor: "transparent",
              }}
            >
              Angle
            </div>
            <AngleSelector
              angle={transformProperty.transformAngle}
              setAngle={setTransformAngle}
            />

            <div
              style={{
                ...smallText,
                outline: "none",
                color: gray100,
                backgroundColor: gray800,
                height: "26px",
                width: "25px",
                border: "none",
                borderRadius: "2px 0 0 2px",
                paddingLeft: "6px",
                paddingRight: "6px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {transformProperty.transformAngle}
            </div>
          </div>
        )}

        {["skew"].includes(transformProperty.transformType) && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: "1em",
                paddingRight: "1em",
              }}
            >
              <div
                style={{
                  ...smallText,
                  color: gray100,
                  backgroundColor: "transparent",
                }}
              >
                x-angle
              </div>
              <AngleSelector
                angle={transformProperty.transformAngle}
                setAngle={setTransformAngle}
              />

              <div
                style={{
                  ...smallText,
                  outline: "none",
                  color: gray100,
                  backgroundColor: gray800,
                  height: "26px",
                  width: "25px",
                  border: "none",
                  borderRadius: "2px 0 0 2px",
                  paddingLeft: "6px",
                  paddingRight: "6px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {transformProperty.transformAngle}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: "1em",
                paddingRight: "1em",
              }}
            >
              <div
                style={{
                  ...smallText,
                  color: gray100,
                  backgroundColor: "transparent",
                }}
              >
                y-angle
              </div>
              <AngleSelector
                angle={transformProperty.transformAngle2}
                setAngle={setTransformAngle2}
              />

              <div
                style={{
                  ...smallText,
                  outline: "none",
                  color: gray100,
                  backgroundColor: gray800,
                  height: "26px",
                  width: "25px",
                  border: "none",
                  borderRadius: "2px 0 0 2px",
                  paddingLeft: "6px",
                  paddingRight: "6px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {transformProperty.transformAngle2}
              </div>
            </div>
          </>
        )}

        {/*{(scale === "scale" || scale === "scale3d") && (*/}
        {/*<ArrayPropertyContainer>*/}
        {/*  <ArrayLabel onAddClick={() => {}} name={scale} />*/}
        {/*  <div*/}
        {/*    style={{*/}
        {/*      display: "flex",*/}
        {/*      justifyContent: "space-between",*/}
        {/*      alignItems: "center",*/}
        {/*      paddingLeft: "1em",*/}
        {/*      paddingRight: "1em",*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <input*/}
        {/*      //  value={props.styles[scale] || ""}*/}
        {/*      // value={scale}*/}
        {/*      // onChange={(e) => {*/}
        {/*      //   editValueCb(index, e.target.value);*/}
        {/*      // }}*/}
        {/*      type="number"*/}
        {/*      style={{*/}
        {/*        ...smallText,*/}
        {/*        outline: "none",*/}
        {/*        color: gray100,*/}
        {/*        backgroundColor: gray800,*/}
        {/*        height: "26px",*/}
        {/*        width: "45px",*/}
        {/*        border: "none",*/}
        {/*        borderRadius: "2px 0 0 2px",*/}
        {/*        paddingLeft: "6px",*/}
        {/*        paddingRight: "6px",*/}
        {/*        display: "flex",*/}
        {/*        alignItems: "center",*/}
        {/*      }}*/}
        {/*    />*/}
        {/*    <div*/}
        {/*      style={{ display: "flex", alignItems: "center" }}*/}
        {/*      // onClick={() => {*/}
        {/*      //   deleteValueCb(index);*/}
        {/*      // }}*/}
        {/*    >*/}
        {/*      <MinusIcon />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</ArrayPropertyContainer>*/}
        {/*)}*/}
        {/*<SizeInputWithUnits*/}
        {/*  styleItem="fontSize"*/}
        {/*  styles={{}}*/}
        {/*  patchCb={() => {}}*/}
        {/*  defaultValue=""*/}
        {/*/>*/}
        {["matrix"].includes(transformProperty.transformType) && (
          <NumberList
            values={transformProperty.matrix}
            updateValueCb={(values) => {
              setTransformAttribute("matrix", values);
            }}
            name={"matrix"}
          />
        )}
      </div>
    </>
  );
};
