import { Compiler } from "webpack";
import { isInteractive } from "../../shared/terminal";

export default function addCompilerHooks(compiler: Compiler) {
  compiler.hooks.invalid.tap("invalid", () => {
    if (isInteractive) {
      // clearConsole();
    }
    console.log("Compiling...");
  });
}
