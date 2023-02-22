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
        return `man_${index}`;
      })
      .join(", ")}]
	`;
}

module.exports = registerComponentLoader;
