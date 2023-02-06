import React from "react";
import App from "./App";
import { AppEntryOptions } from "./AppEntryOptions";
import { atriRouter } from "./atriRouter";
import loadPage from "./loadPage";
import renderReactAppClientSide from "./renderReactAppClientSide";
import { canvasMachineInterpreter, subscribeCanvasMachine } from "./init";

declare global {
  interface Window {
    __APP_STATUS: "started" | "loading" | "loaded";
  }
}

window.__APP_STATUS = "started";

export default function renderPageOrApp(options: AppEntryOptions) {
  const { routeObjectPath, PageComponent, PageWrapper } = options;
  if (window.__APP_STATUS === "loaded") {
    loadPage(atriRouter, routeObjectPath, PageWrapper, PageComponent);
  } else {
    loadPage(atriRouter, routeObjectPath, PageWrapper, PageComponent);
    window.__APP_STATUS = "loading";
    canvasMachineInterpreter.start();
    subscribeCanvasMachine("ready", () => {
      window.parent.postMessage("ready", "*");
    });
    if (window.location !== window.parent.location) {
      canvasMachineInterpreter.send({ type: "IFRAME_DETECTED" });
    } else {
      canvasMachineInterpreter.send({ type: "TOP_WINDOW_DETECTED" });
    }
    window.addEventListener("load", () => {
      canvasMachineInterpreter.send({ type: "WINDOW_LOADED" });
    });
    renderReactAppClientSide(atriRouter, App);
    window.__APP_STATUS = "loaded";
  }
}
