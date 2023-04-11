const processOptions = require("./processOptions");
const upath = require("upath");

function atriPagesClientLoader() {
  const options = this.getOptions();
  const {
    pagePath,
    compImportStatements,
    aliasCompMapStatement,
    srcs,
    routes,
    styles,
    reactRouteObjectPath,
    entryRouteStore,
    componentTree,
  } = processOptions(options);
  console.log(compImportStatements);
  const route = pagePath
    .replace(/(\.(js|ts)x?)$/, "")
    .replace(/^(\/index)$/, "/");
  return `
  import React from "react";
  import DocFn from "./pages/_document";
  import PageWrapper from "./pages/_app";
  import PageFn from "./pages${upath.toUnix(pagePath)}";
  import renderAppOrReturnPageFC from "@atrilabs/atri-app-core/src/prod-entries/renderAppOrReturnPageFC";
  import { AtriFCStore } from "@atrilabs/atri-app-core/src/prod-entries/AtriFCStore";
  ${compImportStatements}
  ${aliasCompMapStatement}
  
  const maybeReactComponentFC = renderAppOrReturnPageFC({entryPageFC: PageFn, PageWrapper, DocFn, srcs: ${JSON.stringify(
    srcs
  )}, routes: ${JSON.stringify(
    routes.map((route) => {
      return { path: route };
    })
  )}, styles: ${JSON.stringify(styles)}, entryRouteObjectPath: ${JSON.stringify(
    reactRouteObjectPath
  )}, entryRouteStore: ${JSON.stringify(
    entryRouteStore
  )}, aliasCompMap, componentTree: ${JSON.stringify(componentTree)}})

  if(maybeReactComponentFC) {
    AtriFCStore.push("${route}", maybeReactComponentFC)
  }`;
}

module.exports = atriPagesClientLoader;
