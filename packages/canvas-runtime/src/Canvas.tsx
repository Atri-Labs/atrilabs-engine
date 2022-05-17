import { useRef } from "react";
import { useAutoResize } from "./hooks/useAutoResize";
import { useBreakpoint } from "./hooks/useBreakpoint";

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
  const breakpoint = useBreakpoint();
  const ref = useRef<HTMLDivElement>(null);
  const dimension = useAutoResize(ref, breakpoint);
  return (
    <div
      // this div helps center everything
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundColor: "#6b7280",
      }}
    >
      {breakpoint ? (
        <div
          // this div is used to limit the max-width
          // this div also acts as anchor to detect changes in sizes
          style={{
            ...styles["canvas-container"],
            maxWidth: breakpoint.max,
            width: "100%",
          }}
          ref={ref}
        >
          {dimension ? (
            <div
              // this div is used to scale up when the screen size is too small as compared to breakpoint.min
              style={{
                ...styles["canvas-subcontainer"],
                transform: `scale(${dimension.scale})`,
                minWidth:
                  dimension.scale !== 1 ? `${100 / dimension.scale}%` : "",
                height: dimension.scale ? `${100 / dimension.scale}%` : "",
                transformOrigin: "0 0",
              }}
            >
              <div
                // this div actually contains all dropped elements
                style={{
                  // absolute prevents the height of page to increase when content increases
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
      ) : null}
    </div>
  );
};
