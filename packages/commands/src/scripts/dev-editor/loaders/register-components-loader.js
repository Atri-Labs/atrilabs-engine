function registerComponentLoader() {
  /**
   * @type {import("@atrilabs/core").ManifestIR[]}
   */
  const irs = JSON.parse(this.getOptions().irs);
  console.log("fromload", irs);
  return `
  import { manifestRegistryController } from "@atrilabs/core";
  ${irs
    .map((ir, index) => {
      return `
    import man_${index} from "${ir.manifest}";
    import comp_${index} from "${ir.component}";
    ${
      ir.devComponent
        ? `import devComp_${index} from "${ir.devComponent}"`
        : `const devComp_${index} = undefined`
    };
    manifestRegistryController.writeManifestsFromDefaultExport({
      manifestModule: man_${index},
      component: comp_${index},
      devComponent: devComp_${index},
      pkg: "${ir.pkg}"
    });
    `;
    })
    .join("\n")}
  `;
}

module.exports = registerComponentLoader;
