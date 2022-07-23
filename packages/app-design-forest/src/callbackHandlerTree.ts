export type SendFileCallbackHandler = (
  | { self: boolean }
  | { compId: string }
) & { props: string[] };

export type SendEventCallbackHandler = boolean;

export type NavigationCallbackHandler = {
  /**
   * Internal navigation if navigation locally in the browser in Single Page Applications.
   * External vavaigation if navigating to an url outside the SPA.
   * The url field for internal should be /path/to/other/page.
   * The url field for external should be of format protocol://domain[?..][#/../]
   */
  type: "internal" | "external";
  url: string;
};

/**
 * CallbackHandler defines behavior with the backend whenever a callback is fired.
 * CallbackHandlers must be serializable because it is store in CallbackHandlerTree.
 */
export type CallbackHandler = (
  | {
      sendFile: SendFileCallbackHandler;
    }
  | { sendEventData: SendEventCallbackHandler }
  | { navigate: NavigationCallbackHandler }
)[];

export default function () {
  const validateCreate = () => {
    return true;
  };
  const validatePatch = () => {
    return true;
  };
  const onCreate = () => {
    return true;
  };
  return { validateCreate, validatePatch, onCreate };
}
