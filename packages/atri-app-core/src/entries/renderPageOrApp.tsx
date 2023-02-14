import React from "react";
import App from "./App";
import { AppEntryOptions } from "./AppEntryOptions";
import { atriRouter } from "./atriRouter";
import loadPage from "./loadPage";
import renderReactAppClientSide from "./renderReactAppClientSide";
import "../api/init";
import "../api/canvasApi";

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
    renderReactAppClientSide(atriRouter, App);
    window.__APP_STATUS = "loaded";
  }
}
