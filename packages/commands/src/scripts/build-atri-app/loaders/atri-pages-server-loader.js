function atriPagesServerLoader() {
  const options = this.getOptions();
  const {
    srcs,
    filepath,
    reactRouteObjectPath,
    routes,
    styles,
    entryRouteStores,
  } = options;
  if (srcs === undefined || filepath === undefined) {
    const err = Error();
    err.name = "ValueError";
    err.message = `Expected defined value for scriptSrc. Got ${srcs}, ${filepath} respectively.`;
    throw err;
  }
  return `
  import DocFn from "./pages/_document";
  import PageWrapper from "./pages/_app";
  import PageFn from "./pages${filepath}";
  import { renderPageServerSide } from "@atrilabs/atri-app-core/src/prod-entries/renderPageServerSide";
  
  function renderPage(){
    return renderPageServerSide({entryPageFC: PageFn, PageWrapper, DocFn, srcs: ${JSON.stringify(
      srcs
    )}, routes: ${routes.map((route) => {
    return { path: route };
  })}, styles: ${JSON.stringify(
    styles
  )}, reactRouteObjectPath: ${JSON.stringify(
    reactRouteObjectPath
  )}, entryRouteStores: ${JSON.stringify(entryRouteStores)}})
  }

  export default { renderPage };`;
}

module.exports = atriPagesServerLoader;
