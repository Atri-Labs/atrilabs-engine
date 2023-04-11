import React, { forwardRef, useCallback, useMemo, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface ToolbarGroup {
  name?: string;
  items: string[];
}

const TinyMCE = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: {
      apiKey?: string;
      initialValue?: string;
      value?: string;
      disabled?: boolean;
      inline?: boolean;
      id?: string;
      contentEditable?: boolean;
      initOnMount?: boolean;
      tinymceScriptSrc?: string;
      plugins?: string | string[];
      toolbar?: boolean | string | string[] | Array<ToolbarGroup>;
      menubar?: boolean | string;
      statusbar?: boolean;
      branding?: boolean;
      resize?: boolean | "both";
      paste_data_images?: boolean;
    };
    onClick: (event: {
      eventX: number;
      eventY: number;
      x: number;
      y: number;
      width: number;
      height: number;
    }) => void;
    onEditorChange: (a: string, editor: Editor) => void;
    className?: string;
  }
>((props, ref) => {
  const editorRef = useRef(null);
  const key = useMemo(() => {
    if (props.custom.menubar || props.custom.toolbar) {
      return Math.random();
    }
  }, [props.custom.menubar, props.custom.toolbar]);

  //const menuBarItems = props.custom.menubar && props.custom.menubar.join(" ");
  const menuBarItems = useMemo(() => {
    return props.custom.menubar ? props.custom.menubar.join(" ") : true;
  }, [props.custom.menubar]);

  const toolBarItems = useMemo(() => {
    return props.custom.toolbar ? props.custom.toolbar.join(" | ") : true;
  }, [props.custom.toolbar]);

  console.log(
    `toolBarItems---, ${props.custom.menubar} toolbarItems---, ${typeof props
      .custom.toolbar}`
  );
  return (
    <>
      <div ref={ref}>
        <Editor
          key={key}
          onInit={(evt, editor) => (editorRef.current = editor)}
          apiKey="vbo3n4286tzeuhkofq29387ruvysf454vcs7hkm9gonqn017"
          initialValue={props.custom.initialValue}
          value={props.custom.value}
          disabled={props.custom.disabled}
          inline={props.custom.inline}
          id={props.custom.id}
          tinymceScriptSrc={props.custom.tinymceScriptSrc}
          init={{
            height: props.styles.height,
            width: props.styles.width,
            className: props.className,
            contentEditable: props.custom.contentEditable,
            initOnMount: props.custom.initOnMount,
            //content_style: `body { font-family:${props.styles.fontFamily}; font-size:14px }`,
            plugins: props.custom.plugins,
            toolbar: toolBarItems,
            menubar: menuBarItems,
            statusbar: props.custom.statusbar,
            branding: props.custom.branding,
            resize: props.custom.resize,
            paste_data_images: props.custom.paste_data_images,
          }}
        />
      </div>
    </>
  );
});

export default TinyMCE;
