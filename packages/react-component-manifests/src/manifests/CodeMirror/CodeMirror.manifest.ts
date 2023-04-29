import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import { Id as iconSchemaId } from "@atrilabs/component-icon-manifest-schema";
import { Id as CSSTreeId } from "@atrilabs/app-design-forest/src/cssTree";
import { CSSTreeOptions } from "@atrilabs/app-design-forest";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest";
import { Id as CustomTreeId } from "@atrilabs/app-design-forest/src/customPropsTree";

const cssTreeOptions: CSSTreeOptions = {
  boxShadowOptions: true,
  flexContainerOptions: false,
  flexChildOptions: true,
  positionOptions: true,
  typographyOptions: true,
  spacingOptions: true,
  sizeOptions: true,
  borderOptions: true,
  outlineOptions: true,
  backgroundOptions: true,
  miscellaneousOptions: true,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    extensions: {
      type: "enum",
      options: [
        "css",
        "html",
        "java",
        "javascript",
        "json",
        "jsx",
        "php",
        "python",
        "rust",
        "sql",
        "typescript",
        "xml",
      ],
    },
    value: { type: "large_text" },
    theme: {
      type: "enum",
      options: ["light", "dark"],
    },
    autoFocus: { type: "boolean" },
    editable: { type: "boolean" },
    placeholder: { type: "text" },
    lineNumbers: { type: "boolean" },
    highlightActiveLineGutter: { type: "boolean" },
    highlightSpecialChars: { type: "boolean" },
    history: { type: "boolean" },
    foldGutter: { type: "boolean" },
    drawSelection: { type: "boolean" },
    dropCursor: { type: "boolean" },
    allowMultipleSelections: { type: "boolean" },
    indentOnInput: { type: "boolean" },
    syntaxHighlighting: { type: "boolean" },
    bracketMatching: { type: "boolean" },
    closeBrackets: { type: "boolean" },
    autocompletion: { type: "boolean" },
    rectangularSelection: { type: "boolean" },
    crosshairCursor: { type: "boolean" },
    highlightActiveLine: { type: "boolean" },
    highlightSelectionMatches: { type: "boolean" },
    closeBracketsKeymap: { type: "boolean" },
    defaultKeymap: { type: "boolean" },
    searchKeymap: { type: "boolean" },
    historyKeymap: { type: "boolean" },
    foldKeymap: { type: "boolean" },
    completionKeymap: { type: "boolean" },
    lintKeymap: { type: "boolean" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "CodeMirror", category: "Basics" },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: { minHeight: "25px", width: "100%" },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          lineNumbers: true,
          editable: true,
          placeholder: "// code",
          extensions: "html",
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onClick: [{ type: "do_nothing" }],
    },
    defaultCallbackHandlers: {
      onClick: [{ sendEventData: true }],
    },
  },
};

const iconManifest = {
  panel: { comp: "CommonIcon", props: { name: "CodeMirror" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "CodeMirror", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
