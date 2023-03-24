import React from "react";

export const ComponentTreeContext = React.createContext<{
  [canvasZoneId: string]: { [alias: string]: string[] };
}>({});
