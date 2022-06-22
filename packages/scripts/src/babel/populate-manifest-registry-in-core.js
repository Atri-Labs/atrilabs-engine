module.exports = function (babel, options) {
  // const options = {
  //   manifestRegistryFile: "",
  //   manifests: [
  //     { manifestId: "man1", schemaSrc: "importsrc1" },
  //     { manifestId: "man2", schemaSrc: "importsrc2" }
  //   ]
  // };
  function importTemplate(schemaModulePath, index) {
    // import manSchema1 from "importsrc1";
    return `import manSchema${index} from "${schemaModulePath}";`;
  }
  function initTemplate(manifestIds) {
    // {"man1": {components: [], schema: manSchema1}}
    const fields = manifestIds
      .map((manifestId, index) => {
        return `"${manifestId}": {components: [], schema: manSchema${index}()}`;
      })
      .join(", ");
    const wrapped = `{${fields}}`;
    return wrapped;
  }
  const childVisitor = {
    VariableDeclarator: (path) => {
      if (path.get("id").node.name === "manifestRegistry") {
        const init = path.get("init");
        const newInit = babel.template.expression.ast(
          initTemplate(options.manifests.map((man) => man.manifestId))
        );
        init.replaceWith(newInit);
      }
    },
  };
  return {
    visitor: {
      Program: (path, parent) => {
        if (parent.filename.includes(options.manifestRegistryFile)) {
          options.manifests.forEach((man, index) => {
            const importNode = babel.template.statement.ast(
              importTemplate(man.schemaModulePath, index)
            );
            path.unshiftContainer("body", importNode);
            path.traverse(childVisitor);
          });
        }
      },
    },
  };
};
