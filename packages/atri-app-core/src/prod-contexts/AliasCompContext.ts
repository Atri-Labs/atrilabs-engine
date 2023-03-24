import React from "react";

export const AliasCompMapContext = React.createContext<{
  [alias: string]: { Comp: React.FC<any>; ref: React.RefObject<HTMLElement> };
}>({});
