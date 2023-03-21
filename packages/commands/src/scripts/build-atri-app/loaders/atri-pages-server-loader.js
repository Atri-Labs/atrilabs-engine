function atriPagesServerLoader() {
  const options = this.getOptions();
  const { srcs, filepath, reactRouteObjectPath, routes, styles } = options;
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
    return renderPageServerSide({PageFn, PageWrapper, DocFn, srcs: ${JSON.stringify(
      srcs
    )}, routes, styles, reactRouteObjectPath})
  }

  export default { renderPage };`;
}

module.exports = atriPagesServerLoader;
