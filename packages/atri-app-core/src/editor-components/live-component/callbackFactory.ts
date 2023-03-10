import { Callback } from "@atrilabs/react-component-manifest-schema";
import { componentStoreApi, liveApi } from "../../api";

export function callbackFactory(props: { id: string }) {
  const callbackObject: { [callbackName: string]: Function } = {};
  const callbacks = componentStoreApi.getComponent(props.id)?.callbacks;
  if (callbacks) {
    const callbackNames = Object.keys(callbacks);
    callbackNames.forEach((callbackName) => {
      if (Array.isArray(callbacks[callbackName])) {
        callbackObject[callbackName] = (value: any) => {
          callbacks[callbackName].forEach((callbackDef: Callback) => {
            if (callbackDef?.type === "controlled" && callbackDef.selector) {
              liveApi.updateProps(props.id, callbackDef.selector, value);
            } else if (
              callbackDef?.type === "file_input" &&
              callbackDef.selector
            ) {
              liveApi.updateProps(props.id, callbackDef.selector, value);
            }
          });
        };
      }
    });
  }
  return callbackObject;
}
