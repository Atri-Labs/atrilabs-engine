function atriPagesServerLoader() {
  const options = this.getOptions();
  const { pagePath, reactRouteObjectPath } = options;
  let { srcs, routes, entryRouteStore, styles } = options;
  if (srcs === undefined) srcs = "[]";
  if (routes === undefined) routes = "[]";
  if (entryRouteStore === undefined) entryRouteStore = "{}";
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
  /**
   * @type {{[pkg: string]: {[key: string]: string}}}
   */
  const componentMap = {};
  /**
   * @type {{[pkg: string]: {[key: string]: string}}}
   */
  const flatennedComponentMap = {};
  let counter = 0;
  Object.keys(componentMap).reduce((prev, pkg) => {
    Object.keys(componentMap[pkg]).reduce((prev, key) => {
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
          return `import ${flatennedComponentMap[pkg][key]} from ${componentMap[pkg][key]};`;
        })
        .join("\n");
    })
    .join("\n");
  return `
  import DocFn from "./pages/_document";
  import PageWrapper from "./pages/_app";
  import PageFn from "./pages${pagePath}";
  import { renderPageServerSide } from "@atrilabs/atri-app-core/src/prod-entries";
  ${compImportStatements}
  
  function renderPage(){
    return renderPageServerSide({entryPageFC: PageFn, PageWrapper, DocFn, srcs: ${JSON.stringify(
      srcs
    )}, routes: ${JSON.stringify(
    routes.map((route) => {
      return { path: route };
    })
  )}, styles: ${JSON.stringify(styles)}, entryRouteObjectPath: ${JSON.stringify(
    reactRouteObjectPath
  )}, entryRouteStore: ${JSON.stringify(entryRouteStore)}})
  }

  export default { renderPage };`;
}

module.exports = atriPagesServerLoader;
