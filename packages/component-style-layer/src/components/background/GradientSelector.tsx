import { smallText, gray100, gray800 } from "@atrilabs/design-system";
import { useCallback, useMemo, useRef, useState } from "react";
import { Cross } from "../../icons/Cross";
import { ColorPicker, toColor, Color } from "react-color-palette";

type Position = {
  stop: number;
  color: Color;
};

type GradientSelectorType = {
  gradient: string;
  index: number;
  updateGradient: (index: number, gradient: string) => void;
  closeGradientSelector: () => void;
};

type GradientType = {
  repeat: boolean;
  gradientType: string;
  shapeType: string;
  xAxis: number;
  yAxis: number;
  positions: Position[];
  gradientAngle: number;
};

const AngleSelector: React.FC<{
  angle: number;
  setAngle: (angle: number) => void;
  gradient: string;
  index: number;
  updateGradient: (index: number, gradient: string) => void;
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
      onMouseLeave={() => {
        // props.updateGradient(props.index, props.gradient);
      }}
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
        ></div>
      </div>
    </div>
  );
};

function createGradientObject(gradientStr: string): GradientType {
  const gradientObject: GradientType = {
    repeat: false,
    gradientType: "linearGradient",
    shapeType: "",
    xAxis: 0,
    yAxis: 0,
    positions: [],
    gradientAngle: 0,
  };

  gradientStr = gradientStr.replace("(", ",");
  gradientStr = gradientStr.replace(")", "");

  const [type, control, ...colors] = gradientStr.split(",");

  if (type[0] === "r" && type[1] === "e") {
    gradientObject.repeat = true;
  }
  gradientObject.gradientType = type
    .replace("repeating-", "")
    .replace("-g", "G");

  for (let i = 0; i < colors.length; i++) {
    const [color, stop] = colors[i].trim().split(" ");
    gradientObject.positions[i] = {
      stop: parseInt(stop),
      color: toColor("hex", color),
    };
  }

  if (gradientObject.gradientType === "linearGradient") {
    gradientObject.gradientAngle = parseInt(control);
  } else if (gradientObject.gradientType === "radialGradient") {
    const controls = control.split(" ");
    gradientObject.shapeType = controls[0];
    gradientObject.xAxis = parseInt(controls[2]);
    gradientObject.yAxis = parseInt(controls[3]);
  } else if (gradientObject.gradientType === "conicGradient") {
    const controls = control.split(" ");
    gradientObject.gradientAngle = parseInt(controls[1]);
    gradientObject.xAxis = parseInt(controls[3]);
    gradientObject.yAxis = parseInt(controls[4]);
  }

  return gradientObject;
}

function createGradientString(gradientObject: GradientType): string {
  const {
    positions,
    repeat,
    gradientAngle,
    gradientType,
    shapeType,
    xAxis,
    yAxis,
  } = gradientObject;
  const tempPositions = [...positions];
  tempPositions.sort((ob1, ob2) => (ob1.stop > ob2.stop ? 1 : -1));
  let gradientStr = "";
  if (repeat) gradientStr += "repeating-";
  if (gradientType === "linearGradient")
    gradientStr += `linear-gradient(${gradientAngle}deg`;
  else if (gradientType === "radialGradient")
    gradientStr += `radial-gradient(${shapeType} at ${xAxis}% ${yAxis}%`;
  else if (gradientType === "conicGradient")
    gradientStr += `conic-gradient(from ${gradientAngle}deg at ${xAxis}% ${yAxis}%`;
  for (let i = 0; i < tempPositions.length; i++) {
    gradientStr += `, ${tempPositions[i].color.hex} ${tempPositions[i].stop}%`;
  }
  gradientStr += ")";
  return gradientStr || "";
}

