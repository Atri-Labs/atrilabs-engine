import { editorAppMachineInterpreter } from "./init";

window.addEventListener("message", (ev) => {
  if (
    ev.origin === editorAppMachineInterpreter.machine.context.appInfo?.hostname
  ) {
    if (ev.data === "ready") {
      editorAppMachineInterpreter.send({ type: "CANVAS_IFRAME_LOADED" });
    }
  }
});

function navigatePage(urlPath: string) {
  editorAppMachineInterpreter.send({ type: "NAVIGATE_PAGE", urlPath });
}

export const canvasApi = {
  navigatePage,
};
