import React, { forwardRef, useMemo } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import { ReactComponent as Icon } from "./icon.svg";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";

export const DataTable = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      rows: { [field: string]: string | number | null }[];
      cols: GridColDef[];
      checkboxSelection?: boolean;
      rowHeight?: number;
      numRows?: number;
      autoHeight?: boolean;
      selection?: GridRowId[];
    };
    onSelectionChange?: (selection: GridRowId[]) => void;
    className?: string;
  }
>((props, ref) => {
  return (
    <div className={props.className} ref={ref} style={props.styles}>
      <DataGrid
        autoHeight={props.custom.autoHeight}
        rowHeight={props.custom.rowHeight || 20}
        rows={props.custom.rows}
        columns={props.custom.cols}
        pageSize={props.custom.numRows || 10}
        rowsPerPageOptions={[props.custom.numRows || 10]}
        checkboxSelection={props.custom.checkboxSelection}
        onSelectionModelChange={(model, _details) => {
          props.onSelectionChange?.(model);
        }}
        selectionModel={props.custom.selection || []}
      />
    </div>
  );
});

export const DevDataTable: typeof DataTable = forwardRef((props, ref) => {
  const rows = useMemo(() => {
    return [
      { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
      { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
      { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
      { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
      { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
      { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
      { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
      { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
      { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
      { id: 10, lastName: "Snow", firstName: "Jon", age: 35 },
      { id: 11, lastName: "Lannister", firstName: "Cersei", age: 42 },
      { id: 12, lastName: "Lannister", firstName: "Jaime", age: 45 },
      { id: 13, lastName: "Stark", firstName: "Arya", age: 16 },
      { id: 14, lastName: "Targaryen", firstName: "Daenerys", age: null },
      { id: 15, lastName: "Melisandre", firstName: null, age: 150 },
      { id: 16, lastName: "Clifford", firstName: "Ferrara", age: 44 },
      { id: 17, lastName: "Frances", firstName: "Rossini", age: 36 },
      { id: 18, lastName: "Roxie", firstName: "Harvey", age: 65 },
    ];
  }, []);
  const cols = [
    { field: "id", headerName: "ID" },
    { field: "firstName", headerName: "First name" },
    { field: "lastName", headerName: "Last name" },
    {
      field: "age",
      headerName: "Age",
      type: "number",
    },
  ];
  return (
    <DataTable {...props} ref={ref} custom={{ ...props.custom, rows, cols }} />
  );
});

const cssTreeOptions: CSSTreeOptions = {
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
    rows: { type: "array" },
    cols: { type: "array" },
    checkboxSelection: { type: "boolean" },
    autoHeight: { type: "boolean" },
    numRows: { type: "number" },
    rowHeight: { type: "number" },
    selection: { type: "array" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Table", category: "Data" },
  render: {
    comp: DataTable,
  },
  dev: {
    comp: DevDataTable,
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          height: "400px",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          rows: [],
          cols: [],
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onSelectionChange: [
        { type: "controlled", selector: ["custom", "selection"] },
      ],
    },
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Table", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Table", containerStyle: { padding: "1rem", svg: Icon } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
