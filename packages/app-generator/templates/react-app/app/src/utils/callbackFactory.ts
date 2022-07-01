import useStore from "../hooks/useStore";

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

function sendEventDataFn(
  alias: string,
  pageName: string,
  pageRoute: string,
  callbackName: string,
  eventData: any
) {
  console.log("sendEventData:", eventData);
  const pageState = useStore.getState()[pageName];
  fetch("/event-handler", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      alias,
      pageRoute,
      callbackName,
      eventData,
      pageState,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("got res", res);
      if (res && res["pageState"])
        useStore.setState({ [pageName]: res["pageState"] });
    });
}

export function callbackFactory(
  alias: string,
  pageName: string,
  pageRoute: string,
  callbackName: string,
  callbackDef: CallbackDef
) {
  const callbackFn = (eventData: any) => {
    const handlers = callbackDef.handlers;
    handlers.forEach((handler) => {
      if (handler["sendEventData"]) {
        sendEventDataFn(alias, pageName, pageRoute, callbackName, eventData);
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
