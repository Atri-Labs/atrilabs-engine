import { useEffect } from "react";
import { subscribeCanvasMachine } from "../../../api";

export function useDropzoneHints() {
  useEffect(() => {
    return subscribeCanvasMachine("moveWhileDrag", () => {
      console.log("wiring working properly");
    });
  }, []);
}
