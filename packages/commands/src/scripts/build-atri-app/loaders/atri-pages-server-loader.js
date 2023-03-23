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
  return `
  import DocFn from "./pages/_document";
  import PageWrapper from "./pages/_app";
  import PageFn from "./pages${pagePath}";
  import { renderPageServerSide } from "@atrilabs/atri-app-core/src/prod-entries";
  
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
