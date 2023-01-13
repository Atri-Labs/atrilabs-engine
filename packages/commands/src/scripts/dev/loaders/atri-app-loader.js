function atriAppLoader() {
  return `
	const PageWrapper = require("./src/pages/_app");
	const renderPageOrApp = require("@atrilabs/atri-app-core");

    module.exports = { PageWrapper, renderPageOrApp };
	`;
}

module.exports = atriAppLoader;
