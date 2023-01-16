function atriPagesClientLoader() {
  const options = this.getOptions();
  const { routeObjectPath, modulePath } = options;

  if (route === undefined || modulePath === undefined) {
    const err = Error();
    err.name = "ValueError";
    err.message = `Expected defined value for route, modulePath. Got ${routeObjectPath}, ${modulePath} respectively.`;
    throw err;
  }

  return `
	import PageWrapper from "./pages/_app";
	import PageComponent from "${modulePath}";

	import renderPageOrApp from "@atrilabs/atri-app-core";

	renderPageOrApp("${routeObjectPath}", PageWrapper, PageComponent);
	`;
}

module.exports = atriPagesClientLoader;
