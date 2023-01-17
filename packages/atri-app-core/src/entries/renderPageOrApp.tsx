import React from "react";
import { AtriRouter } from "../router/AtriRouter";
import App from "./App";
import loadPage from "./loadPage";
import renderReactAppClientSide from "./renderReactAppClientSide";

declare global {
  interface Window {
    __APP_STATUS: "started" | "loading" | "loaded";
  }
}

window.__APP_STATUS = "started";

export default function renderPageOrApp(
  path: string,
  PageWrapper: React.FC<any>,
  PageComponent: React.FC<any>
) {
  const atriRouter = new AtriRouter();
  if (window.__APP_STATUS === "loaded") {
    loadPage(atriRouter, path, PageWrapper, PageComponent);
  } else {
    loadPage(atriRouter, path, PageWrapper, PageComponent);
    window.__APP_STATUS = "loading";
    renderReactAppClientSide(atriRouter, App);
    window.__APP_STATUS = "loaded";
  }
}
