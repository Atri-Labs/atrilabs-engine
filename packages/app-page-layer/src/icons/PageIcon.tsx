import React from "react";

export const PageIcon = React.forwardRef(
  (props, ref: React.Ref<SVGSVGElement>) => {
    return (
      <svg
        width="12"
        height="14"
        viewBox="0 0 12 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1 13.5V1H6.83333L11 5.58333V13.5H1Z" stroke="#9CA3AF" />
        <path d="M6.83337 1V6H11" stroke="#9CA3AF" />
      </svg>
    );
  }
);
