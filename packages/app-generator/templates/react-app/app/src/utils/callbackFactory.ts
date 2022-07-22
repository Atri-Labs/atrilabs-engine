import useStore from "../hooks/useStore";
import useIoStore from "../hooks/useIoStore";

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

function updateAppStore(
  alias: string,
  pageName: string,
  selector: string[],
  eventData: any
) {
  const currentPageState = useStore.getState()[pageName];
  const currentCompState = currentPageState[alias];
  let newObj: any = {};
  let currObj = newObj;
  selector.forEach((sel, index) => {
    if (index === selector.length - 1) {
      currObj[sel] = eventData;
    } else {
      currObj[sel] = {};
    }
    currObj = currObj[sel];
  });
  const newCompState = { ...currentCompState, ...newObj };
  const newPageState = { ...currentPageState, [alias]: newCompState };
  useStore.setState({ [pageName]: newPageState });
}

function updateAppIoStore(
  alias: string,
  pageName: string,
  selector: string[],
  eventData: any
) {
  const currentPageState = useIoStore.getState()[pageName];
  const currentCompState = currentPageState[alias];
  // not all components will have an entry in ioStore
  if (currentCompState) {
    let newObj: any = {};
    let currObj = newObj;
    selector.forEach((sel, index) => {
      if (index === selector.length - 1) {
        currObj[sel] = eventData;
      } else {
        currObj[sel] = {};
      }
      currObj = currObj[sel];
    });
    const newCompState = { ...currentCompState, ...newObj };
    const newPageState = { ...currentPageState, [alias]: newCompState };
    useIoStore.setState({ [pageName]: newPageState });
  }
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
        updateAppStore(alias, pageName, action.selector, eventData);
      }
      if (action.type === "file_input") {
        updateAppIoStore(alias, pageName, action.selector, eventData);
      }
    });
  };
  return callbackFn;
}
