import React from "react";

export const AtriScriptsContext = React.createContext<{
  base: string[];
  pages: string[];
  manifestRegistry: string;
}>({
  base: [],
  pages: [],
  manifestRegistry: "",
});
