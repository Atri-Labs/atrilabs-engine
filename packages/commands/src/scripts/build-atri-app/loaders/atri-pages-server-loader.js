const processOptions = require("./processOptions");
const upath = require("upath");

function atriPagesServerLoader() {
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
  import PageFn from "./pages${upath.toUnix(pagePath)}";
  import { renderPageServerSide } from "@atrilabs/atri-app-core/src/prod-entries";
  ${compImportStatements}
  ${aliasCompMapStatement}
  
  function renderPage(){
    return renderPageServerSide({entryPageFC: PageFn, PageWrapper, DocFn, srcs: ${JSON.stringify(
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
  }

  export default { renderPage };`;
}

module.exports = atriPagesServerLoader;
