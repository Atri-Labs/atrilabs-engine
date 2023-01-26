import React from "react";

export const AtriScriptsContext = React.createContext<{ pages: string[] }>({
  pages: [],
});
