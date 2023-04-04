const upath = require("upath");

function processOptions(options) {
  const { pagePath, reactRouteObjectPath } = options;
  let {
    srcs,
    routes,
    entryRouteStore,
    styles,
    aliasCompMap,
    componentTree,
    componentMap,
  } = options;
  if (srcs === undefined) srcs = "[]";
  if (routes === undefined) routes = "[]";
  if (entryRouteStore === undefined) entryRouteStore = "{}";
  if (aliasCompMap === undefined) aliasCompMap = "{}";
  if (componentTree === undefined) componentTree = "{}";
  if (componentMap === undefined) componentMap = "{}";
  if (styles === undefined) styles = "";
  if (pagePath === undefined) {
    const err = Error();
    err.name = "ValueError";
    err.message = `Expected defined value for srcs or pagePath. Got ${srcs}, ${pagePath} respectively.`;
    throw err;
  }
  srcs = JSON.parse(srcs);
  routes = JSON.parse(routes);
  entryRouteStore = JSON.parse(entryRouteStore);
  aliasCompMap = JSON.parse(aliasCompMap);
  componentTree = JSON.parse(componentTree);
  /**
   * @type {{[pkg: string]: {[key: string]: string}}}
   */
  componentMap = JSON.parse(componentMap);
  /**
   * @type {{[pkg: string]: {[key: string]: string}}}
   */
  const flatennedComponentMap = {};
  let counter = 0;
  Object.keys(componentMap).reduce((prev, pkg) => {
    Object.keys(componentMap[pkg]).reduce((prev, key) => {
      if (prev[pkg] === undefined) prev[pkg] = {};
      prev[pkg][key] = `Comp${counter}`;
      counter++;
      return prev;
    }, prev);
    return prev;
  }, flatennedComponentMap);
  const compImportStatements = Object.keys(flatennedComponentMap)
    .map((pkg) => {
      return Object.keys(flatennedComponentMap[pkg])
        .map((key) => {
          return `import ${flatennedComponentMap[pkg][key]} from "${upath.toUnix(componentMap[pkg][key])}";`;
        })
        .join("\n");
    })
    .join("\n");
  const aliasCompMapStatement =
    "const aliasCompMap = {" +
    Object.keys(aliasCompMap)
      .map((alias) => {
        const { pkg, key, actions, handlers, type } = aliasCompMap[alias];
        return `"${alias}": {Comp: ${
          flatennedComponentMap[pkg][key]
        }, ref: React.createRef(null), actions: ${JSON.stringify(
          actions
        )}, handlers: ${JSON.stringify(handlers)}, type: ${JSON.stringify(
          type
        )}}`;
      })
      .join(",") +
    "}";
  return {
    pagePath,
    compImportStatements,
    aliasCompMapStatement,
    routes,
    srcs,
    styles,
    reactRouteObjectPath,
    entryRouteStore,
    componentTree,
  };
}

module.exports = processOptions;
