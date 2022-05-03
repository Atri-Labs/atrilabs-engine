import React from "react";

export const Folder = React.forwardRef(
  (prop, sref: React.Ref<SVGSVGElement>) => {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 4.5H9L7.5 3H3C2.175 3 1.5075 3.675 1.5075 4.5L1.5 13.5C1.5 14.325 2.175 15 3 15H15C15.825 15 16.5 14.325 16.5 13.5V6C16.5 5.175 15.825 4.5 15 4.5ZM15 13.5H3V6H15V13.5Z"
          fill="#9CA3AF"
        />
      </svg>
    );
  }
);
