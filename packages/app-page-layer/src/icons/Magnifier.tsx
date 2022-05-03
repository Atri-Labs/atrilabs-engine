import React from "react";

export const Maginfier = React.forwardRef(
  (props, ref: React.Ref<SVGSVGElement>) => {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.75 7H7.355L7.215 6.865C7.705 6.295 8 5.555 8 4.75C8 2.955 6.545 1.5 4.75 1.5C2.955 1.5 1.5 2.955 1.5 4.75C1.5 6.545 2.955 8 4.75 8C5.555 8 6.295 7.705 6.865 7.215L7 7.355V7.75L9.5 10.245L10.245 9.5L7.75 7ZM4.75 7C3.505 7 2.5 5.995 2.5 4.75C2.5 3.505 3.505 2.5 4.75 2.5C5.995 2.5 7 3.505 7 4.75C7 5.995 5.995 7 4.75 7Z"
          fill="#D1D5DB"
        />
      </svg>
    );
  }
);
