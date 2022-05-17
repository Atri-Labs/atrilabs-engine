import type { ReactNode } from "react";

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
      }}
    >
      {props.children}
    </div>
  );
};
