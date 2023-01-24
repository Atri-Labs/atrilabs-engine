import { Compiler } from "webpack";
import { interpreter } from "../init";
import { APP_SERVER_DONE, APP_SERVER_INVALIDATED } from "../serverMachine";

export class NodeLibPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.invalid.tap("NodeLibPluginInvalidHook", () => {
      interpreter.send({ type: APP_SERVER_INVALIDATED });
    });
    compiler.hooks.done.tap("NodeLibPluginDoneHook", () => {
      interpreter.send({ type: APP_SERVER_DONE });
    });
  }
}
