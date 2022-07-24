import { subscribeCanvasActivity } from "@atrilabs/canvas-runtime";
import { useEffect, useState } from "react";

export const useComponentSelected = () => {
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    const unsub = subscribeCanvasActivity("select", (context, _event) => {
      if (context.select?.id) setSelected(context.select.id);
    });
    return unsub;
  }, []);
  useEffect(() => {
    const unsub = subscribeCanvasActivity("selectEnd", (_context, _event) => {
      setSelected(null);
    });
    return unsub;
  }, []);
  return { selected };
};
