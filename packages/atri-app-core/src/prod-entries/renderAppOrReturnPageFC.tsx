import { ProdAppEntryOptions } from "../types";
import { atriRouter } from "../entries/atriRouter";
import renderReactAppClientSide from "./renderReactAppClientSide";
import App from "./App";
import { addPageToStore } from "./store";
import { FinalPageComponent } from "./FinalPageComponent";

declare global {
  interface Window {
    __APP_STATUS: "started" | "loading" | "loaded";
  }
}

window.__APP_STATUS = "started";

export default function renderAppOrReturnPageFC(options: ProdAppEntryOptions) {
  const { PageWrapper, entryRouteStore, entryRouteObjectPath, routes } =
    options;
  // add to store
  addPageToStore(entryRouteStore);
  // add <style> tag to body (move this task to renderReactAppClientSide)
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
      />
    );
  } else {
    // configure rotues here
    window.__APP_STATUS = "loading";
    renderReactAppClientSide(atriRouter, App);
    window.__APP_STATUS = "loaded";
  }
}
