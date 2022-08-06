import { RefObject, useEffect, useState } from "react";
import { Dimension } from "../types";

export const useAutoResize = (
  parent: RefObject<HTMLElement>,
  breakpoint: { min: number; max: number } | null
) => {
  const [dimension, setDimension] = useState<Dimension>();
  useEffect(() => {
    if (breakpoint === null) return;

    const rescale = () => {
      if (parent.current) {
        const container = parent.current;
        const width = container.getBoundingClientRect().width;
        // if container is less than 900px then scale = width/900
        // if contianer is not less than 900px then scale = 1
        if (width < breakpoint.min) {
          setDimension({ width: `${width}px`, scale: width / breakpoint.min });
        } else {
          setDimension({ width: `${width}px`, scale: 1 });
        }
      }
    };
    if ("ResizeObserver" in window) {
      if (parent.current) {
        const resizeObserver = new ResizeObserver(() => {
          rescale();
        });
        resizeObserver.observe(parent.current);
        return () => {
          resizeObserver.disconnect();
        };
      }
      return;
    } else {
      rescale();
      window.addEventListener("resize", rescale);
      return () => {
        window.removeEventListener("resize", rescale);
      };
    }
  }, [parent, breakpoint]);
  return dimension;
};
