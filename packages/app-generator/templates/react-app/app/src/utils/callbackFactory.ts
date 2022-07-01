export type CallbackDef = {
  handlers: (
    | { sendEventData: boolean }
    | {
        sendFile: ({ self: boolean } | { alias: string }) & {
          props: string[];
        };
      }
  )[];
  actions: (
    | { type: "do_nothing" }
    | { type: "file_input"; selector: string[] }
    | { type: "controlled"; selector: string[] }
  )[];
};

function sendEventDataFn(arg: any) {
  console.log("sendEventData:", arg);
}

export function callbackFactory(
  alias: string,
  pageName: string,
  callbackDef: CallbackDef
) {
  const callbackFn = (eventData: any) => {
    const handlers = callbackDef.handlers;
    handlers.forEach((handler) => {
      if (handler["sendEventData"]) {
        sendEventDataFn(eventData);
      }
    });
    const actions = callbackDef.actions;
    actions.forEach((action) => {
      if (action.type === "controlled") {
        // TODO: use pageName, alias, action.selector to find the field to update
        // use eventData as the new field value
      }
    });
  };
  return callbackFn;
}
