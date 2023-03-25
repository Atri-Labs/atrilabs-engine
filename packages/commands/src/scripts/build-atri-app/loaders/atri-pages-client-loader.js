const processOptions = require("./processOptions");

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
  return `
  import React from "react";
  import DocFn from "./pages/_document";
  import PageWrapper from "./pages/_app";
  import PageFn from "./pages${pagePath}";
  import { renderAppOrReturnPageFC } from "@atrilabs/atri-app-core/src/prod-entries/renderAppOrReturnPageFC";
  ${compImportStatements}
  ${aliasCompMapStatement}
  
  const maybeReactComponent = renderAppOrReturnPageFC({entryPageFC: PageFn, PageWrapper, DocFn, srcs: ${JSON.stringify(
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

  if(typeof maybeReactComponent === "function")
    export default maybeReactComponent;`;
}

module.exports = atriPagesClientLoader;
