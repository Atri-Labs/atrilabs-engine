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
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export const DataTable = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      rows: { [field: string]: string | number | null }[];
      cols: GridColDef[];
    };
  }
>((props, ref) => {
  return (
    <div ref={ref} style={props.styles}>
      <DataGrid
        rows={props.custom.rows}
        columns={props.custom.cols}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        onSelectionModelChange={(model, details) => {
          console.log("selected cell", model, details);
        }}
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
    ];
  }, []);
  props.custom.rows = rows;
  props.custom.cols = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 90,
    },
  ];
  return <DataTable {...props} ref={ref} />;
});

const cssTreeOptions: CSSTreeOptions = {
  flexContainerOptions: false,
  flexChildOptions: true,
  positionOptions: true,
  typographyOptions: true,
  spacingOptions: true,
  sizeOptions: true,
  borderOptions: true,
  backgroundOptions: true,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    rows: "array",
    cols: "array",
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
    attachCallbacks: {},
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
