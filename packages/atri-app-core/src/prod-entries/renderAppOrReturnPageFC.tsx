import { ProdAppEntryOptions } from "../types";
import { atriRouter } from "../entries/atriRouter";
import renderReactAppClientSide from "./renderReactAppClientSide";
import App from "./App";
import { addPageToStore } from "./store";
import { FinalPageComponent } from "./FinalPageComponent";
import { loadRoutes } from "./loadRoutes";
import { AliasCompMapContext, ComponentTreeContext } from "../prod-contexts";

declare global {
  interface Window {
    __APP_STATUS: "started" | "loading" | "loaded";
  }
}

window.__APP_STATUS = "started";

export default function renderAppOrReturnPageFC(options: ProdAppEntryOptions) {
  const {
    PageWrapper,
    entryRouteStore,
    entryRouteObjectPath,
    routes,
    styles,
    entryPageFC,
    componentTree,
    aliasCompMap,
  } = options;
  // add to store
  addPageToStore(entryRouteObjectPath, entryRouteStore);
  if (window.__APP_STATUS === "loaded") {
    // return Page Component
    return (
      <AliasCompMapContext.Provider value={aliasCompMap}>
        <ComponentTreeContext.Provider value={componentTree}>
          <FinalPageComponent
            PageWrapper={PageWrapper}
            Page={entryPageFC}
            styleStr={styles}
          />
        </ComponentTreeContext.Provider>
      </AliasCompMapContext.Provider>
    );
  } else {
    // configure rotues here
    loadRoutes(
      {
        routes,
        PageWrapper,
        styles,
        entryRouteObjectPath,
        entryPageFC,
        componentTree,
        aliasCompMap,
        entryRouteStore,
      },
      { initialEntries: [entryRouteObjectPath], initialIndex: 0 }
    );
    window.__APP_STATUS = "loading";
    renderReactAppClientSide(atriRouter, App);
    window.__APP_STATUS = "loaded";
  }
}
