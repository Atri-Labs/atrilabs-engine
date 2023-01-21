function atriPagesClientLoader() {
  const options = this.getOptions();
  const { routeObjectPath, modulePath, urlPath } = options;

  if (route === undefined || modulePath === undefined) {
    const err = Error();
    err.name = "ValueError";
    err.message = `Expected defined value for route, modulePath. Got ${routeObjectPath}, ${modulePath} respectively.`;
    throw err;
  }

  return `
	import PageWrapper from "./pages/_app";
	import PageComponent from "${modulePath}";

	import { universalRender } from "@atrilabs/atri-app-core";

  const options = {
    routeObjectPath: ${routeObjectPath},
    PageWrapper,
    PageComponent,
    urlPath: ${urlPath}
  };

	universalRender(options);
	`;
}

module.exports = atriPagesClientLoader;
