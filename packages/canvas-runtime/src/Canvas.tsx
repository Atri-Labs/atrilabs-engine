import { Container, getRef } from "@atrilabs/core";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { DecoratorRenderer } from "./DecoratorRenderer";
import { acknowledgeEventPropagation } from "./decorators/CanvasActivityDecorator";
import { useAutoResize } from "./hooks/useAutoResize";
import { useBindEvents } from "./hooks/useBindEvents";
import { useBreakpoint } from "./hooks/useBreakpoint";
import { useDragDrop } from "./hooks/useDragDrop";
import { useHintOverlays } from "./hooks/useHintOverlays";
import { useSubscribeStylesheetUpdates } from "./hooks/useSubscribeStylesheet";
import { GlobalContext } from "@atrilabs/core";
import { useAttachEventsToIframe } from "./hooks/useAttachEventsToIframe";

const styles: { [key: string]: React.CSSProperties } = {
  "canvas-container": {
    backgroundColor: "#e5e5e5",
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

export const Canvas: React.FC = React.memo(() => {
  const breakpoint = useBreakpoint();
  const ref = useRef<HTMLDivElement>(null);
  const dimension = useAutoResize(ref, breakpoint);
  const dragzoneRef = getRef("Dragzone");
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement | null>(null);
  useAttachEventsToIframe({ iframe: iframeRef });
  const { overlay, canvasOverlay } = useDragDrop(dragzoneRef, iframeRef);
  const { stylesheets } = useSubscribeStylesheetUpdates();
  useEffect(() => {
    if (iframeRef && iframeRef.contentWindow) {
      acknowledgeEventPropagation(iframeRef.contentWindow);
    }
  }, [iframeRef, iframeRef?.contentWindow]);
  const hintOverlays = useHintOverlays();
  useBindEvents(iframeRef);
  const { portals } = useContext(GlobalContext);
  const globalContextValue = useMemo(() => {
    if (iframeRef?.contentWindow)
      return { window: iframeRef.contentWindow, portals };
  }, [iframeRef, portals]);
  return (
    <>
      <div
        // this div helps center everything
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          backgroundColor: "#6b7280",
          userSelect: "none",
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
                <iframe
                  title="canvas"
                  ref={setIframeRef}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    boxSizing: "border-box",
                  }}
                >
                  {iframeRef && iframeRef.contentDocument && globalContextValue
                    ? ReactDOM.createPortal(
                        <>
                          <style
                            dangerouslySetInnerHTML={{
                              __html: `* {padding: 0; margin: 0;}`,
                            }}
                          ></style>
                          <GlobalContext.Provider value={globalContextValue}>
                            <DecoratorRenderer
                              compId="body"
                              decoratorIndex={0}
                            />
                          </GlobalContext.Provider>
                          {canvasOverlay ? (
                            <div style={canvasOverlay.style}>
                              <canvasOverlay.comp {...canvasOverlay.props} />
                            </div>
                          ) : null}
                          {stylesheets}
                          {/*
                          hint overlays are sibling of body because they need to be scroll along with
                          the component they are overlayed with respect to.
                          */}
                          {hintOverlays.map((hint) => {
                            return hint;
                          })}
                        </>,
                        iframeRef.contentDocument.body
                      )
                    : null}
                </iframe>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      {overlay ? (
        <Container name="PlaygroundOverlayContainer" onClose={() => {}}>
          <div style={overlay.style}>
            <overlay.comp {...overlay.props} />
          </div>
        </Container>
      ) : null}
    </>
  );
});
