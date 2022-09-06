import useStore, { updateStoreStateFromController } from "../hooks/useStore";
import useIoStore from "../hooks/useIoStore";
import { navigateExternally, navigateInternally } from "./navigate";
import { handleRedirection } from "./handleRedirection";
import { eventHandlerEndpoint, formEventHandlerEndpoint } from "./endpoints";

export type NavigationCallbackHandler = {
  type: "internal" | "external";
  url: string;
  target?: "_blank" | "_self";
};

export type CallbackDef = {
  handlers: (
    | { sendEventData: boolean }
    | {
        sendFile: ({ self: boolean } | { alias: string }) & {
          props: string[];
        };
      }
    | { navigate: NavigationCallbackHandler }
  )[];
  actions: (
    | { type: "do_nothing" }
    | { type: "file_input"; selector: string[] }
    | { type: "controlled"; selector: string[] }
  )[];
};

function sendEventDataFn(
  // alias of component on which event was fired
  alias: string,
  // name of the page in which the event was fired
  pageName: string,
  // route of the page in which the event was fired
  pageRoute: string,
  // name of the callback that fired this event
  callbackName: string,
  // data passed in the callback
  eventData: any
) {
  const pageState = useStore.getState()[pageName];
  return fetch(eventHandlerEndpoint, {
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
    .then((res) => handleRedirection(res))
    .then((res) => res.json())
    .then((res) => {
      if (res && res["pageState"])
        updateStoreStateFromController(pageName, res["pageState"]);
    });
}

function sendEventInFormDataFn(
  alias: string,
  pageName: string,
  pageRoute: string,
  callbackName: string,
  eventData: any,
  // information required to access file from useIoStore
  filesMetadata: { alias: string; selector: string[] }[]
) {
  const pageState = useStore.getState()[pageName];
  const formdata = new FormData();
  formdata.set("alias", alias);
  formdata.set("pageRoute", pageRoute);
  formdata.set("callbackName", callbackName);
  formdata.set("eventData", JSON.stringify(eventData));
  formdata.set("pageState", JSON.stringify(pageState));
  // append files in the same order as in filesMetadata
  const selectedFileMetadata: {
    alias: string;
    selector: string[];
    count: number;
  }[] = [];
  const selectedFilelists: FileList[] = [];
  filesMetadata.forEach((fileMetadata) => {
    const aliasProp = useIoStore.getState()[pageName][fileMetadata.alias];
    if (aliasProp) {
      const selector = fileMetadata.selector;
      let curr = aliasProp;
      for (let i = 0; i < selector.length; i++) {
        if (curr[selector[i]]) {
          if (
            i === selector.length - 1 &&
            curr[selector[i]] instanceof FileList
          ) {
            selectedFileMetadata.push({
              ...fileMetadata,
              count: curr[selector[i]].length,
            });
            selectedFilelists.push(curr[selector[i]]);
          } else {
            curr = curr[selector[i]];
          }
        } else {
          break;
        }
      }
    }
  });
  formdata.set("filesMetadata", JSON.stringify(selectedFileMetadata));
  // all files will be appended in order [...filelist1, ...filelist2]
  selectedFilelists.forEach((selectedFilelist) => {
    for (let fileIndex = 0; fileIndex < selectedFilelist.length; fileIndex++) {
      const file = selectedFilelist[fileIndex];
      formdata.append(`files`, file);
    }
  });
  return fetch(formEventHandlerEndpoint, {
    method: "POST",
    body: formdata,
  })
    .then((res) => handleRedirection(res))
    .then((res) => res.json())
    .then((res) => {
      if (res) {
        updateStoreStateFromController(pageName, res);
      }
    });
}

function updateAppStore(
  alias: string,
  pageName: string,
  selector: string[],
  eventData: any
) {
  const currentPageState = useStore.getState()[pageName];
  const newCompState = JSON.parse(JSON.stringify(currentPageState[alias]));
  let currObj = newCompState;
  selector.forEach((sel, index) => {
    if (index === selector.length - 1) {
      currObj[sel] = eventData;
    }
    currObj = currObj[sel];
  });
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
  const newCompState = JSON.parse(JSON.stringify(currentPageState[alias]));
  // not all components will have an entry in ioStore
  if (newCompState) {
    let currObj = newCompState;
    selector.forEach((sel, index) => {
      if (index === selector.length - 1) {
        currObj[sel] = eventData;
      }
      currObj = currObj[sel];
    });
    const newPageState = { ...currentPageState, [alias]: newCompState };
    useIoStore.setState({ [pageName]: newPageState });
    console.log("useIoStore", useIoStore.getState());
  }
}

function handleNavigation(handle: CallbackDef["handlers"]["0"]) {
  if ("navigate" in handle && handle.navigate.type === "internal") {
    navigateInternally(handle.navigate.url);
  } else if ("navigate" in handle && handle.navigate.type === "external") {
    navigateExternally(handle.navigate.url, handle.navigate.target);
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
    // actions will be executed first and then handlers will be called
    const actions = callbackDef.actions;
    actions.forEach((action) => {
      if (action.type === "controlled") {
        updateAppStore(alias, pageName, action.selector, eventData);
      }
      if (action.type === "file_input") {
        updateAppIoStore(alias, pageName, action.selector, eventData);
      }
    });
    const handlers = callbackDef.handlers;

    /**
     * Either one sendEventData job or multiple sendFiles job can be performed.
     * Both cannot be performed in a single request.
     *
     * A navigate job is always preformed at last. A job that has been run prior
     * to navigate can be either of sendEventData or sendFiles.
     */
    const jobs: {
      // only one send event data
      sendEventData?: CallbackDef["handlers"]["0"];
      // many sendfiles
      sendFiles?: CallbackDef["handlers"];
      // only one navigation
      navigate?: CallbackDef["handlers"]["0"];
    } = {};

    handlers.forEach((handler) => {
      if (handler["sendEventData"]) {
        jobs["sendEventData"] = handler;
      }
      if (handler["sendFile"]) {
        if (jobs["sendFiles"]) {
          jobs["sendFiles"].push(handler);
        } else {
          jobs["sendFiles"] = [handler];
        }
      }
      if ("navigate" in handler) {
        jobs["navigate"] = handler;
      }
    });

    if (jobs["sendFiles"]) {
      const filesMetadata = jobs["sendFiles"].map((handler) => {
        const formFieldAlias = handler["sendFile"]["self"]
          ? alias
          : handler["sendFile"]["alias"];
        const formFieldSelector = handler["sendFile"]["props"];
        return { alias: formFieldAlias, selector: formFieldSelector };
      });
      sendEventInFormDataFn(
        alias,
        pageName,
        pageRoute,
        callbackName,
        eventData,
        filesMetadata
      ).then(() => {
        if (jobs["navigate"]) handleNavigation(jobs["navigate"]);
      });
    } else if (jobs["sendEventData"]) {
      sendEventDataFn(alias, pageName, pageRoute, callbackName, eventData).then(
        () => {
          if (jobs["navigate"]) handleNavigation(jobs["navigate"]);
        }
      );
    } else if (jobs["navigate"]) {
      handleNavigation(jobs["navigate"]);
    }
  };

  return callbackFn;
}
