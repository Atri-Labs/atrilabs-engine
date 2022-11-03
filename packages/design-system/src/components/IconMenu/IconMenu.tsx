import type { ReactNode } from "react";
import { amber200, gray900 } from "../../consts/colors";

export type IconMenuProps = {
  active?: boolean;
  children: ReactNode;
  onClick: () => void;
};

// controlled component
export const IconMenu: React.FC<IconMenuProps> = (props) => {
  return (
    <div
      onClick={props.onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "2.5rem",
        overflow: "hidden",
        height: "100%",
        background: props.active ? gray900 : "",
        cursor: "pointer",
      }}
    >
      {props.children}

      {props.active ? (
        <div
          style={{
            position: "absolute",
            height: "2px",
            backgroundColor: `${amber200}`,
            bottom: 0,
          }}
        ></div>
      ) : null}
    </div>
  );
};
