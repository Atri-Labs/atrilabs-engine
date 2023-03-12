import {
  CanvasZoneRenderer,
  LiveCanvasZoneRenderer,
} from "@atrilabs/atri-app-core/src/editor-components";
import { useEffect, useState } from "react";

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
  const [inLiveMode, setInLiveMode] = useState<boolean | null>(null);
  useEffect(() => {
    if (window.location === window.parent.location) {
      setInLiveMode(true);
    } else {
      setInLiveMode(false);
    }
  }, []);
  return inLiveMode !== null ? (
    inLiveMode === false ? (
      <CanvasZoneRenderer canvasZoneId={props.id} styles={props.styles} />
    ) : (
      <LiveCanvasZoneRenderer canvasZoneId={props.id} styles={props.styles} />
    )
  ) : null;
}
