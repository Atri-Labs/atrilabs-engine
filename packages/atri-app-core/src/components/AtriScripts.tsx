import { useContext, useMemo } from "react";
import { AtriScriptsContext } from "../contexts/AtriScriptsContext";

export function AtriScripts() {
  const srcs = useContext(AtriScriptsContext);
  const scripts = useMemo(() => {
    return srcs.map((src) => {
      return <script defer src={src} key={src}></script>;
    });
  }, [srcs]);
  return <>{scripts}</>;
}
