import { Compiler } from "webpack";
import { editorServerMachineInterpreter } from "../machine/init";
import {
  EDITOR_APP_SERVER_DONE,
  EDITOR_APP_SERVER_INVALIDATED,
} from "../machine/editorServerMachine";

export class EditorAppServerPlugin {
  name = "EditorAppServerPlugin";
  apply(compiler: Compiler) {
    compiler.hooks.invalid.tap("EditorAppServerPluginInvalidHook", () => {
      editorServerMachineInterpreter.send({
        type: EDITOR_APP_SERVER_INVALIDATED,
      });
    });
    compiler.hooks.done.tap("EditorAppServerPluginDoneHook", () => {
      editorServerMachineInterpreter.send({
        type: EDITOR_APP_SERVER_DONE,
        compiler,
      });
    });
  }
}
