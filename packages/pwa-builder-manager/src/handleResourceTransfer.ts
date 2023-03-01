import { editorAppMachineInterpreter, subscribeEditorMachine } from "./init";
import { api } from "./api";

subscribeEditorMachine("after_app_load", () => {
  api.getResources((resources) => {
    editorAppMachineInterpreter.machine.context.canvasWindow?.postMessage(
      { type: "IMPORT_RESOURCES", resources },
      // @ts-ignore
      "*"
    );
  });
});

api.subscribeResourceUpdates((resource) => {
  editorAppMachineInterpreter.machine.context.canvasWindow?.postMessage(
    { type: "IMPORT_RESOURCES", resources: [resource] },
    // @ts-ignore
    "*"
  );
});
