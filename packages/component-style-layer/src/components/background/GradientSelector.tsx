import { smallText, gray100, gray800 } from "@atrilabs/design-system";
import { useState } from "react";
import { Cross } from "../../icons/Cross";

type GradientColorSelectorTypes = {
  gradient: string;
  repeat: boolean;
  updateGradient: (gradient: string) => void;
};

export const GradientColorSelector = () => {
  const [gradientType, setGradientType] = useState<string>("linearGradient");
  const [gradientTypeHover, setGradientTypeHover] = useState<boolean>(false);
  console.log("Gradient Type", gradientType);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#374151",
        padding: "10px",
        borderRadius: "8px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <select
            name="gradientType"
            style={{
              ...smallText,
              color: gray100,
              backgroundColor: "transparent",
              outline: "none",
              height: "28px",
              paddingLeft: "0.5em",
              border: gradientTypeHover ? "1px solid #000" : "none",
              borderRadius: "2px",
              width: "145px",
              WebkitAppearance: "none",
              MozAppearance: "none",
            }}
            onChange={(e) => setGradientType(e.target.value)}
            value={gradientType}
            onMouseEnter={() => setGradientTypeHover(true)}
            onMouseLeave={() => setGradientTypeHover(false)}
          >
            <option value="linearGradient">Linear Gradient</option>
            <option value="radialGradient">Radial Gradient</option>
            <option value="conicGradient">Conic Gradient</option>
          </select>
        </div>
        <Cross />
      </div>
    </div>
  );
};
