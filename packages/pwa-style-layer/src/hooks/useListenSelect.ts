import { useEffect, useState } from "react";

export function useListenSelect() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const cb = (ev: MessageEvent) => {
      if (ev.data?.type === "select") {
        setSelectedId(ev.data.id);
      }
      if (ev.data?.type === "selectEnd") {
        setSelectedId(null);
      }
    };
    window.addEventListener("message", cb);
    return () => {
      window.removeEventListener("message", cb);
    };
  }, []);

  return { selectedId };
}
