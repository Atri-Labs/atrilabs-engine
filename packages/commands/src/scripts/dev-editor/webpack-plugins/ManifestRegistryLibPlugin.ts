import { Compiler } from "webpack";
import { editorServerMachineInterpreter } from "../machine/init";
import {
  MANIFEST_LIB_DONE,
  MANIFEST_LIB_INVALIDATED,
} from "../machine/editorServerMachine";

export class ManifestRegistryLibPlugin {
  name = "ManifestRegistryLibPlugin";
  apply(compiler: Compiler) {
    compiler.hooks.invalid.tap("ManifestRegistryLibPluginInvalidHook", () => {
      editorServerMachineInterpreter.send({
        type: MANIFEST_LIB_INVALIDATED,
      });
    });
    compiler.hooks.done.tap("ManifestRegistryLibPluginDoneHook", () => {
      editorServerMachineInterpreter.send({
        type: MANIFEST_LIB_DONE,
        compiler,
      });
    });
  }
}
