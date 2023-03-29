const path = require("path");

function registerComponentLoader() {
  /**
   * @type {import("@atrilabs/core").ManifestIR[]}
   */
  const irs = JSON.parse(this.getOptions().irs);
  return `
	${irs
    .map((ir, index) => {
      return `
	  import man_${index} from "${ir.manifest}";
	  `;
    })
    .join("\n")}
    export default [${irs
      .map((ir, index) => {
        const paths = {};
        Object.keys(ir).reduce((curr, key) => {
          paths[key] = path.relative(process.cwd(), ir[key]);
        });
        return `{fullManifest: man_${index}, paths: ${JSON.stringify(paths)}}`;
      })
      .join(", ")}]
	`;
}

module.exports = registerComponentLoader;
