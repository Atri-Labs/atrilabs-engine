import { ComponentProps } from "../../types";
import { useMemo, useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { Label } from "../commons/Label";
import { PropertyContainer } from "../commons/PropertyContainer";
import { createObject } from "@atrilabs/core";
import Modal from "../commons/Modal";
import { Diagnostic, linter, lintGutter } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import { json } from "@codemirror/lang-json";
import { JSONCustomProp } from "@atrilabs/app-design-forest";
const closeIcon: string = require("./close.svg").default;

export const TypedJson: React.FC<ComponentProps> = (props) => {
  const selector = useMemo(() => {
    return props.selector || [];
  }, [props]);

  const propValue = useMemo(() => {
    let currentValue = props.customProps;
    for (let prop of selector) {
      currentValue = currentValue[prop];
      if (currentValue === undefined) break;
    }
    return currentValue || "";
  }, [props, selector]);

  const [jsonObject, setJsonObject] = useState(
    JSON.stringify(propValue, null, 2)
  );
  const [showModal, setShowModal] = useState(false);
  const [validationError, setValidationError] = useState<string>("");

  const propOptions = props.treeOptions.dataTypes[
    props.propName
  ] as JSONCustomProp;

  const callPatchCb = useCallback(() => {
    if (!validationError) {
      props.patchCb({
        property: {
          custom: createObject(
            props.customProps,
            selector,
            JSON.parse(jsonObject)
          ),
        },
      });
      setShowModal(false);
    }
  }, [props, selector, jsonObject, validationError]);

  const jsonLinter = linter((view: EditorView) => {
    const diagnostics: Diagnostic[] = [];
    try {
      validationError && setValidationError("");
      JSON.parse(view.state.doc.toString());
      const { error } = propOptions.schema.validate(
        JSON.parse(view.state.doc.toString())
      );
      if (error) {
        diagnostics.push({
          from: view.state.doc.lineAt(view.state.selection.main.from).number,
          to: view.state.doc.lineAt(view.state.selection.main.to).number,
          severity: "error",
          message: error.message,
        });
        setValidationError(error.message);
      }
    } catch (e: any) {
      const split = e.message.split(" ");
      const from = parseInt(split[split.length - 1]);
      const to = from + 1;
      const severity = "error";
      diagnostics.push({
        from,
        to,
        message: e.message,
        severity,
      });
      setValidationError(e.message);
    }
    return diagnostics;
  });

  return (
    <>
      <style>
        {`.cm-tooltip-lint.cm-tooltip{
        display:none;
        }
        .cm-tooltip-hover.cm-tooltip.cm-tooltip-below {
          display:none; !important;
        }
        .pretty-button {
          font-weight: 600;
          font-size: 14px;
          padding: 5px 10px;
          position: absolute;
          z-index: 1;
          right: 40px;
          top: 68px;
          border: 1px solid transparent;
          border-radius: 5px;
          background: #f1fbff;
          box-shadow: none;
          color: #007bff;
          cursor: pointer;
        }
        .pretty-button:hover {
          border-color: #007bff;
        }
        .error {
          position: absolute;
          width: calc(100% - 30px);
          bottom: 71px;
        }
        `}
      </style>
      <PropertyContainer>
        <Label name={props.propName} />
        <button
          onClick={() => setShowModal(true)}
          style={{
            color: "white",
            height: "20px",
            width: "20px",
            backgroundColor: "rgb(17, 24, 39)",
            border: "none",
            outline: "none",
            padding: "0px",
            margin: "0px",
          }}
        >
          ...
        </button>
      </PropertyContainer>
      {showModal && (
        <Modal
          showModal={showModal}
          title="Add JSON"
          setShowModal={setShowModal}
          footer={
            <>
              <button
                onClick={callPatchCb}
                className={validationError !== "" ? "disabled" : ""}
              >
                Update JSON
              </button>
              <button onClick={() => setShowModal(false)}>Close</button>
            </>
          }
        >
          <div style={{ paddingRight: "15px" }}>
            <button
              className="pretty-button"
              onClick={() =>
                !validationError &&
                setJsonObject(JSON.stringify(JSON.parse(jsonObject), null, 2))
              }
            >
              Beautify
            </button>
            <CodeMirror
              placeholder="//code"
              onChange={(value) => setJsonObject(value)}
              value={jsonObject}
              extensions={[json(), lintGutter(), jsonLinter]}
            />
          </div>
          {validationError && (
            <div
              className="error"
              style={{
                backgroundColor: "#ffccc7",
                padding: "7px 15px",
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <div
                style={{
                  width: "25px",
                  height: "25px",
                  backgroundColor: "#ff4d4f",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50%",
                }}
              >
                <img
                  src={closeIcon}
                  alt="close-icon"
                  style={{
                    width: "18px",
                    height: "18px",
                  }}
                />
              </div>
              {validationError}
            </div>
          )}
        </Modal>
      )}
    </>
  );
};
