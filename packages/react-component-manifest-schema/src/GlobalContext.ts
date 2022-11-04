import React from "react";

export const GlobalContext = React.createContext<{
  window: Window;
}>({
  window,
});
