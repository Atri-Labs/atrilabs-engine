import { useEffect } from "react";
import { subscribeCanvasActivity } from "@atrilabs/canvas-runtime";

export default function () {
  useEffect(() => {
    const unsub = subscribeCanvasActivity("hover", (context, event) => {
      console.log("hovered", context, event);
    });
    return unsub;
  }, []);
  useEffect(() => {
    const unsub = subscribeCanvasActivity("hoverEnd", (context, event) => {
      console.log("hoverEnd", context, event);
    });
    return unsub;
  }, []);
  useEffect(() => {
    const unsub = subscribeCanvasActivity("select", (context, event) => {
      console.log("select", context, event);
    });
    return unsub;
  }, []);
  useEffect(() => {
    const unsub = subscribeCanvasActivity("selectEnd", (context, event) => {
      console.log("selectEnd", context, event);
    });
    return unsub;
  }, []);
  useEffect(() => {
    const unsub = subscribeCanvasActivity(
      "hoverWhileSelected",
      (context, event) => {
        console.log("hoverWhileSelected", context, event);
      }
    );
    return unsub;
  }, []);
  useEffect(() => {
    const unsub = subscribeCanvasActivity(
      "hoverWhileSelectedEnd",
      (context, event) => {
        console.log("hoverWhileSelectedEnd", context, event);
      }
    );
    return unsub;
  }, []);
  useEffect(() => {
    const unsub = subscribeCanvasActivity("dragStart", (context, event) => {
      console.log("dragStart", context, event);
    });
    return unsub;
  }, []);
  useEffect(() => {
    const unsub = subscribeCanvasActivity(
      "dropzoneCreated",
      (context, event) => {
        console.log("dropzoneCreated", context, event);
      }
    );
    return unsub;
  }, []);
  useEffect(() => {
    const unsub = subscribeCanvasActivity(
      "dropzoneDestroyed",
      (context, event) => {
        console.log("dropzoneDestroyed", context, event);
      }
    );
    return unsub;
  }, []);
  useEffect(() => {
    const unsub = subscribeCanvasActivity("dragEnd", (context, event) => {
      console.log("dragEnd", context, event);
    });
    return unsub;
  }, []);
  useEffect(() => {
    const unsub = subscribeCanvasActivity("dragCancel", (context, event) => {
      console.log("dragCancel", context, event);
    });
    return unsub;
  }, []);
  return <></>;
}
