import { createEditorAppMachineInterpreter } from "./editorAppMachine";

export const { editorAppMachineInterpreter, subscribeEditorMachine } =
  createEditorAppMachineInterpreter("EditorAppMachine");
