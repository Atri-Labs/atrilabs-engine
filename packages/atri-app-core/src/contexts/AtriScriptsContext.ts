import React from "react";

export const AtriScriptsContext = React.createContext<{
  pages: string[];
  manifestRegistry: string;
}>({
  pages: [],
  manifestRegistry: "",
});
