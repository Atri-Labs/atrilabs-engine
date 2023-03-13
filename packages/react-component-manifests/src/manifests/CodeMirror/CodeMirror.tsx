import React, { forwardRef, useCallback } from "react";
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
  | "sql";
export type ThemeType = "light" | "dark";

const CodeMirror = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
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
    className?: string;
  }
>((props, ref) => {
  const languageExtensions = {
    javascript: javascript(),
    java: java(),
    rust: rust(),
    html: html(),
    xml: xml(),
    css: css(),
    python: python(),
    sql: sql(),
    php: php(),
    json: json(),
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
    <div
      className={props.className}
      ref={ref}
      style={props.styles}
      onClick={onClick}
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
      />
    </div>
  );
});

export default CodeMirror;
