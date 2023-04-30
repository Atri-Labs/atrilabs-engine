import { AliasCompMapContextType } from "../types";
import { useMemo, useEffect, useState } from "react";
import { callbackFactory } from "./callbackFactory";
import { getStoreForAlias, subscribePropsUpdated } from "../prod-entries";
import { useLocation } from "react-router-dom";

export function NormalRenderer(props: {
  alias: string;
  aliasCompMap: AliasCompMapContextType;
}) {
  const { alias, aliasCompMap } = props;
  const { Comp, ref, actions, handlers } = aliasCompMap[alias]!;
  const callbacks = useMemo(() => {
    return callbackFactory({ alias, actions, handlers });
  }, [actions, handlers, alias]);
  const location = useLocation();
  const [aliasProps, setAliasProps] = useState(
    getStoreForAlias(location.pathname, alias)
  );
  useEffect(() => {
    return subscribePropsUpdated(location.pathname, alias, () => {
      setAliasProps(getStoreForAlias(location.pathname, alias));
    });
  }, [location, alias]);
  return (
    <Comp
      ref={ref}
      {...callbacks}
      id={alias}
      className={alias}
      {...aliasProps}
      styles={aliasProps["styles"] || {}}
    />
  );
}
