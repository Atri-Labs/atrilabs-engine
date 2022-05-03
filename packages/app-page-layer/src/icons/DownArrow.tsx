import React from "react";

export const DownArrow = React.forwardRef(
  (props, ref: React.Ref<SVGSVGElement>) => {
    return (
      <svg
        width="8"
        height="5"
        viewBox="0 0 8 5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        ref={ref}
      >
        <path d="M0.25 0.5L4 4.25L7.75 0.5H0.25Z" fill="#E5E7EB" />
      </svg>
    );
  }
);