export const GradientColorSelector: React.FC<GradientSelectorType> = (
  props
) => {
  // Use gradientProperty only in UI, not for update
  const gradientProperty = useMemo(() => {
    return createGradientObject(props.gradient);
  }, [props.gradient]);

  const [selectedPositionIdx, setSelectedPositionIdx] = useState<number>(0);

  const divRef = useRef<HTMLDivElement>(null);

  const updateGradientCb = useCallback(
    (update: Partial<GradientType>) => {
      const gradientProperty: GradientType = {
        ...createGradientObject(props.gradient),
        ...update,
      };
      const gradientStr = createGradientString(gradientProperty);
      props.updateGradient(props.index, gradientStr);
    },
    [props]
  );

  const selectStopOnClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const { clientX } = event;
      const divRect = divRef.current!.getBoundingClientRect();
      const x = Math.trunc((Math.trunc(clientX - divRect.left) / 250) * 100);
      let stopPresent = false;
      for (let i = 0; i < gradientProperty.positions.length; i++) {
        if (
          x === gradientProperty.positions[i].stop ||
          (Math.abs(x - gradientProperty.positions[i].stop) >= 0 &&
            Math.abs(x - gradientProperty.positions[i].stop) <= 5)
        ) {
          stopPresent = true;
          setSelectedPositionIdx(i);
          break;
        }
      }
      if (!stopPresent) {
        setSelectedPositionIdx(gradientProperty.positions.length);
        updateGradientCb({
          positions: [
            ...gradientProperty.positions,
            {
              stop: x,
              color: toColor(
                "hex",
                gradientProperty.positions[selectedPositionIdx].color.hex || ""
              ),
            },
          ],
        });
      }
    },
    [gradientProperty, updateGradientCb, selectedPositionIdx]
  );

  const deleteStopOnKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        selectedPositionIdx !== null &&
        (event.key === "Backspace" || event.key === "Delete")
      ) {
        if (gradientProperty.positions.length > 2) {
          const copyOfPositions = [...gradientProperty.positions];
          copyOfPositions.splice(selectedPositionIdx, 1);
          updateGradientCb({
            positions: copyOfPositions,
          });
        }
        setSelectedPositionIdx(0);
      }
    },
    [gradientProperty, selectedPositionIdx, updateGradientCb]
  );

  const changeColor = useCallback(
    (index: number, color: string) => {
      const value = positions[index];
      value.color = toColor("hex", color);
      const values = [...positions];
      values.splice(index, 1, value);
      setPositions(values);
      setColor(toColor("hex", color)["hex"]);
    },
    [positions]
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
              name="gradientType"
              id="gradientType"
              style={{
                ...smallText,
                color: gray100,
                backgroundColor: "transparent",
                outline: "none",
                height: "28px",
                paddingLeft: "0.5em",
                borderRadius: "2px",
                width: "145px",
                WebkitAppearance: "none",
                MozAppearance: "none",
              }}
              onChange={(e) => {
                updateGradientCb({ gradientType: e.target.value });
              }}
              value={gradientProperty.gradientType}
            >
              <option value="linearGradient">Linear Gradient</option>
              <option value="radialGradient">Radial Gradient</option>
              <option value="conicGradient">Conic Gradient</option>
            </select>
          </div>
          <div
            onClick={() => {
              // props.updateGradient(props.index, gradientStr);
              props.closeGradientSelector();
            }}
          >
            <Cross />
          </div>
        </div>
        <div
          id="gradientBar"
          ref={divRef}
          onClick={selectStopOnClick}
          onKeyDown={deleteStopOnKeyDown}
          style={{
            backgroundColor: "rebeccapurple",
            backgroundImage: `${gradientStr}`,
            height: "1em",
            width: "250px",
            position: "relative",
          }}
          tabIndex={-1}
        >
          {positions.map((position, index) => (
            <div
              key={index + color}
              style={{
                position: "absolute",
                left: `${position.stop}%`,
                top: "-2px",
                width: "8px",
                height: "1.2em",
                backgroundColor: `${position.color.hex}` || "",
                borderRadius: "3px",
                border: index === selectedPositionIdx ? "1px solid black" : "",
              }}
            />
          ))}
        </div>
        <ColorPicker
          width={250}
          height={200}
          color={
            positions[selectedPositionIdx]
              ? positions[selectedPositionIdx].color
              : toColor("hex", "")
          }
          onChange={(e) => changeColor(selectedPositionIdx, e.hex)}
          onChangeComplete={(e) => {
            changeColor(selectedPositionIdx, e.hex);
            // props.updateGradient(props.index, gradientStr);
          }}
          hideHSV
          dark
        />
        {(gradientType === "linearGradient" ||
          gradientType === "conicGradient") && (
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
              angle={gradientAngle}
              setAngle={setGradientAngle}
              updateGradient={props.updateGradient}
              index={props.index}
              gradient={props.gradient}
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
              {gradientAngle}
            </div>
          </div>
        )}
        {(gradientType === "radialGradient" ||
          gradientType === "conicGradient") && (
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
              Center X-axis
            </div>
            <div style={{ width: "120px" }}>
              <input
                type="range"
                min="0"
                max="125"
                value={xAxis}
                id="xAxis"
                onChange={(e) => setXAxis(parseInt(e.target.value))}
                style={{ width: "120px" }}
              />
            </div>
          </div>
        )}
        {(gradientType === "radialGradient" ||
          gradientType === "conicGradient") && (
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
              Center Y-axis
            </div>
            <div style={{ width: "120px" }}>
              <input
                type="range"
                onChange={(e) => setYAxis(parseInt(e.target.value))}
                min="0"
                max="125"
                value={yAxis}
                id="yAxis"
                style={{ width: "120px" }}
              />
            </div>
          </div>
        )}
        {gradientType === "radialGradient" && (
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
              Shape
            </div>
            <div>
              <select
                name="Select Shape"
                onChange={(e) => {
                  setShapeType(e.target.value);
                  // props.updateGradient(props.index, gradientStr);
                }}
                style={{
                  ...smallText,
                  outline: "none",
                  color: gray100,
                  backgroundColor: gray800,
                  width: "57px",
                  height: "26px",
                  border: "none",
                  borderRadius: "2px",
                }}
                value={shapeType}
              >
                <option
                  style={{
                    textAlign: "left",
                  }}
                  value="circle"
                >
                  Circle
                </option>
                <option
                  style={{
                    textAlign: "left",
                  }}
                  value=""
                >
                  Ellipse
                </option>
              </select>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
