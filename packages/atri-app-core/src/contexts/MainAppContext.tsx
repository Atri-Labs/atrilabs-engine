import React from "react";

export const MainAppContext = React.createContext<{
  App: React.ReactElement | null;
}>({ App: null });
