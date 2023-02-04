import { useEffect } from "react";

export default function CanvasZone(props: {
  id: string;
  styles: React.CSSProperties;
}) {
  useEffect(() => {
    // canvas zone active
    // canvas zone unregistered
    // mouse in
    // mouse out
    // mouse up
  }, []);
  return <div style={props.styles}>Canvas Zone</div>;
}
