import type { FC, ReactNode } from "react";
import { forwardRef } from "react";

const styles: { [key: string]: React.CSSProperties } = {
  outerDiv: {
    height: "100%",
    minWidth: "100%",
    boxSizing: "border-box",
    position: "relative",
    overflow: "auto",
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
