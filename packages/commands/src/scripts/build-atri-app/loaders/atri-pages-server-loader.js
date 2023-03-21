function atriPagesServerLoader() {
  const options = this.getOptions();
  const { srcs, filepath } = options;
  if (srcs === undefined || filepath === undefined) {
    const err = Error();
    err.name = "ValueError";
    err.message = `Expected defined value for scriptSrc. Got ${srcs}, ${filepath} respectively.`;
    throw err;
  }
  return `
  import DocFn from "./pages/_document";
  import AppFn from "./pages/_app";
  import PageFn from "./pages${filepath}";
  import { renderPageServerSide } from "@atrilabs/atri-app-core/src/prod-entries/renderPageServerSide";
  
  function renderPage(){
    return renderPageServerSide({PageFn, AppFn, DocFn, scriptSrcs: ${JSON.stringify(
      srcs
    )}})
  }

  export default { renderPage };`;
}

module.exports = atriPagesServerLoader;
