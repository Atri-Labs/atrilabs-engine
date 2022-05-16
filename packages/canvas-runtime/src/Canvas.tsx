import { useRef } from "react";
import { useAutoResize } from "./hooks/useAutoResize";

const styles: { [key: string]: React.CSSProperties } = {
  "canvas-container": {
    backgroundColor: "#e5e5e5",
    boxSizing: "border-box",
    height: "100%",
    position: "relative",
  },
  "canvas-subcontainer": {
    background: "white",
    boxSizing: "border-box",
    overflow: "auto",
    border: "6px solid #6b7280",
  },
};

export const Canvas: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const dimension = useAutoResize(ref);
  return (
    <div style={styles["canvas-container"]} ref={ref}>
      {dimension ? (
        <div
          style={{
            ...styles["canvas-subcontainer"],
            transform: `scale(${dimension.scale})`,
            width: dimension.scale ? `${100 / dimension.scale}%` : "",
            height: dimension.scale ? `${100 / dimension.scale}%` : "",
            transformOrigin: "0 0",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            {Array.from(Array(1000).keys()).map((i) => (
              <div key={i}>Content goes here</div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
