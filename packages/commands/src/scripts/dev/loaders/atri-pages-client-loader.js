function atriPagesClientLoader() {
  const options = this.getOptions();
  const { route, modulePath } = options;

  if (route === undefined || modulePath === undefined) {
    const err = Error();
    err.name = "ValueError";
    err.message = `Expected defined value for route, modulePath. Got ${route}, ${modulePath} respectively.`;
    throw err;
  }

  return `
	import PageWrapper from "./src/pages/_app";
	import PageComponent from "${modulePath}";

	import renderPageOrApp from "@atrilabs/atri-app-core";

	renderPageOrApp("${route}", PageWrapper, PageComponent);
	`;
}

module.exports = atriPagesClientLoader;
