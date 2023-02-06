import { useAppInfo } from "./hooks/useAppInfo";
import { useAppLocation } from "./hooks/useAppLocation";
import { useRef } from "react";

export default function () {
  const ref = useRef<HTMLIFrameElement>(null);
  const { appInfo } = useAppInfo();
  const { currentRouteObjectPath } = useAppLocation();
  if (appInfo?.hostname)
    console.log(new URL(currentRouteObjectPath, appInfo?.hostname).href);
  return (
    <div style={{ height: "100%", width: "100%" }}>
      {appInfo?.hostname ? (
        <iframe
          ref={ref}
          key={currentRouteObjectPath}
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
  );
}
