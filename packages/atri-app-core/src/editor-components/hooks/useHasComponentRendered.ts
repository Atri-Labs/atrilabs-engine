import { DecoratorData } from "../../types";
import { useEffect, useState } from "react";

export function useHasComponentRendered(props: DecoratorData) {
  const [hasComponentRendered, setHasComponentRendered] = useState(false);
  useEffect(() => {
    setHasComponentRendered(true);
  }, [props.id]);
  return hasComponentRendered;
}
