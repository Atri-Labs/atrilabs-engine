import { Compiler } from "webpack";
import { interpreter } from "../init";
import { LIB_SERVER_DONE, LIB_SERVER_INVALIDATED } from "../serverMachine";

export class NodeLibPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.invalid.tap("NodeLibPluginInvalidHook", () => {
      interpreter.send({ type: LIB_SERVER_INVALIDATED });
    });
    compiler.hooks.done.tap("NodeLibPluginDoneHook", () => {
      interpreter.send({ type: LIB_SERVER_DONE, compiler });
    });
  }
}
