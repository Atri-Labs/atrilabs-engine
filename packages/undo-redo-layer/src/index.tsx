import { useEffect } from "react";
import { useStoreUndoRedoEvents } from "./hooks/useStoreUndoRedoEvents";

export default function () {
  const { undo, redo } = useStoreUndoRedoEvents();
  useEffect(() => {
    const onUndoPressed = () => {
      console.log("on undo pressed");
      undo();
    };
    const onRedoPressed = () => {
      console.log("on redo pressed");
      redo();
    };
    const keyUpCb = (event: KeyboardEvent) => {
      if (window.navigator.userAgent.indexOf("Mac") >= 0) {
        if (event.metaKey) {
          if (event.key.toLowerCase() === "z" && !event.shiftKey) {
            onUndoPressed();
          } else if (event.key.toLowerCase() === "z" && event.shiftKey) {
            onRedoPressed();
          }
        }
      } else {
        if (event.ctrlKey) {
          if (event.key.toLowerCase() === "z") {
            onUndoPressed();
          } else if (event.key.toLowerCase() === "y") {
            onRedoPressed();
          }
        }
      }
    };
    window.addEventListener("keydown", keyUpCb);
    return () => {
      window.removeEventListener("keydown", keyUpCb);
    };
  }, [undo, redo]);
  return <></>;
}
