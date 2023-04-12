import React, { forwardRef, useCallback, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TinyMCE = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: {};
    onClick: (event: {
      eventX: number;
      eventY: number;
      x: number;
      y: number;
      width: number;
      height: number;
    }) => void;
    onChange?(value: string): void;
    className?: string;
  }
>((props, ref) => {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      const { x, y, width, height } = (
        e.nativeEvent.target as HTMLElement
      ).getBoundingClientRect();
      props.onClick({
        eventX: e.pageX,
        eventY: e.pageY,
        x,
        y,
        width,
        height,
      });
    },
    [props]
  );

  return (
    <>
      <div
        className={props.className}
        ref={ref}
        style={{
          position: "relative",
          display: "inline-block",
          ...props.styles,
        }}
        onClick={onClick}
      >
        <Editor
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue="<p>This is the initial content of the editor.</p>"
          init={{
            height: 500,
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
        <button onClick={log}>Log editor content</button>
      </div>
    </>
  );
});

export default TinyMCE;
