function atriPagesServerLoader() {
  const options = this.getOptions();
  const { pagePath, reactRouteObjectPath } = options;
  let {
    srcs,
    routes,
    entryRouteStore,
    styles,
    aliasCompMap,
    componentTree,
    componentMap,
  } = options;
  if (srcs === undefined) srcs = "[]";
  if (routes === undefined) routes = "[]";
  if (entryRouteStore === undefined) entryRouteStore = "{}";
  if (aliasCompMap === undefined) aliasCompMap = "{}";
  if (componentTree === undefined) componentTree = "{}";
  if (componentMap === undefined) componentMap = "{}";
  if (styles === undefined) styles = "";
  if (pagePath === undefined) {
    const err = Error();
    err.name = "ValueError";
    err.message = `Expected defined value for srcs or pagePath. Got ${srcs}, ${pagePath} respectively.`;
    throw err;
  }
  srcs = JSON.parse(srcs);
  routes = JSON.parse(routes);
  entryRouteStore = JSON.parse(entryRouteStore);
  aliasCompMap = JSON.parse(aliasCompMap);
  componentTree = JSON.parse(componentTree);
  /**
   * @type {{[pkg: string]: {[key: string]: string}}}
   */
  componentMap = JSON.parse(componentMap);
  /**
   * @type {{[pkg: string]: {[key: string]: string}}}
   */
  const flatennedComponentMap = {};
  let counter = 0;
  Object.keys(componentMap).reduce((prev, pkg) => {
    Object.keys(componentMap[pkg]).reduce((prev, key) => {
      if (prev[pkg] === undefined) prev[pkg] = {};
      prev[pkg][key] = `Comp${counter}`;
      counter++;
      return prev;
    }, prev);
    return prev;
  }, flatennedComponentMap);
  const compImportStatements = Object.keys(flatennedComponentMap)
    .map((pkg) => {
      return Object.keys(flatennedComponentMap[pkg])
        .map((key) => {
          return `import ${flatennedComponentMap[pkg][key]} from "${componentMap[pkg][key]}";`;
        })
        .join("\n");
    })
    .join("\n");
  const aliasCompMapStatement =
    "const aliasCompMap = {" +
    Object.keys(aliasCompMap)
      .map((alias) => {
        const { pkg, key, actions, handlers, type } = aliasCompMap[alias];
        return `"${alias}": {Comp: ${
          flatennedComponentMap[pkg][key]
        }, ref: React.createRef(null), actions: ${JSON.stringify(
          actions
        )}, handlers: ${JSON.stringify(handlers)}, type: ${JSON.stringify(
          type
        )}}`;
      })
      .join(",") +
    "}";
  return `
  import React from "react";
  import DocFn from "./pages/_document";
  import PageWrapper from "./pages/_app";
  import PageFn from "./pages${pagePath}";
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
