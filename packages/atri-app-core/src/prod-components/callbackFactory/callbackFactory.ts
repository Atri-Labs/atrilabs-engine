import {
  Callback,
  CallbackHandler,
} from "@atrilabs/react-component-manifest-schema";

function callCallbacks(alias: string, callbacks: Callback[], value: any) {
  callbacks.forEach((callbackDef: Callback) => {
    if (callbackDef?.type === "controlled" && callbackDef.selector) {
      // call update props
    } else if (callbackDef?.type === "file_input" && callbackDef.selector) {
      // call update props
    }
  });
}

function callHandlers(
  alias: string,
  handlers: CallbackHandler,
  callbackName: string,
  value: any
) {
  /**
   * Either one sendEventData job or multiple sendFiles job can be performed.
   * Both cannot be performed in a single request.
   *
   * A navigate job is always preformed at last. A job that has been run prior
   * to navigate can be either of sendEventData or sendFiles.
   */
  if (!Array.isArray(handlers)) {
    return;
  }
  const jobs: {
    // only one send event data
    sendEventData?: CallbackHandler["0"];
    // many sendfiles
    sendFiles?: CallbackHandler;
    // only one navigation
    navigate?: CallbackHandler["0"];
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
    // TODO: send request with form data
  } else if (jobs["sendEventData"]) {
    // TODO: send files
  } else if (jobs["navigate"]) {
    const options = {
      urlPath: jobs["navigate"].navigate!.url,
      target: jobs["navigate"].navigate!.target,
    };
    if (jobs["navigate"]!.navigate!.type === "internal") {
      // internal navigation
    } else {
      // external navigation
    }
  }
}

export function callbackFactory(props: {
  alias: string;
  actions: { [callbackName: string]: Callback[] };
  handlers: { [callbackName: string]: CallbackHandler };
}) {
  const { actions, handlers, alias } = props;
  const callbackObject: { [callbackName: string]: Function } = {};
  if (actions) {
    const callbackNames = Object.keys(actions);
    callbackNames.forEach((callbackName) => {
      if (Array.isArray(actions[callbackName])) {
        callbackObject[callbackName] = (value: any) => {
          callCallbacks(alias, actions[callbackName], value);
          if (handlers[callbackName])
            callHandlers(alias, handlers[callbackName], callbackName, value);
        };
      }
    });
  }
  return callbackObject;
}
