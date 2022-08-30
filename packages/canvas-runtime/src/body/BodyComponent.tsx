import type { FC, ReactNode } from "react";
import { forwardRef } from "react";

const styles: { [key: string]: React.CSSProperties } = {
  outerDiv: {
    height: "100%",
    minWidth: "100%",
    boxSizing: "border-box",
    position: "relative",
    overflow: "auto",
    /**
     * Setting paddingTop and paddingBottom prevents the problem
     * of parent element getting shifted if first child's top-margin
     * is non-zero.
     *
     * See this:
     * https://stackoverflow.com/questions/1762539/margin-on-child-element-moves-parent-element
     */
    paddingTop: "10px",
    paddingBottom: "10px",
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
