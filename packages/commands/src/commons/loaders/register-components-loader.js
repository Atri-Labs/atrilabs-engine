function registerComponentLoader() {
  /**
   * @type {import("@atrilabs/core").ManifestIR[]}
   */
  const irs = JSON.parse(this.getOptions().irs);
  return `
  import { manifestRegistryController } from "@atrilabs/manifest-registry";
  ${irs
    .map((ir, index) => {
      return `
    import man_${index} from "${ir.manifest}";
    import comp_${index} from "${ir.component}";
    import {ReactComponent as icon_${index}} from "${
        ir.icon
          ? ir.icon
          : "@atrilabs/atri-app-core/src/editor-components/MissingIcon"
      }";
    ${
      ir.devComponent
        ? `import devComp_${index} from "${ir.devComponent}"`
        : `const devComp_${index} = undefined`
    };
    manifestRegistryController.writeManifestsFromDefaultExport({
      manifestModule: man_${index},
      component: comp_${index},
      devComponent: devComp_${index},
      pkg: "${ir.pkg}",
      icon: icon_${index}
    });
    `;
    })
    .join("\n")}
  `;
}

module.exports = registerComponentLoader;
