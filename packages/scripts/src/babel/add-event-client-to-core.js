/**
 *
 * @param {babel} babel
 * @param {{apiFile: string, eventClient: string}} options
 */
module.exports = function (babel, options) {

  console.log("Api file " + options.apiFile);

  return {
    visitor: {
      Program: (path, parent) => {

        console.log("Parent filename " + parent.filename);

        if (parent.filename.includes(options.apiFile)) {
          /**
           * Put an import statement with local name for default as client.
           * We don't need to remove declare var client statement as it doesn't appear in tsc output.
           */
          const importStatement = babel.template.statement.ast(
            `import client from "${options.eventClient}";`
          );
          path.unshiftContainer("body", importStatement);
        }
      },
    },
  };
};
