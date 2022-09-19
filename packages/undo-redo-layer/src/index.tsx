import React, { useEffect } from "react";

export default function () {
  useEffect(() => {
    const onUndoPressed = () => {
      console.log("on undo pressed");
    };
    const onRedoPressed = () => {
      console.log("on redo pressed");
    };
    const keyUpCb = (event: KeyboardEvent) => {
      if (window.navigator.userAgent.indexOf("Mac")) {
        if (event.metaKey) {
          if (event.key.toLowerCase() === "z") {
            onUndoPressed();
          } else if (event.key.toLowerCase() === "r") {
            onRedoPressed();
          }
        }
      } else {
        if (event.ctrlKey) {
          if (event.key.toLowerCase() === "z") {
            onUndoPressed();
          } else if (event.key.toLowerCase() === "r") {
            onRedoPressed();
          }
        }
      }
    };
    window.addEventListener("keydown", keyUpCb);
    return () => {
      window.removeEventListener("keydown", keyUpCb);
    };
  }, []);
  return <></>;
}
