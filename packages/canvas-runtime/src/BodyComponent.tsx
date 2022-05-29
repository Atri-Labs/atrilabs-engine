import type { FC, ReactNode } from "react";
import { forwardRef } from "react";
import { Catcher } from "./types";

const styles: { [key: string]: React.CSSProperties } = {
  outerDiv: {
    minHeight: "100%",
    minWidth: "100%",
  },
};

type BodyComponentProps = {
  children: ReactNode[];
};

export const BodyComponent: FC<BodyComponentProps> = forwardRef<
  HTMLDivElement,
  BodyComponentProps
>((props, ref) => {
  return (
    <div style={styles.outerDiv} ref={ref}>
      {props.children.map((child) => {
        return child;
      })}
    </div>
  );
});

const componentCatcher: Catcher = (dragData, _loc) => {
  if (dragData.type === "component") {
    return true;
  }
  return false;
};
export const bodyCatchers: Catcher[] = [componentCatcher];
