import { smallText, gray100, gray800 } from "@atrilabs/design-system";
import { useMemo, useRef, useState } from "react";
import { Cross } from "../../icons/Cross";
import { ColorPicker, toColor, Color } from "react-color-palette";

type Position = {
  stop: number;
  color: Color;
};

const AngleSelector: React.FC<{ angle: string }> = (props) => {
  return (
    <div
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

export const GradientColorSelector = () => {
  const [gradientType, setGradientType] = useState<string>("linearGradient");
  const [shapeType, setShapeType] = useState<string>("circle");
  const [xAxis, setXAxis] = useState<number>(50);
  const [yAxis, setYAxis] = useState<number>(50);

  const [positions, setPositions] = useState<Position[]>([
    { stop: 0, color: toColor("hex", "black") },
    { stop: 100, color: toColor("hex", "red") },
  ]);
  const [selectedPositionIdx, setSelectedPositionIdx] = useState<number>(0);
  const [color, setColor] = useState(positions ? positions[0].color.hex : "");
  const [gradientAngle, setGradientAngle] = useState("0");
  const divRef = useRef<HTMLDivElement>(null);

  const gradient = useMemo(() => {
    const tempPositions = [...positions];
    tempPositions.sort((ob1, ob2) => (ob1.stop > ob2.stop ? 1 : -1));
    let linearGradientStr = `linear-gradient(${gradientAngle}deg`;
    for (let i = 0; i < tempPositions.length; i++) {
      linearGradientStr += `, ${tempPositions[i].color.hex} ${tempPositions[i].stop}%`;
    }
    linearGradientStr += ")";
    return linearGradientStr || "";
  }, [gradientAngle, positions]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
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
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      selectedPositionIdx !== null &&
      (event.key === "Backspace" || event.key === "Delete")
    ) {
      setPositions(positions.filter((_, idx) => idx !== selectedPositionIdx));
      setSelectedPositionIdx(0);
    }
  };

  const changeColor = (index: number, color: string) => {
    const value = positions[index];
    value.color = toColor("hex", color);
    const values = [...positions];
    values.splice(index, 1, value);
    setPositions(values);
    setColor(toColor("hex", color)["hex"]);
  };

  console.log("Gradient", shapeType, xAxis, yAxis);

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
              onChange={(e) => setGradientType(e.target.value)}
              value={gradientType}
            >
              <option value="linearGradient">Linear Gradient</option>
              <option value="radialGradient">Radial Gradient</option>
              <option value="conicGradient">Conic Gradient</option>
            </select>
          </div>
          <Cross />
        </div>
        <div
          id="gradientBar"
          ref={divRef}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          style={{
            backgroundColor: "rebeccapurple",
            backgroundImage: `${gradient}`,
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
          onChangeComplete={(e) => changeColor(selectedPositionIdx, e.hex)}
          hideHSV
          dark
        />
        {gradientType === "linearGradient" && (
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
            <div style={{ width: "55px" }}>
              <input
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
                }}
                value={gradientAngle}
                onChange={(e) => setGradientAngle(e.target.value)}
              />
            </div>
            <AngleSelector angle={gradientAngle} />
          </div>
        )}
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
              onChange={(e) => setShapeType(e.target.value)}
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
                value="ellipse"
              >
                Ellipse
              </option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};
