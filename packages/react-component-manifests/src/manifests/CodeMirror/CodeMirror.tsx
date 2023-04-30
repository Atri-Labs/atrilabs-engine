import React, { forwardRef, useCallback, useState } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { java } from "@codemirror/lang-java";
import { json } from "@codemirror/lang-json";
import { php } from "@codemirror/lang-php";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";
import { CopyOutlined } from "@ant-design/icons";
import { ViewUpdate } from "@codemirror/view";

export type ExtensionType =
  | "css"
  | "html"
  | "java"
  | "javascript"
  | "php"
  | "json"
  | "rust"
  | "python"
  | "xml"
  | "sql"
  | "typescript";
export type ThemeType = "light" | "dark";

const CodeMirror = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    }
    custom: {
      value: string;
      theme: ThemeType;
      autoFocus?: boolean;
      placeholder?: string | HTMLElement;
      editable?: boolean;
      extensions: ExtensionType;
      lineNumbers?: boolean;
      highlightActiveLineGutter?: boolean;
      highlightSpecialChars?: boolean;
      history?: boolean;
      foldGutter?: boolean;
      drawSelection?: boolean;
      dropCursor?: boolean;
      allowMultipleSelections?: boolean;
      indentOnInput?: boolean;
      syntaxHighlighting?: boolean;
      bracketMatching?: boolean;
      closeBrackets?: boolean;
      autocompletion?: boolean;
      rectangularSelection?: boolean;
      crosshairCursor?: boolean;
      highlightActiveLine?: boolean;
      highlightSelectionMatches?: boolean;
      closeBracketsKeymap?: boolean;
      defaultKeymap?: boolean;
      searchKeymap?: boolean;
      historyKeymap?: boolean;
      foldKeymap?: boolean;
      completionKeymap?: boolean;
      lintKeymap?: boolean;
    };
    onClick: (event: {
      eventX: number;
      eventY: number;
      x: number;
      y: number;
      width: number;
      height: number;
    }) => void;
    onChange?(value: string, viewUpdate: ViewUpdate): void;
    id?: string;
    className?: string;
  }
>((props, ref) => {
  const [isCopied, setIsCopied] = useState(false);
  const [codeMirrorCode, setCodeMirrorValue] = useState("");

  const languageExtensions = {
    css: css(),
    html: html(),
    java: java(),
    javascript: javascript(),
    json: json(),
    jsx: javascript({ jsx: true }),
    php: php(),
    python: python(),
    rust: rust(),
    sql: sql(),
    typescript: javascript({ typescript: true }),
    xml: xml(),
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
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeMirrorCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000); // Remove "Copied!" after 1 seconds
    } catch (err) {
      setIsCopied(false);
    }
  };

  const handleChange = (value: string, viewUpdate: ViewUpdate) => {
    setCodeMirrorValue(value);
    if (props.onChange) {
      props.onChange(value, viewUpdate);
    }
  };

  return (
    <>
      <style>
        {`
        .copyButton{
           position: absolute;
            right:10px;
            top:5px;
            border: none;
            cursor: pointer;
            display:flex;
            gap:10px;
            align-items:center;
            background: transparent;
        }
        .copyButton span{
             order: 1;
         }     
        `}
      </style>
      <div
        className={props.className}
        ref={ref}
        style={{ position: "relative", display: "inline-block", ...props.styles }}
        onClick={onClick}
        id={props.id}
      >
        <ReactCodeMirror
          extensions={[languageExtensions[props.custom.extensions]]}
          value={props.custom.value}
          theme={props.custom.theme}
          autoFocus={props.custom.autoFocus}
          basicSetup={{
            lineNumbers: props.custom?.lineNumbers,
            highlightActiveLineGutter: props.custom?.highlightActiveLineGutter,
            highlightSpecialChars: props.custom?.highlightSpecialChars,
            history: props.custom?.history,
            foldGutter: props.custom?.foldGutter,
            drawSelection: props.custom?.drawSelection,
            dropCursor: props.custom?.dropCursor,
            allowMultipleSelections: props.custom?.allowMultipleSelections,
            indentOnInput: props.custom?.indentOnInput,
            syntaxHighlighting: props.custom?.syntaxHighlighting,
            bracketMatching: props.custom?.bracketMatching,
            closeBrackets: props.custom?.closeBrackets,
            autocompletion: props.custom?.autocompletion,
            rectangularSelection: props.custom?.rectangularSelection,
            crosshairCursor: props.custom?.crosshairCursor,
            highlightActiveLine: props.custom?.highlightActiveLine,
            highlightSelectionMatches: props.custom?.highlightSelectionMatches,
            closeBracketsKeymap: props.custom?.closeBracketsKeymap,
            defaultKeymap: props.custom?.defaultKeymap,
            searchKeymap: props.custom?.searchKeymap,
            historyKeymap: props.custom?.historyKeymap,
            foldKeymap: props.custom?.foldKeymap,
            completionKeymap: props.custom?.completionKeymap,
            lintKeymap: props.custom?.lintKeymap,
          }}
          editable={props.custom.editable}
          placeholder={props.custom.placeholder}
          onChange={handleChange}
        />
        <button className="copyButton" onClick={copyToClipboard}>
          <CopyOutlined />
          {isCopied && <p>Copied!</p>}
        </button>
      </div>
    </>
  );
});

export default CodeMirror;
