function atriAppLoader() {
  return `
  	import PageWrapper from "./pages/_app";
	import renderPageOrApp from "@atrilabs/atri-app-core/dist/entries/renderReactAppClientSide";

    module.exports = { PageWrapper, renderPageOrApp };
	`;
}

module.exports = atriAppLoader;
