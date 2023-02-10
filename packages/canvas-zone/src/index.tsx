import { useMemo } from "react";
import { gray500 } from "@atrilabs/design-system";

/**
 * CanvasZone component is only used during development.
 * In production build, a different CanvasZone will be used that
 * does not modifies the styles when there are no elements in the
 * canvas zone.
 * @param props
 * @returns
 */
export function CanvasZone(props: {
  id: string;
  styles?: React.CSSProperties;
  children?: React.ReactElement[];
}) {
  const styles = useMemo(() => {
    if (props.children === undefined || props.children.length === 0) {
      return {
        ...props.styles,
        height: "200px",
        border: `1px solid ${gray500}`,
      };
    }
  }, [props.styles, props.children]);
  return (
    <div style={styles} data-canvas-id={props.id}>
      {props.children}
    </div>
  );
}
