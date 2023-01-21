const { stringify } = require("querystring");

export async function createEntry() {
  // TODO: add pages when they are requested
  return {
    app: { import: "atri-app-loader!" },
    index: {
      import: `atri-pages-client-loader?${stringify({
        routeObjectPath: "/",
        urlPath: "/",
        modulePath: "./pages/index",
      })}!`,
    },
  };
}
