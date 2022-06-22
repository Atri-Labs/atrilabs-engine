const generateModuleId = require("./generateModuleId");

/**
 *
 * @param {string} forestPkg
 */
function forestId(forestPkg) {
  return generateModuleId(forestPkg);
}

// treeId is the import path of the tree's default function
/**
 *
 * @param {{modulePath: string;}} tree
 * @returns {string}
 */
function treeId(tree) {
  return generateModuleId(tree.modulePath);
}

/**
 *
 * @param {{[forestPkg: string]: {modulePath: string;}[]}} forests
 * @returns {{[modulePath: string]: {localIdentifier: string, treeId: string}}}
 */
function generateImportMap(forests) {
  const forestPkgs = Object.keys(forests);
  let treeCount = 1;
  const treeImportMap = {};
  forestPkgs.forEach((forestPkg) => {
    const forest = forests[forestPkg];
    forest.forEach((tree) => {
      treeImportMap[tree.modulePath] = {
        localIdentifier: "tree" + treeCount++,
        treeId: treeId(tree),
      };
    });
  });
  return treeImportMap;
}

/**
 *
 * @param {*} t
 * @param {{[modulePath: string]: {localIdentifier: string, treeId: string}}} treeImportMap
 * @returns
 */
function generateImportStatements(t, treeImportMap) {
  const keys = Object.keys(treeImportMap);
  return keys.map((key) => {
    const identifier = t.identifier(treeImportMap[key].localIdentifier);
    const importDefaultSpecifier = t.importDefaultSpecifier(identifier);
    const importDeclaration = t.importDeclaration(
      [importDefaultSpecifier],
      t.stringLiteral(key)
    );
    return importDeclaration;
  });
}

/**
 *
 * @param {*} t
 * @param {{modulePath: string;}[]} forest
 * @param {{[modulePath: string]: {localIdentifier: string, treeId: string}}} treeImportMap
 * @returns
 */
function generateTreeDefArray(t, forest, treeImportMap) {
  const treeDefObjects = forest.map((tree) => {
    const idProp = t.objectProperty(
      t.identifier("id"),
      t.stringLiteral(treeImportMap[tree.modulePath].treeId)
    );
    const modulePathProp = t.objectProperty(
      t.identifier("modulePath"),
      t.stringLiteral(tree.modulePath)
    );
    const defFn = t.identifier(treeImportMap[tree.modulePath].localIdentifier);
    const defFnProp = t.objectProperty(t.identifier("defFn"), defFn);

    const treeDefObject = t.objectExpression([
      idProp,
      modulePathProp,
      defFnProp,
    ]);

    return treeDefObject;
  });

  return t.arrayExpression(treeDefObjects);
}

/**
 *
 * @param {*} t
 * @param {{[forestPkg: string]: {modulePath: string;}[]}} forests
 * @param {{[treeId: string]: {localIdentifier: string, treeId: string}}} treeImportMap
 * @returns
 */
function generateForestDefArray(t, forests, treeImportMap) {
  const forestPkgs = Object.keys(forests);
  // generate properties for each forest
  const forestDefs = forestPkgs.map((forestPkg) => {
    const idProp = t.objectProperty(
      t.identifier("id"),
      t.stringLiteral(forestId(forestPkg))
    );
    const pkgProp = t.objectProperty(
      t.identifier("pkg"),
      t.stringLiteral(forestPkg)
    );
    const trees = forests[forestPkg];
    const treesProp = t.objectProperty(
      t.identifier("trees"),
      generateTreeDefArray(t, trees, treeImportMap)
    );
    return t.objectExpression([idProp, pkgProp, treesProp]);
  });

  // create object expression
  return t.arrayExpression(forestDefs);
}

const InternalVisitor = {
  VariableDeclarator(path) {
    const id = path.get("id");
    if (id.type === "Identifier" && id.node.name === "defs") {
      const init = path.get("init");
      const forestDefs = generateForestDefArray(
        this.t,
        this.options.forests,
        this.treeImportMap
      );
      init.replaceWith(forestDefs);
    }
  },
};

/**
 * The path to layer can be without extension.
 * @param {*} babel
 * @param {{forests: {[pkg: string]: {modulePath: string;}[]}, browserForestManagerFile: string}} options
 * @returns
 */
module.exports = function (babel, options) {
  // check options
  if (
    options.forests === undefined ||
    options.browserForestManagerFile === undefined
  ) {
    // do nothing if options are incorrect
    return { visitor: {} };
  }
  return {
    visitor: {
      Program(path, parent) {
        if (!(parent.filename.includes(options.browserForestManagerFile))) {
          return;
        }
        // add import statements for each tree
        const treeImportMap = generateImportMap(options.forests);
        const importStatements = generateImportStatements(
          babel.types,
          treeImportMap
        );
        importStatements.forEach((statement) => {
          path.unshiftContainer("body", statement);
        });
        path.traverse(InternalVisitor, {
          options,
          t: babel.types,
          treeImportMap,
        });
      },
    },
  };
};
