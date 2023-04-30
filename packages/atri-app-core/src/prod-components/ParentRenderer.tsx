import { AliasCompMapContextType, ComponentTreeContextType } from "../types";
import { useMemo, useEffect, useState } from "react";
import { callbackFactory } from "./callbackFactory";
import { getStoreForAlias, subscribePropsUpdated } from "../prod-entries";
import { useLocation } from "react-router-dom";
import { NormalRenderer } from "./NormalRenderer";

export function ParentRenderer(props: {
  alias: string;
  aliasCompMap: AliasCompMapContextType;
  componentTreeMap: ComponentTreeContextType["canvasZoneId"];
}) {
  const { alias, aliasCompMap, componentTreeMap } = props;
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
    >
      {componentTreeMap[alias]?.map((childAlias) => {
        if (aliasCompMap[alias].type !== "normal") {
          return (
            <ParentRenderer
              alias={childAlias}
              aliasCompMap={aliasCompMap}
              componentTreeMap={componentTreeMap}
              key={childAlias}
            />
          );
        } else {
          return (
            <NormalRenderer
              alias={childAlias}
              aliasCompMap={aliasCompMap}
              key={childAlias}
            />
          );
        }
      })}
    </Comp>
  );
}
