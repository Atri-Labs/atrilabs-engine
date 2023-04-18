import { ComponentProps } from "../../types";
import { useMemo, useCallback, useState } from "react";
import { Label } from "../commons/Label";
import { PropertyContainer } from "../commons/PropertyContainer";
import { createObject } from "@atrilabs/core";
import { Editor } from "@tinymce/tinymce-react";
import Modal from "../commons/Modal";

export const TypedTextEditor: React.FC<ComponentProps> = (props) => {
  const [showModal, setShowModal] = useState(false);

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

  const [value, setValue] = useState(propValue);

  const callPatchCb = useCallback(() => {
    props.patchCb({
      property: {
        custom: createObject(props.customProps, selector, value),
      },
    });
    setShowModal(false);
  }, [props, selector, value]);

  return (
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
      {showModal && (
        <Modal
          showModal={showModal}
          title="Text Editor"
          setShowModal={setShowModal}
          footer={
            <>
              <button onClick={callPatchCb}> Save</button>
              <button onClick={() => setShowModal(false)}>Close</button>
            </>
          }
        >
          <div
            style={{
              padding: "15px",
              height: "665px",
              boxSizing: "border-box",
            }}
          >
            <Editor
              apiKey="vbo3n4286tzeuhkofq29387ruvysf454vcs7hkm9gonqn017"
              value={value}
              onEditorChange={(value) => setValue(value)}
              init={{
                height: "100%",
                menubar: false,
                toolbar:
                  "undo redo " +
                  "bold italic backcolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help " +
                  "formatselect",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </div>
        </Modal>
      )}
    </PropertyContainer>
  );
};
