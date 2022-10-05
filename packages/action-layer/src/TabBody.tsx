import {
  gray200,
  gray300,
  gray700,
  gray800,
  gray900,
  h4Heading,
  h5Heading,
} from "@atrilabs/design-system";
import {
  CallbackHandler,
  NavigationCallbackHandler,
} from "@atrilabs/react-component-manifest-schema/lib/types";
import { useCallback, useEffect, useMemo } from "react";
import { ReactComponent as AddIcon } from "./assets/add.svg";
import { useFileUploadAliases } from "./hooks/useFileUploadAliases";
import { usePageRoutes } from "./hooks/usePageRoutes";
import { ReactComponent as MinusIcon } from "./assets/minus.svg";
import "./TabBody.css";
export type TabBodyProps = {
  patchCb: (slice: any) => void;
  compId: string;
  // comes from component tree
  callbacks: { [callbackName: string]: CallbackHandler };
  // comes from component manifest
  callbackNames: string[];
  getAlias: (id: string) => string | undefined;
};

function callbackHandlerToText(handler: CallbackHandler["0"]) {
  if ("sendFile" in handler && "self" in handler["sendFile"]) {
    return `Send own file`;
  }
  if ("sendFile" in handler && "alias" in handler["sendFile"]) {
    return `Send file from ${handler["sendFile"]["alias"]}`;
  }
  if ("navigate" in handler && handler["navigate"].type === "internal") {
    return `Navigate to ${handler.navigate.url}`;
  }
  if ("navigate" in handler && handler["navigate"].type === "external") {
    return `Navigate to external url`;
  }
  if ("sendEventData" in handler) {
    return "Send event data";
  }
  return "Unknown action";
}

function surelyReutrnArray(arr: any[]) {
  return arr || [];
}

