import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const cssjs = require("postcss-js");
const postcss = require("postcss");

function jssToCss(jss: React.CSSProperties) {
  return postcss()
    .process(jss, { parser: cssjs, from: undefined })
    .then((code) => {
      return code.css + ";";
    });
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
      toolbar?: string[];
      menubar?: string[];
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
  const [contentStyles, setContentStyles] = useState<string>("");

  const key = useMemo(() => {
    if (props.custom.menubar || props.custom.toolbar) {
      return Math.random();
    }
  }, [props.custom.menubar, props.custom.toolbar]);

  const menuBarItems = useMemo(() => {
    if (!props.custom.menubar?.length) {
      return true;
    }
    return props.custom.menubar.join(" ");
  }, [props.custom.menubar]);

  const toolBarItems = useMemo(() => {
    if (!props.custom.toolbar?.length) {
      return true;
    }
    return props.custom.toolbar.join(" | ");
  }, [props.custom.toolbar]);

  useEffect(() => {
    const fetchData = async () => {
      const css = await jssToCss(props.styles);
      setContentStyles(css);
    };
    fetchData();
  }, [props.styles]);

  return (
    <div ref={ref}>
      <Editor
        key={key}
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
          content_style: `body {${contentStyles}}`,
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
  );
});

export default TinyMCE;
