import { useAppInfo } from "./hooks/useAppInfo";
import { useAppLocation } from "./hooks/useAppLocation";
import { useRef } from "react";
import { useAutoResize } from "./hooks/useAutoResize";
import { useGetActiveBreakpoint } from "./hooks/useGetActiveBreakpoint";

const styles: { [key: string]: React.CSSProperties } = {
  "canvas-container": {
    boxSizing: "border-box",
    height: "100%",
    position: "relative",
    overflow: "hidden",
  },
  "canvas-subcontainer": {
    background: "white",
    boxSizing: "border-box",
    overflow: "hidden",
  },
};

export default function () {
  const ref = useRef<HTMLIFrameElement>(null);
  const { appInfo } = useAppInfo();
  const { currentRouteObjectPath } = useAppLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { breakpoint } = useGetActiveBreakpoint();
  const dimension = useAutoResize(containerRef, breakpoint);
  return (
    <div style={{ height: "100%", width: "100%", backgroundColor: "#e5e5e5" }}>
      {breakpoint ? (
        <div
          // this div is used to limit the max-width
          // this div also acts as anchor to detect changes in sizes
          style={{
            ...styles["canvas-container"],
            maxWidth: breakpoint.min,
            width: "100%",
            margin: "0 auto",
          }}
          ref={containerRef}
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
              {appInfo?.hostname ? (
                <iframe
                  ref={ref}
                  src={new URL(currentRouteObjectPath, appInfo.hostname).href}
                  title="canvas"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    boxSizing: "border-box",
                  }}
                ></iframe>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