export const TabBody: React.FC<TabBodyProps> = (props) => {
  const { fileUploadActions } = useFileUploadAliases();
  const { routes } = usePageRoutes();

  const options = useMemo(() => {
    const options: { action: CallbackHandler["0"]; value: number }[] = [];
    // file uploads
    fileUploadActions.forEach((fileUploadActions) => {
      if (fileUploadActions.alias === props.getAlias(props.compId)) {
        const action: CallbackHandler["0"] = {
          sendFile: { self: true, props: fileUploadActions.props },
        };
        options.push({ action, value: options.length + 1 });
      } else {
        const action: CallbackHandler["0"] = {
          sendFile: {
            alias: fileUploadActions.alias,
            props: fileUploadActions.props,
          },
        };
        options.push({ action, value: options.length + 1 });
      }
    });
    // internal navigation
    routes.forEach((route) => {
      const action: CallbackHandler["0"] = {
        navigate: { type: "internal", url: route },
      };
      options.push({ action, value: options.length + 1 });
    });
    // external navigation
    options.push({
      action: { navigate: { type: "external", url: "", target: "_blank" } },
      value: options.length + 1,
    });
    // send event data
    options.push({
      action: { sendEventData: true },
      value: options.length + 1,
    });
    return options;
  }, [fileUploadActions, props, routes]);

  const onChangeAction = useCallback(
    (callbackName: string, index: number, value: number) => {
      // value === 0 implies that user selected the already selected option
      if (value === 0) return;
      const previousActions = [
        ...surelyReutrnArray(props.callbacks[callbackName]),
      ];
      const action = options[value - 1].action;
      previousActions.splice(index, 1, action);
      props.patchCb({
        property: {
          callbacks: {
            [callbackName]: previousActions,
          },
        },
      });
    },
    [options, props]
  );

  const onExternalNavigationChange = useCallback(
    (
      callbackName: string,
      index: number,
      action: { navigate: NavigationCallbackHandler }
    ) => {
      const previousActions = [
        ...surelyReutrnArray(props.callbacks[callbackName]),
      ];
      previousActions.splice(index, 1, action);
      props.patchCb({
        property: {
          callbacks: {
            [callbackName]: previousActions,
          },
        },
      });
    },
    [props]
  );

  const onInsertAction = useCallback(
    (callbackName: string) => {
      const previousActions = [
        ...surelyReutrnArray(props.callbacks[callbackName]),
      ];
      const defaultAction: CallbackHandler["0"] = { sendEventData: true };
      previousActions.push(defaultAction);
      props.patchCb({
        property: {
          callbacks: {
            [callbackName]: previousActions,
          },
        },
      });
    },
    [props]
  );

  const onRemoveAction = useCallback(
    (callbackName: string, index: number) => {
      const previousActions = [
        ...surelyReutrnArray(props.callbacks[callbackName]),
      ];
      previousActions.splice(index, 1);
      props.patchCb({
        property: {
          callbacks: {
            [callbackName]: previousActions,
          },
        },
      });
    },
    [props]
  );

  useEffect(() => {
    console.log(surelyReutrnArray);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {props.callbackNames.map((callbackName) => {
        return (
          <div
            key={callbackName}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: gray300,
                backgroundColor: gray900,
                padding: "1rem",
              }}
            >
              <div
                style={{
                  ...h5Heading,
                  fontSize: "13px",
                  color: gray200,
                  userSelect: "none",
                }}
              >
                {callbackName}
              </div>
              <div
                onClick={() => {
                  onInsertAction(callbackName);
                }}
              >
                <AddIcon />
              </div>
            </div>
            <div
              className="actions-tb-scroll"
              style={{
                backgroundColor: gray700,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
                height: "calc(100vh - 90.4px)",
              }}
            >
              {surelyReutrnArray(props.callbacks[callbackName]).length === 0 ? (
                <div
                  style={{
                    ...h5Heading,
                    fontSize: "13px",
                    color: gray200,
                    padding: "1rem",
                    userSelect: "none",
                  }}
                >
                  No actions applied
                </div>
              ) : (
                <div>
                  {surelyReutrnArray(props.callbacks[callbackName]).map(
                    (handler, index) => {
                      const selectedActionText = callbackHandlerToText(handler);
                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            gap: "1rem",
                            flexDirection: "column",
                            borderBottomWidth: "1px",
                            borderBottomStyle: "solid",
                            borderBottomColor: "#1F2937",
                            alignItems: "center",
                            justifyContent: "center",
                            color: gray300,
                            paddingTop: "0.5rem",
                            paddingBottom: "0.5rem",
                            width: "100%",
                            paddingLeft: "0.1rem",
                            paddingRight: "0.1rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "1rem",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                ...h4Heading,
                                fontSize: "13px",
                                color: gray200,
                                backgroundColor: gray700,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "0.5rem",
                                userSelect: "none",
                              }}
                            >
                              Action
                            </div>
                            <select
                              style={{
                                width: "130px",
                                height: "25px",
                                color: gray200,
                                borderRadius: "2px",
                                backgroundColor: gray800,
                                border: "none",
                                outline: "none",
                              }}
                              onChange={(e) => {
                                onChangeAction(
                                  callbackName,
                                  index,
                                  parseInt(e.target.value)
                                );
                              }}
                            >
                              <option value={0}>{selectedActionText}</option>
                              {options
                                .filter(
                                  (option) =>
                                    callbackHandlerToText(option.action) !==
                                    selectedActionText
                                )
                                .map((option) => {
                                  return (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {callbackHandlerToText(option.action)}
                                    </option>
                                  );
                                })}
                            </select>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                height: "2rem",
                                width: "1rem",
                                justifyContent: "center",
                              }}
                              onClick={() => {
                                onRemoveAction(callbackName, index);
                              }}
                            >
                              <MinusIcon />
                            </div>
                          </div>
                          {handler["navigate"]?.type === "external" ? (
                            <div
                              style={{
                                display: "flex",
                                gap: "1rem",
                              }}
                            >
                              <div
                                style={{
                                  ...h4Heading,
                                  fontSize: "13px",
                                  color: gray200,
                                  backgroundColor: gray700,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "0.5rem",
                                  userSelect: "none",
                                }}
                              >
                                Link
                              </div>
                              <input
                                style={{
                                  width: "90px",
                                  height: "25px",
                                  color: gray200,
                                  borderRadius: "2px",
                                  backgroundColor: gray800,
                                  border: "none",
                                  outline: "none",
                                }}
                                value={handler.navigate["url"] || ""}
                                onChange={(e) => {
                                  onExternalNavigationChange(
                                    callbackName,
                                    index,
                                    {
                                      navigate: {
                                        type: "external",
                                        url: e.target.value,
                                        target: handler.navigate["target"],
                                      },
                                    }
                                  );
                                }}
                              />
                              <select
                                style={{
                                  width: "54px",
                                  height: "27px",
                                  color: gray200,
                                  borderRadius: "2px",
                                  backgroundColor: gray800,
                                  border: "none",
                                  outline: "none",
                                }}
                                value={handler.navigate["target"]}
                                onChange={(e) => {
                                  onExternalNavigationChange(
                                    callbackName,
                                    index,
                                    {
                                      navigate: {
                                        type: "external",
                                        url: handler.navigate["url"],
                                        target: e.target.value as
                                          | "_blank"
                                          | "_self",
                                      },
                                    }
                                  );
                                }}
                              >
                                <option value={"_blank"}>blank</option>
                                <option value={"_self"}>self</option>
                              </select>
                            </div>
                          ) : null}
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
