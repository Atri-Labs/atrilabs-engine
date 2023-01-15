import React from "react";
import App from "./App";
import loadPage from "./loadPage";
import renderReactApp from "./renderReactApp";

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
  if (window.__APP_STATUS === "loaded") {
    loadPage(path, PageWrapper, PageComponent);
  } else {
    loadPage(path, PageWrapper, PageComponent);
    window.__APP_STATUS = "loading";
    renderReactApp(App);
    window.__APP_STATUS = "loaded";
  }
}
