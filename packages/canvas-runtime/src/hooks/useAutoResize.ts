import { RefObject, useEffect, useState } from "react";

export const useAutoResize = (parent: RefObject<HTMLElement>) => {
  const [dimension, setDimension] = useState<{
    width: string;
    scale: number;
  }>();
  useEffect(() => {
    const rescale = () => {
      if (parent.current) {
        const container = parent.current;
        const width = container.getBoundingClientRect().width;
        // if container is less than 900px then scale = width/900
        // if contianer is not less than 900px then scale = 1
        if (width < 900) {
          setDimension({ width: `${width}px`, scale: width / 900 });
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
  }, [parent]);
  return dimension;
};
