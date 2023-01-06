import { smallText, gray100, gray800 } from "@atrilabs/design-system";
import { useRef, useState } from "react";
import { Cross } from "../../icons/Cross";
import { ColorPicker, useColor, toColor, Color } from "react-color-palette";

type GradientColorSelectorTypes = {
  gradient: string;
  repeat: boolean;
  updateGradient: (gradient: string) => void;
};

type Position = {
  stop: number;
  color: Color;
};

export const GradientColorSelector = () => {
  const [gradientType, setGradientType] = useState<string>("linearGradient");

  const [positions, setPositions] = useState<Position[]>([
    { stop: 0, color: toColor("hex", "black") },
    { stop: 100, color: toColor("hex", "red") },
  ]);
  const [selectedPositionIdx, setSelectedPositionIdx] = useState<number>(0);
  const [color, setColor] = useState(positions ? positions[0].color.hex : "");
  const divRef = useRef<HTMLDivElement>(null);

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

  console.log("Gradient Type", positions);
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
      </div>
    </>
  );
};
