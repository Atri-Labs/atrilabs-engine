import { ProdAppEntryOptions } from "../types";
import { atriRouter } from "../entries/atriRouter";
import renderReactAppClientSide from "./renderReactAppClientSide";
import App from "./App";
import { addPageToStore } from "./store";
import { FinalPageComponent } from "./FinalPageComponent";
import { loadRoutes } from "./loadRoutes";

declare global {
  interface Window {
    __APP_STATUS: "started" | "loading" | "loaded";
  }
}

window.__APP_STATUS = "started";

export default function renderAppOrReturnPageFC(options: ProdAppEntryOptions) {
  const { PageWrapper, entryRouteStore, entryRouteObjectPath, routes, styles } =
    options;
  // add to store
  addPageToStore(entryRouteObjectPath, entryRouteStore);
  if (window.__APP_STATUS === "loaded") {
    // return Page Component
    return (
      <FinalPageComponent
        PageWrapper={PageWrapper}
        Page={
          routes.find((curr) => {
            return curr.path === entryRouteObjectPath;
          })!.PageFC
        }
        styleStr={styles}
      />
    );
  } else {
    // configure rotues here
    loadRoutes(
      { routes, PageWrapper, styles, entryRouteObjectPath },
      { initialEntries: [entryRouteObjectPath], initialIndex: 0 }
    );
    window.__APP_STATUS = "loading";
    renderReactAppClientSide(atriRouter, App);
    window.__APP_STATUS = "loaded";
  }
}
