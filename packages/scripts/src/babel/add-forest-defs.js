// treeId is the import path of the tree's default function
/**
 *
 * @param {{pkg: string; modulePath: string; name: string;}} tree
 * @returns {string}
 */
function treeId(tree) {
  return tree.pkg + "/" + tree.modulePath;
}

/**
 *
 * @param {{[name: string]: {pkg: string; modulePath: string; name: string;}[]}} forests
 * @returns {{[treeId: string]: string}}
 */
function generateImportMap(forests) {
  const forestNames = Object.keys(forests);
  let treeCount = 1;
  const treeImportMap = {};
  forestNames.forEach((name) => {
    const forest = forests[name];
    forest.forEach((tree) => {
      treeImportMap[treeId(tree)] = "tree" + treeCount++;
    });
  });
  return treeImportMap;
}

/**
 *
 * @param {*} t
 * @param {{[treeId: string]: string}} treeImportMap
 * @returns
 */
function generateImportStatements(t, treeImportMap) {
  const keys = Object.keys(treeImportMap);
  return keys.map((key) => {
    const identifier = t.identifier(treeImportMap[key]);
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
 * @param {{pkg: string; modulePath: string; name: string;}[]} forest
 * @param {{[treeId: string]: string}} treeImportMap
 * @returns
 */
function generateTreeDefArray(t, forest, treeImportMap) {
  const treeDefObjects = forest.map((tree) => {
    const nameProp = t.objectProperty(
      t.identifier("name"),
      t.stringLiteral(tree.name)
    );
    const pkgProp = t.objectProperty(
      t.identifier("pkg"),
      t.stringLiteral(tree.pkg)
    );
    const modulePathProp = t.objectProperty(
      t.identifier("modulePath"),
      t.stringLiteral(tree.modulePath)
    );
    const id = treeId(tree);
    const defFn = t.identifier(treeImportMap[id]);
    const defFnProp = t.objectProperty(t.identifier("defFn"), defFn);

    const treeDefObject = t.objectExpression([
      nameProp,
      pkgProp,
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
 * @param {{[name: string]: {pkg: string; modulePath: string; name: string;}[]}} forests
 * @param {{[treeId: string]: string}} treeImportMap
 * @returns
 */
function generateForestDefArray(t, forests, treeImportMap) {
  const forestNames = Object.keys(forests);
  // generate properties for each forest
  const forestDefs = forestNames.map((forestName) => {
    const nameProp = t.objectProperty(
      t.identifier("name"),
      t.stringLiteral(forestName)
    );
    const trees = forests[forestName];
    const treesProp = t.objectProperty(
      t.identifier("trees"),
      generateTreeDefArray(t, trees, treeImportMap)
    );
    return t.objectExpression([nameProp, treesProp]);
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
 * @param {{forests: {[name: string]: {pkg: string; modulePath: string; name: string;}[]}, setCurrentForestFile: string}} options
 * @returns
 */
module.exports = function (babel, options) {
  // check options
  if (
    options.forests === undefined ||
    options.setCurrentForestFile === undefined
  ) {
    // do nothing if options are incorrect
    return { visitor: {} };
  }
  return {
    visitor: {
      Program(path, parent) {
        if (!parent.filename.match(options.setCurrentForestFile)) {
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
