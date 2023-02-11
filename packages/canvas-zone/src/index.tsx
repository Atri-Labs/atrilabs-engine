import { CanvasZoneRenderer } from "@atrilabs/atri-app-core/src/editor-components";
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
}) {
  return <CanvasZoneRenderer canvasZoneId={props.id} styles={props.styles} />;
}
