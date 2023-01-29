function atriPagesServerLoader() {
  const options = this.getOptions();
  const { scriptSrcs, filepath } = options;
  if (scriptSrcs === undefined || filepath === undefined) {
    const err = Error();
    err.name = "ValueError";
    err.message = `Expected defined value for scriptSrc. Got ${routeObjectPath}, ${modulePath} respectively.`;
    throw err;
  }

  return `
  import DocFn from "./pages/_document";
  import AppFn from "./pages/_app";
  import PageFn from "./pages${filepath}";
  import { renderPageServerSide } from "@atrilabs/atri-app-core/src/entries/renderPageServerSide";
  
  function renderPage(){
    return renderPageServerSide({PageFn, AppFn, DocFn, scriptSrcs: ${JSON.stringify(
      scriptSrcs
    )}})
  }

  export default { renderPage };
  `;
}

module.exports = atriPagesServerLoader;
