import { Compiler } from "webpack";
import { interpreter } from "../init";
import { APP_SERVER_DONE, APP_SERVER_INVALIDATED } from "../serverMachine";

export class AppServerPlugin {
  name = "AppServerPlugin";
  apply(compiler: Compiler) {
    compiler.hooks.invalid.tap("AppServerPluginInvalidHook", () => {
      interpreter.send({ type: APP_SERVER_INVALIDATED });
    });
    compiler.hooks.done.tap("AppServerPluginDoneHook", () => {
      interpreter.send({ type: APP_SERVER_DONE });
    });
  }
}
