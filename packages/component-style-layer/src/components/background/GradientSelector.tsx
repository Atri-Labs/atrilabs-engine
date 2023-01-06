import { smallText, gray100, gray800 } from "@atrilabs/design-system";
import { useRef, useState } from "react";
import { Cross } from "../../icons/Cross";
import { ColorPicker, useColor, toColor } from "react-color-palette";

type GradientColorSelectorTypes = {
  gradient: string;
  repeat: boolean;
  updateGradient: (gradient: string) => void;
};

export const GradientColorSelector = () => {
  const [gradientType, setGradientType] = useState<string>("linearGradient");

  const [positions, setPositions] = useState<number[]>([0, 100]);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const [color, setColor] = useColor("hex", "");

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX } = event;
    const divRect = divRef.current!.getBoundingClientRect();
    console.log("Gradient Type divReact", event);
    const x = Math.trunc((Math.trunc(clientX - divRect.left) / 250) * 100);
    if (x >= 0 && x <= 100) {
      setSelectedPosition(x);
      setPositions(Array.from(new Set([...positions, x])));
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      selectedPosition !== null &&
      (event.key === "Backspace" || event.key === "Delete")
    ) {
      setPositions(
        positions.filter((position) => position !== selectedPosition)
      );
      setSelectedPosition(null);
    }
  };

  console.log("Gradient Type", selectedPosition);
  return (
    <>
      <style>
        {`#gradientBar:focus-visible {outline: none} #gradientType {border: none} #gradientType:hover {border: 1px solid #fff}`}
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
              key={index * position}
              style={{
                position: "absolute",
                left: `${position}%`,
                top: "-2px",
                width: "8px",
                height: "1.2em",
                backgroundColor: "red",
                borderRadius: "3px",
                border: position === selectedPosition ? "1px solid black" : "",
              }}
            />
          ))}
        </div>
        <ColorPicker
          width={250}
          height={200}
          color={color}
          onChange={(e) => setColor(toColor("hex", e.hex))}
          onChangeComplete={(e) => setColor(toColor("hex", e.hex))}
          hideHSV
          dark
        />
      </div>
    </>
  );
};
