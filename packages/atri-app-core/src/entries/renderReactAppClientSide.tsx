import React from "react";
import ReactDOM from "react-dom/client";
import "../../styles.scss";
import { RouterContext } from "../contexts/RouterContext";
import { AtriRouter } from "../router/AtriRouter";

export default function renderReactAppClientSide(
  atriRouter: AtriRouter,
  App: React.FC
) {
  ReactDOM.hydrateRoot(
    document.documentElement,
    <React.StrictMode>
      <RouterContext.Provider value={atriRouter}>
        <App />
      </RouterContext.Provider>
    </React.StrictMode>
  );
}
