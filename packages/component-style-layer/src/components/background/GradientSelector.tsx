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
  setAngle: React.Dispatch<React.SetStateAction<number>>;
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
        ></div>
      </div>
    </div>
  );
};

export const GradientColorSelector: React.FC<GradientSelectorType> = (
  props
) => {
  const gradientProperty = useMemo(() => {
    let prevGradient: GradientType = {
      repeat: false,
      gradientType: "linearGradient",
      shapeType: "",
      xAxis: 0,
      yAxis: 0,
      positions: [],
      gradientAngle: 0,
    };

    let gradientStr = props.gradient;
    gradientStr = gradientStr.replace("(", ",");
    gradientStr = gradientStr.replace(")", "");

    const [type, control, ...colors] = gradientStr.split(",");
    if (type[0] === "r" && type[1] === "e") {
      prevGradient.repeat = true;
    }
    prevGradient.gradientType = type
      .replace("repeating-", "")
      .replace("-g", "G");

    for (let i = 0; i < colors.length; i++) {
      const [color, stop] = colors[i].trim().split(" ");
      prevGradient.positions[i] = {
        stop: parseInt(stop),
        color: toColor("hex", color),
      };
    }

    if (prevGradient.gradientType === "linearGradient") {
      prevGradient.gradientAngle = parseInt(control);
    } else if (prevGradient.gradientType === "radialGradient") {
      const controls = control.split(" ");
      prevGradient.shapeType = controls[0];
      prevGradient.xAxis = parseInt(controls[2]);
      prevGradient.yAxis = parseInt(controls[3]);
    } else if (prevGradient.gradientType === "conicGradient") {
      const controls = control.split(" ");
      prevGradient.gradientAngle = parseInt(controls[1]);
      prevGradient.xAxis = parseInt(controls[3]);
      prevGradient.yAxis = parseInt(controls[4]);
    }

    return prevGradient;
  }, [props.gradient]);

  const [gradientType, setGradientType] = useState<string>(
    gradientProperty.gradientType
  );
  const [shapeType, setShapeType] = useState<string>(
    gradientProperty.shapeType
  );
  const [xAxis, setXAxis] = useState<number>(gradientProperty.xAxis);
  const [yAxis, setYAxis] = useState<number>(gradientProperty.yAxis);

  const [positions, setPositions] = useState<Position[]>(
    gradientProperty.positions
  );
  const [selectedPositionIdx, setSelectedPositionIdx] = useState<number>(0);
  const [color, setColor] = useState(positions ? positions[0].color.hex : "");
  const [gradientAngle, setGradientAngle] = useState(
    gradientProperty.gradientAngle
  );
  const divRef = useRef<HTMLDivElement>(null);

  const gradientStr = useMemo(() => {
    const tempPositions = [...positions];
    tempPositions.sort((ob1, ob2) => (ob1.stop > ob2.stop ? 1 : -1));
    let gradientStr = "";
    if (gradientProperty.repeat) gradientStr += "repeating-";
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
  }, [
    gradientAngle,
    gradientProperty.repeat,
    gradientType,
    positions,
    shapeType,
    xAxis,
    yAxis,
  ]);

  const selectStopOnClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const { clientX } = event;
      const divRect = divRef.current!.getBoundingClientRect();
      const x = Math.trunc((Math.trunc(clientX - divRect.left) / 250) * 100);
      let stopPresent = false;
      for (let i = 0; i < positions.length; i++) {
        if (
          x === positions[i].stop ||
          (Math.abs(x - positions[i].stop) >= 0 &&
            Math.abs(x - positions[i].stop) <= 5)
        ) {
          stopPresent = true;
          setSelectedPositionIdx(i);
          break;
        }
      }
      if (!stopPresent) {
        setSelectedPositionIdx(positions.length);
        setPositions([
          ...positions,
          { stop: x, color: toColor("hex", color || "") },
        ]);
      }
    },
    [color, positions]
  );

  const deleteStopOnKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        selectedPositionIdx !== null &&
        (event.key === "Backspace" || event.key === "Delete")
      ) {
        if (positions.length > 2)
          setPositions(
            positions.filter((_, idx) => idx !== selectedPositionIdx)
          );
        setSelectedPositionIdx(0);
      }
    },
    [positions, selectedPositionIdx]
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
                setGradientType(e.target.value);
                props.updateGradient(props.index, gradientStr);
              }}
              value={gradientType}
            >
              <option value="linearGradient">Linear Gradient</option>
              <option value="radialGradient">Radial Gradient</option>
              <option value="conicGradient">Conic Gradient</option>
            </select>
          </div>
          <div
            onClick={() => {
              props.updateGradient(props.index, gradientStr);
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
            props.updateGradient(props.index, gradientStr);
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
            <AngleSelector angle={gradientAngle} setAngle={setGradientAngle} />
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
                  props.updateGradient(props.index, gradientStr);
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
