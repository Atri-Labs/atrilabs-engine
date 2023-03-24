import { useContext } from "react";
import { AliasCompMapContext, ComponentTreeContext } from "../prod-contexts";

export function CanvasZone(props: { id: string }) {
  // TODO
  // useLocation to get location & route
  // use the route to get the data from store
  // use the callbacks to hydrate
  const aliasCompMap = useContext(AliasCompMapContext)[props.id];
  const compTree = useContext(ComponentTreeContext)[props.id];
  return <div>{}</div>;
}
