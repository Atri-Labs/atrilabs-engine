import React, { useEffect, useMemo, useRef, useState } from "react";

export type RearrangeListProps = {
  iconItem: React.ReactNode;
  items: { node: React.ReactNode; key: string }[];
  onReposition: (deleteAt: number, insertAt: number) => void;
};

export const RearrangeList: React.FC<RearrangeListProps> = (props) => {
  const outerDivRef = useRef<HTMLDivElement | null>(null);
  const [mouseDownIndex, setMouseDownIndex] = useState<number | null>(null);
  const [currentMouseIndex, setCurrentMouseIndex] = useState<number | null>(
    null
  );

  const itemsClone = useMemo(() => {
    const itemClone = [...props.items];
    if (
      mouseDownIndex !== null &&
      currentMouseIndex !== null &&
      mouseDownIndex !== currentMouseIndex
    ) {
      const mouseDownItem = itemClone.splice(mouseDownIndex, 1)[0];
      itemClone.splice(currentMouseIndex, 0, mouseDownItem);
    }
    return itemClone;
  }, [props, mouseDownIndex, currentMouseIndex]);

  useEffect(() => {
    // mouse leave on outer div
    // mouse up on outer div
    // mouse move on outer div
    if (mouseDownIndex !== null && outerDivRef.current) {
      const outerEl = outerDivRef.current;
      const { top, height } = outerEl.getBoundingClientRect();
      const numItems = props.items.length;

      const onMouseMove = (e: MouseEvent) => {
        const currentMouseIndex =
          Math.ceil(e.clientY - top) / (height / numItems);
        setCurrentMouseIndex(currentMouseIndex);
      };
      const onMouseUpOrLeave = (e: MouseEvent) => {
        // TODO: call callbacks
        if (currentMouseIndex !== null)
          props.onReposition(mouseDownIndex, currentMouseIndex);
        setCurrentMouseIndex(null);
        setMouseDownIndex(null);
      };
      outerEl.addEventListener("mousemove", onMouseMove);
      outerEl.addEventListener("mouseleave", onMouseUpOrLeave);
      outerEl.addEventListener("mouseup", onMouseUpOrLeave);
      return () => {
        outerEl.removeEventListener("mousemove", onMouseMove);
        outerEl.removeEventListener("mouseleave", onMouseUpOrLeave);
        outerEl.removeEventListener("mouseup", onMouseUpOrLeave);
      };
    }
  }, [mouseDownIndex, props, currentMouseIndex]);
  return (
    <div ref={outerDivRef} style={{ display: "flex", flexDirection: "column" }}>
      {itemsClone.map((item, index) => {
        return (
          <div style={{ display: "flex", flexDirection: "row" }} key={item.key}>
            <div
              style={{
                cursor: mouseDownIndex !== null ? "grabbing" : "grab",
                userSelect: "none",
              }}
              onMouseDown={() => {
                setMouseDownIndex(index);
              }}
            >
              {props.iconItem}
            </div>
            {item.node}
          </div>
        );
      })}
    </div>
  );
};
