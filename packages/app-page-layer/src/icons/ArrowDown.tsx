import React from "react";

export const ArrowDown = React.forwardRef(
  (props, ref: React.Ref<SVGSVGElement>) => {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.5575 6.44336L9 9.87836L12.4425 6.44336L13.5 7.50086L9 12.0009L4.5 7.50086L5.5575 6.44336Z"
          fill="#D1D5DB"
        />
      </svg>
    );
  }
);
